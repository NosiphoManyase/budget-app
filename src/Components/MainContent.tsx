import { useEffect, useState } from "react";
import Expenses from "./Expenses";
import PopUpExpenses from "./PopUpExpenses";
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { deleteCategory, deleteExpenses, fetchData, updateData } from "@/data/data";

export type BudgetCategory = {
  userId: string,
  categoryName: string;
  allocationAmount: number;
  amountUsed: number;
  percentUsed: string;
};

const MainContent = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [creatingBudget, setCreatingBudget] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [allocationAmount, setAllocationAmount] = useState(0);
  const [showExpense, setShowExpense] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);

  const sheetName = 'Categories'
  const userId = 'Nosi123'

  useEffect(() => {
  
     fetchData( userId, sheetName)
        .then(rows => {
          //save categories in object format to budget categories
        const allCategories: BudgetCategory[] = rows.map((categories) =>(
          {
            userId: categories[0],
            categoryName: categories[1],
            allocationAmount: parseFloat(categories[2]),
            amountUsed: parseFloat(categories[3]),
            percentUsed: categories[4],
          }
        ))
          setBudgetCategories(allCategories)
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    
  }, [updateExpense]);

  const handleCreateBudget = () => {
    setCreatingBudget(true);
  };

  const handleAddCategory = () => {
    const amount = allocationAmount;
  
    if (categoryName && !isNaN(amount)) {

      const newCategory: BudgetCategory = {
        userId,
        categoryName,
        allocationAmount: amount,
        amountUsed: 0,
        percentUsed: "0",
      }

      const newCategoryArray = Object.values(newCategory)
      updateData(newCategoryArray, sheetName) 

      setCategoryName("");
      setAllocationAmount(0);
    }
  };

  const handleDone = () => {
    setCreatingBudget(false);
    setUpdateExpense(true);
  };

  const showCategoryExpenses = (categoryName: string) => {
    setShowExpense(true);
    setCategoryName(categoryName);
  };

  const handleDeleteCategory = (categoryName: string) => {
    deleteExpenses(categoryName, userId);
    deleteCategory(categoryName, userId)
  }

  return (
    <div className="flex w-full h-screen px-4 py-4">
      <div className="w-[15%] border-r border-gray-400">
        <button onClick={() => setCreatingBudget(true)}>Add Category</button>
      </div>
        {!budgetCategories.length && !creatingBudget && (
          <button onClick={handleCreateBudget}>Create Budget</button>
        )}
        {(budgetCategories.length || creatingBudget) && (
          <div className="w-[70%] mx-auto">
            {creatingBudget && (
              <div className="my-6">
                <div>
                  <input
                    placeholder="Budget Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <input
                    placeholder="Allocation Amount"
                    value={allocationAmount}
                    onChange={(e) =>
                      setAllocationAmount(Number(e.target.value))
                    }
                  />
                  <button onClick={handleAddCategory}>Add</button>
                </div>
                <button onClick={handleDone}>Done</button>
              </div>
            )}

            {budgetCategories.length > 0 && (
              <div className="my-6">
                <div className="">
                  <div className="flex justify-between">
                    <p>Category Name</p>
                    <p>Total Allocation</p>
                    <p>Amount Used</p>
                    <p>Percent Used</p>
                    <p>Expenses</p>
                    <p>---</p>
                  </div>
                  {budgetCategories.map((category, index) => (
                    <div key={index} className="flex justify-between">
                      <p> {category.categoryName}</p>
                      <p>R{category.allocationAmount}</p>
                      <p>{category.amountUsed} </p>
                      <p>{category.percentUsed ? category.percentUsed : 0}%</p>
                        {/* <PopUpExpenses
                        setShowExpense={setShowExpense}
                        categoryName={category.categoryName}
                        setUpdateExpense={setUpdateExpense}
                        updateExpense={updateExpense}
                      /> */}
                      <p
                      onClick={() => showCategoryExpenses(category.categoryName)}
                      >
                        <EyeOpenIcon />
                      </p>
                      <p onClick={() => handleDeleteCategory(category.categoryName)}>delete</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showExpense && (
              <Expenses 
                setShowExpense={setShowExpense}
                categoryName={categoryName}
                setUpdateExpense={setUpdateExpense}
                updateExpense={updateExpense}
              />
              
            )}
          </div>
        )}
    </div>
  )
}

export default MainContent;
