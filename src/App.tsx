import { useState } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import { initialPeople, initialExpenses } from './initialData';
import type { Expense } from './types';

function App() {
  // shared state
  const [people, setPeople] = useState<string[]>(initialPeople ?? []);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses ?? []);

  // add a person (simple duplicate check)
  const addPerson = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (people.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      alert('Person already exists');
      return;
    }
    setPeople(prev => [...prev, trimmed]);
  };

  // remove person and remove them from expense splits / customAmounts
  const removePerson = (name: string) => {
    setPeople(prev => prev.filter(p => p !== name));
    setExpenses(prev =>
      prev
        .map(exp => {
          const updatedSplitBetween = exp.splitBetween.filter(p => p !== name);
          const updatedCustom = exp.customAmounts
            ? Object.fromEntries(Object.entries(exp.customAmounts).filter(([k]) => k !== name))
            : undefined;
          return { ...exp, splitBetween: updatedSplitBetween, customAmounts: updatedCustom };
        })
        .filter(e => e.splitBetween.length > 0) // drop expense if no participants left
    );
  };

  // add an expense: App assigns id & date
  const addExpense = (payload: Omit<Expense, 'id' | 'date'>) => {
    const nextId = expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    const newExpense: Expense = { ...payload, id: nextId, date: new Date().toISOString() };
    setExpenses(prev => [...prev, newExpense]);
  };

  // delete an expense
  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="p-8">
        <div className="max-w-7xl mx-auto flex gap-8" style={{ minWidth: '1000px' }}>
          <div style={{ width: '50%', minWidth: '500px' }}>
            {/* UI unchanged — now receives props */}
            <PeopleManager people={people} onAddPerson={addPerson} onRemovePerson={removePerson} />
            <ExpenseForm people={people} onAddExpense={addExpense} />
          </div>

          <div style={{ width: '50%', minWidth: '500px' }}>
            <BalanceView people={people} expenses={expenses} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;