import { useEffect, useState } from "react";
import Expenses from "./Expenses";
import PopUpExpenses from "./PopUpExpenses";
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { deleteCategory, deleteExpenses, fetchData, updateData } from "@/data/data";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

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
  const [allocationAmount, setAllocationAmount] = useState("");
  const [showExpense, setShowExpense] = useState(false);
  const [update, setUpdate] = useState(false);

  const sheetName = 'Categories'
  const router = useRouter()
  const username = Cookies.get('username')
  // console.log(username)
  const userId = String(username)

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
    setUpdate(false)
  }, [update]);

  const handleAddCategory = () => {
    //nb check if user p
    const amount = Number(allocationAmount);
  
    if (categoryName) {

      const newCategory: BudgetCategory = {
        userId,
        categoryName,
        allocationAmount: amount,
        amountUsed: 0,
        percentUsed: "0",
      }

      const newCategoryArray = Object.values(newCategory)
      updateData(newCategoryArray, sheetName) 

    }

    setCategoryName("");
    setAllocationAmount('R');
    setCreatingBudget(false);
    setUpdate(true);

  };

  const showCategoryExpenses = (categoryName: string) => {
    setShowExpense(true);
    setCategoryName(categoryName);
  };

  const handleDeleteCategory = (categoryName: string) => {
    deleteExpenses(categoryName, userId);
    deleteCategory(categoryName, userId)
    setUpdate(true)
    setShowExpense(false)
  }

  return (
    <div className="w-full h-screen px-4 py-4">
     
        {!budgetCategories.length && !creatingBudget && (
          <div className="w-full h-[50%] flex items-center justify-center">
            <Spinner />
          </div>
        )}
        
        {(budgetCategories.length || creatingBudget) && (
          <div className="w-[70%] mx-auto mb-[50px]">

            {budgetCategories.length > 0 && (
              <div className="my-6 border-2 border-[#0a2f35] rounded-md">
                  <div className="grid grid-cols-6 border-2 border-b-8 border-[#0a2f35] rounded-t-md items-center  p-1 text-lg font-medium ">
                    <p>Expense Categories</p>
                    <p>Total Allocation</p>
                    <p>Amount Used</p>
                    <p>Percent Used</p>
                    <p className="justify-self-center">Expenses</p>
                    
                  </div>
                  {budgetCategories.map((category, index) => (
                  <div key={index}>
                    <div  
                      className="grid grid-cols-6 gap-1 p-1 items-center ml-1"
                    >
                      <p> {category.categoryName}</p> 
                      <p>R{category.allocationAmount}</p>
                      <p>R{category.amountUsed} </p>
                      <p>{category.percentUsed ? category.percentUsed : 0}%</p>
                        {/* <PopUpExpenses
                        setShowExpense={setShowExpense}
                        categoryName={category.categoryName}
                        setUpdate={setUpdate}
                        update={update}
                      /> */}
                      <p
                        onClick={() => showCategoryExpenses(category.categoryName)}
                        className="mx-auto"
                      >
                        <EyeOpenIcon />
                      </p>
                      <p onClick={() => handleDeleteCategory(category.categoryName)}
                        className="w-max text-[#272643] bg-[#f7a325] px-2 py-1 rounded-lg ml-auto mx-auto cursor-pointer">
                        delete
                      </p>
                    </div>
                    {/* don't underline last items */}
                    {index != budgetCategories.length - 1 && <hr className="border-b border-[#272643] w-[98%] mx-auto"/>}
                    </div>
                  ))}
                
              </div>
            )}

             <div className="flex justify-between items-center"> 
            <button onClick={() => setCreatingBudget(true)}
              className="w-max text-white bg-[#f56038] px-4 py-2 rounded-lg font-semibold hover:shadow-lg"
            >Add Category</button>
            {creatingBudget && (<button onClick={() => setCreatingBudget(false)}
              className='mr-2 border-2 border-black px-2 rounded-full'
            >x</button>)
            }
            </div>

            {creatingBudget && (
              <div className="my-6">
                <div className="border-2 border-[#272643] w-max rounded-md">
                  <input
                    placeholder="Expense Category Name"
                    value={categoryName}
                    
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="focus:outline-none rounded-md px-1"
                  />
                  <input
                    placeholder="Allocation Amount"
                    value={allocationAmount}
                    onChange={(e) =>
                      setAllocationAmount(e.target.value)
                    }
                    className="focus:outline-none rounded-md px-1"
                  />
                  <button onClick={handleAddCategory}
                    className="bg-[#0a2f35] text-white px-2 py-1 font-semibold"
                  >add</button>
                </div>
              </div>
            )}

          </div>
        )}

          {showExpense && (
            <div className="w-[70%] mx-auto">
            <Expenses 
              setShowExpense={setShowExpense}
              categoryName={categoryName}
              setUpdate={setUpdate}
              update={update}
            />
            </div>
            
          )}
        
    </div>
  )
}

export default MainContent;
