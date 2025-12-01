import type { Expense } from '../types';

export type BalancesResult = {
  balances: Record<string, number>;
  settlements: { from: string; to: string; amount: number }[];
};

/**
 * Calculate net balances per person and a simple settlement list (who pays who).
 * People are referenced by name (strings) in this project.
 */
export function calculateBalances(people: string[], expenses: Expense[]): BalancesResult {
  const balances: Record<string, number> = {};
  people.forEach(p => (balances[p] = 0));

  // For each expense:
  // - payer gets +amount
  // - each participant gets -their share
  for (const e of expenses) {
    const amount = Number(e.amount) || 0;
    const payer = e.paidBy;
    if (!(payer in balances)) balances[payer] = 0;
    balances[payer] = Number((balances[payer] + amount).toFixed(2));

    // compute shares
    if (e.splitType === 'equal') {
      const n = e.splitBetween.length || 1;
      const share = Number((amount / n).toFixed(2));
      for (const person of e.splitBetween) {
        if (!(person in balances)) balances[person] = 0;
        balances[person] = Number((balances[person] - share).toFixed(2));
      }
    } else {
      // custom amounts provided in customAmounts map (person -> number)
      if (e.customAmounts) {
        for (const person of e.splitBetween) {
          const share = Number(e.customAmounts[person] ?? 0);
          if (!(person in balances)) balances[person] = 0;
          balances[person] = Number((balances[person] - share).toFixed(2));
        }
      } else {
        // fallback to equal if custom missing
        const n = e.splitBetween.length || 1;
        const share = Number((amount / n).toFixed(2));
        for (const person of e.splitBetween) {
          if (!(person in balances)) balances[person] = 0;
          balances[person] = Number((balances[person] - share).toFixed(2));
        }
      }
    }
  }

  // Build creditors and debtors arrays (positive = credit, negative = debt)
  const creditors = Object.entries(balances)
    .map(([name, val]) => ({ name, amount: Number(val.toFixed(2)) }))
    .filter(x => x.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balances)
    .map(([name, val]) => ({ name, amount: Number((-val).toFixed(2)) })) // positive owed amount
    .filter(x => x.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const settlements: { from: string; to: string; amount: number }[] = [];

  let i = 0;
  let j = 0;
  while (i < creditors.length && j < debtors.length) {
    const give = Math.min(creditors[i].amount, debtors[j].amount);
    if (give > 0.009) {
      settlements.push({ from: debtors[j].name, to: creditors[i].name, amount: Number(give.toFixed(2)) });
    }
    creditors[i].amount = Number((creditors[i].amount - give).toFixed(2));
    debtors[j].amount = Number((debtors[j].amount - give).toFixed(2));
    if (Math.abs(creditors[i].amount) < 0.01) i++;
    if (Math.abs(debtors[j].amount) < 0.01) j++;
  }

  return { balances, settlements };
}