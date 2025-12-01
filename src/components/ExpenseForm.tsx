import React, { useState } from 'react';
import type { Expense } from '../types';

type Props = {
  people: string[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
};

function ExpenseForm({ people, onAddExpense }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  function toggleSelect(name: string) {
    setSelected(prev => ({ ...prev, [name]: !prev[name] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!description.trim()) {
      alert('Please enter description');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!paidBy) {
      alert('Please select who paid');
      return;
    }

    const chosen = people.filter(p => selected[p]);
    const splitBetween = chosen.length ? chosen : [...people];

    if (splitBetween.length === 0) {
      alert('No participants to split between');
      return;
    }

    if (splitType === 'equal') {
      // Equal split - do not include `date` in payload (App will set it)
      const expensePayload: Omit<Expense, 'id' | 'date'> = {
        description: description.trim(),
        amount: amt,
        paidBy,
        splitBetween,
        splitType: 'equal',
      };
      onAddExpense(expensePayload);
      resetForm();
      return;
    }

    // splitType === 'custom' => collect custom amounts for each participant
    const parsedCustom: { [person: string]: number } = {};
    let sum = 0;
    for (const person of splitBetween) {
      // If user entered custom amounts in the small state inputs, use them.
      // Otherwise, prompt (keeps UI unchanged).
      const maybe = customAmounts[person];
      if (maybe !== undefined && maybe !== '') {
        const val = Number(maybe);
        if (isNaN(val) || val < 0) {
          alert(`Invalid custom amount for ${person}`);
          return;
        }
        parsedCustom[person] = Number(val.toFixed(2));
        sum += val;
        continue;
      }

      // fallback to prompt if no inline value provided
      let answer: string | null = null;
      let parsed = NaN;
      while (true) {
        answer = window.prompt(`Enter amount for ${person} (remaining total: ${(amt - sum).toFixed(2)})`, '');
        if (answer === null) {
          // user cancelled — abort submission
          return;
        }
        parsed = Number(answer);
        if (!isNaN(parsed) && parsed >= 0) break;
        alert('Please enter a valid number (0 or positive).');
      }
      parsedCustom[person] = Number(parsed.toFixed(2));
      sum += parsed;
    }

    // Allow a small rounding tolerance
    if (Math.abs(sum - amt) > 0.5) {
      alert(`Custom amounts sum to ${sum.toFixed(2)}, which does not match total ${amt.toFixed(2)}. Please try again.`);
      return;
    }

    const expensePayload: Omit<Expense, 'id' | 'date'> = {
      description: description.trim(),
      amount: amt,
      paidBy,
      splitBetween,
      splitType: 'custom',
      customAmounts: parsedCustom,
    };
    onAddExpense(expensePayload);
    resetForm();
  }

  function resetForm() {
    setDescription('');
    setAmount('');
    setDate('');
    setPaidBy('');
    setSplitType('equal');
    setSelected({});
    setCustomAmounts({});
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 mb-4">
            <label
              htmlFor="amount"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label
              htmlFor="date"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paidBy"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
                className="cursor-pointer"
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg_gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
                className="cursor-pointer"
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1"
              >
                <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={!!selected[person]}
                    onChange={() => toggleSelect(person)}
                    className="cursor-pointer"
                  />
                  <span>{person}</span>
                </label>

                {splitType === 'custom' && (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmounts[person] ?? ''}
                    onChange={(e) => setCustomAmounts(prev => ({ ...prev, [person]: e.target.value }))}
                    className="w-28 px-2 py-1 border rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center justify-center gap-1"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;