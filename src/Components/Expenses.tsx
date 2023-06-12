import { deleteExpenses, fetchData, updateAmounts, updateData } from '@/data/data';
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

type Expense = {
  name: string;
  amount: number;
};

type ExpensesProps = {
  setShowExpense: Dispatch<SetStateAction<boolean>>;
  setUpdate: Dispatch<SetStateAction<boolean>>;
  update: boolean;
  categoryName: string;
};

type BudgetCategory = {
  categoryName: string;
  allocationAmount: number;
  amountUsed: number;
  percentUsed: string;
  expenses: Expense[]
};

const Expenses: React.FC<ExpensesProps> = ({ setShowExpense, setUpdate, update, categoryName}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [addExpense, setAddExpense] = useState(false)
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const sheetName = 'Expenses'
  const userId = 'Nosi123'

  useEffect(() => {
    
    fetchData(userId, sheetName)
    // get data from current category shown
      .then(rows => rows.filter(row => row[1] === categoryName))
      .then(rows => {
          console.log('useffect running')
          const allExpenses: Expense[] = rows.map(row => (
            {
              name: row[2],
              amount: parseInt(row[3])
            }
          ))
        setExpenses(allExpenses);
      })
      setUpdate(false)
  }, [update]);

  const handleAddExpense = () => {
    const expense = [userId, categoryName, newExpenseName, newExpenseAmount]
    updateData(expense, sheetName)
    updateAmounts(userId, categoryName, newExpenseAmount)
    
      // N.B to fix sheet doesn't update before useeffect reruns
      setNewExpenseName('');
      setNewExpenseAmount('');
      setAddExpense(false)
      setUpdate(true)
  };

  const deleteExpense = (expenseName: string) => {

    deleteExpenses(categoryName, userId, expenseName)
    .catch(err => console.log(err))
    setUpdate(true)
  }

  return (
    <div className='w-full h-screen'>
      <h1>Expenses</h1>
      <div onClick={() => setShowExpense(false)}>x</div>
      <button onClick={() => setAddExpense(true)}>Add New</button>
      <button onClick={() => setExpenses([])}>Reset Expenses</button>

      {addExpense && (
        <div>
          <input
            placeholder="Expense Name"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
          />
          <input
            placeholder="Expense Amount"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
          />
          <button onClick={handleAddExpense}>Add</button>
        </div>
      )}

      {expenses.length > 0 && (
        <div>
        <div className='flex justify-evenly'>
          <p>Expense</p>
          <p>Amount</p>
        </div>
        <div >
            {expenses.map((expense, index) => (
              <div key={index} className='flex justify-evenly'>
                <p>{expense.name}</p>
                <p>{expense.amount}</p>
                <button onClick={() => deleteExpense(expense.name)}>delete</button>
              </div>
            ))}
        </div>
        </div>
      )}

    </div>
  );
};

export default Expenses;
