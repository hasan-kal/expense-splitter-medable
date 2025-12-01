import React from 'react';
import type { Expense } from '../types';
import { calculateBalances } from '../utils/calcBalances';

type Props = {
  people: string[];
  expenses: Expense[];
};

function BalanceView({ people, expenses }: Props) {
  const { balances, settlements } = calculateBalances(people, expenses);

  const totalSpending = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const formatMoney = (v: number) => `$${v.toFixed(2)}`;

  const isSettled = (amt: number) => Math.abs(amt) < 0.01;

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-6">
        <span>Total Group Spending:</span>
        <strong className="text-2xl">{formatMoney(totalSpending)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {people.map((person) => {
          const bal = balances[person] ?? 0;
          return (
            <div
              key={person}
              className="flex justify-between items-center px-3 py-3 mb-2 rounded-md transition-all hover:translate-x-1 bg-gray-100 border border-gray-300"
            >
              <span className="font-medium text-gray-800">{person}</span>
              <span className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{isSettled(bal) ? 'settled up' : (bal > 0 ? 'should receive' : 'owes')}</span>
                <strong className="text-gray-600 text-lg">{formatMoney(bal)}</strong>
              </span>
            </div>
          );
        })}
      </div>

      {/* settlements area: if no settlements show original green box, otherwise list settlements */}
      {settlements.length === 0 ? (
        <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
          <p>✅ All balances are settled!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-2">Suggested Settlements</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {settlements.map((s, i) => (
              <li key={i}>
                {s.from} → {s.to} : {formatMoney(s.amount)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BalanceView;