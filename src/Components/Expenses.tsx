import { deleteExpenses, fetchData, updateAmounts, updateData } from '@/data/data';
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import Spinner from './Spinner';

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

const Expenses: React.FC<ExpensesProps> = ({ setShowExpense, setUpdate, update, categoryName}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [addExpense, setAddExpense] = useState(false)
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const sheetName = 'Expenses'
  const userId = 'Nosi123'

  useEffect(() => {
    
    setLoading(true)
    fetchData(userId, sheetName)
    // get data from current category shown
      .then(rows => rows.filter(row => row[1] === categoryName))
      .then(rows => {
          
          const allExpenses: Expense[] = rows.map(row => (
            {
              name: row[2],
              amount: parseInt(row[3])
            }
          ))
        setExpenses(allExpenses);
        setLoading(false)
      })
      setUpdate(false)
  }, [update]);


  const handleAddExpense = () => {
    const expense = [userId, categoryName, newExpenseName, newExpenseAmount]
    updateData(expense, sheetName)
    updateAmounts(userId, categoryName, newExpenseAmount)
    
      // N.B to fix sheet doesn't update before useeffect reruns
      setNewExpenseName('');
      setNewExpenseAmount(0);
      setAddExpense(false)
      setUpdate(true)
  };


  const deleteExpense = (expenseName: string, expenseAmount: number) => {

    deleteExpenses(categoryName, userId, expenseName)
    updateAmounts(userId, categoryName, -expenseAmount)
    .catch(err => console.error(err))
    setUpdate(true)
  }

  const resetExpenses = () => {
    deleteExpenses(categoryName, userId)
    updateAmounts(userId, categoryName)
    setExpenses([])
  }

  return (
    <div className='w-full h-screen border-t-4 border-[#272643]'>
      <div className='flex justify-between py-5'>
        <h1 className='text-xl font-semibold'>Expenses</h1>
        <div onClick={() => setShowExpense(false)}
          className='mr-2 border-2 border-black px-2 rounded-full'
        >x</div>
      </div>
      <div className='flex justify-between'>
        <button onClick={() => setAddExpense(true)}
          className='text-white bg-gray-900 px-4 py-1 rounded-lg font-semibold'
        >Add New</button>
        <button onClick={resetExpenses}
          className='text-white bg-[#f56038] px-4 py-1 rounded-lg font-semibold'
        >Reset</button>
      </div>

      {addExpense && (
        <div className='flex flex-col items-center bg-white shadow-lg my-3'>
          {addExpense && (<button onClick={() => setAddExpense(false)}
            className='self-end mr-2 mt-2 border-2 border-black px-2 rounded-full'
          >x</button>)}
        <div className="border-2 border-[#272643] w-max rounded-md my-6">
          <input
            placeholder="Expense Name"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            className="focus:outline-none rounded-md px-1"
          />
          <input
            placeholder="Expense Amount"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(parseInt(e.target.value))}
            className="focus:outline-none rounded-md px-1"
          />
          <button onClick={handleAddExpense}
            className="bg-[#0a2f35] text-white px-2 py-1 font-semibold"
          >add</button>
        </div>
        </div>
      )}

      {expenses.length === 0 && loading && (
        <div className='w-full h-[30%] flex items-center justify-center'> <Spinner /> </div>
      )}

      {expenses.length > 0 && (
        <div className='w-[50%] mt-[30px] border-2 border-[#f56038]  rounded-md'>
        <div className='grid grid-cols-3 bg-[#f56038] text-white text-lg font-medium '>
          <p>Expense</p>
          <p>Amount</p>
        </div>
        <div >
            {expenses.map((expense, index) => (
              <>
              <div key={index} className='grid grid-cols-3 py-1 items-center ml-1'>
                <p>{expense.name}</p>
                <p>{expense.amount}</p>
                <button onClick={() => deleteExpense(expense.name, expense.amount)}
                 className='w-max text-[#272643] bg-[#f7a325] px-2 py-1 rounded-lg ml-auto mx-auto cursor-pointer'
                >delete</button>   
              </div>
              {/* don't underline last items */}
              {index != expenses.length - 1 && <hr className="border-b border-[#272643] w-[98%] mx-auto"/>}
              </>
            ))}
        </div>
        </div>
      )}

    </div>
  );
};

export default Expenses;
