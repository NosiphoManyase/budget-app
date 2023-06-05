import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

type Expense = {
  name: string;
  amount: number;
};

type ExpensesProps = {
  setShowExpense: Dispatch<SetStateAction<boolean>>;
  setUpdateExpense: Dispatch<SetStateAction<boolean>>;
  updateExpense: boolean;
  categoryName: string;
};

type BudgetCategory = {
  categoryName: string;
  allocationAmount: number;
  amountUsed: number;
  percentUsed: string;
  expenses: Expense[]
};

const Expenses: React.FC<ExpensesProps> = ({ setShowExpense, setUpdateExpense, updateExpense, categoryName}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [addExpense, setAddExpense] = useState(false)
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  useEffect(() => {
    console.log('update expenses')
    const storedCategories = localStorage.getItem('budgetCategories');
  
    if (storedCategories) {
      console.log('storedCategories')
      console.log(categoryName)
      //get categories, find current category clicked to show
      const parsedCategories: BudgetCategory[] = JSON.parse(storedCategories);
      const categoryIndex = parsedCategories.findIndex(category => category.categoryName === categoryName)
      console.log(parsedCategories[categoryIndex].expenses)
      if(!updateExpense){
        
        setExpenses(parsedCategories[categoryIndex].expenses)
      } else {
        
        if(categoryIndex !== -1){
          const updatedCategories = [...parsedCategories];

          //update amount used and percentUsed
          const expenseTotal = expenses.reduce((accumulator, currentVal) =>(
            accumulator + currentVal.amount
          ), 0)
        
          const allocatedAmount = parsedCategories[categoryIndex].allocationAmount
          const amountUsed = allocatedAmount - expenseTotal
          console.log(allocatedAmount)
          console.log(expenseTotal)
          const percent = (expenseTotal / allocatedAmount) * 100

          updatedCategories[categoryIndex] = {
            ...updatedCategories[categoryIndex],
            amountUsed: expenseTotal,
            percentUsed: `${percent}`,
            expenses: expenses, // Set the updated expenses array
          }
          localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories))
          console.log('at amountUsed')
          setUpdateExpense(false)
        }
      }
    }
  }, [updateExpense]);

  const handleAddExpense = () => {
    const amount = parseFloat(newExpenseAmount);
    if (newExpenseName && !isNaN(amount)) {
      const newExpense: Expense = {
        name: newExpenseName,
        amount: amount,
      };
      setExpenses([...expenses, newExpense]);
      setNewExpenseName('');
      setNewExpenseAmount('');
      setAddExpense(false)
      setUpdateExpense(true)
    }
  };

  const deleteExpense = (expenseName: string) => {
    
     const updatedExpenses = expenses.filter(expense => expense.name !== expenseName)
     console.log(updatedExpenses);
     setExpenses(updatedExpenses);
     setUpdateExpense(true)

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
