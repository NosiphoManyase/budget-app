import { useEffect, useState } from "react";
import Expenses from "./Expenses";
// import PopUpExpenses from "./PopUpExpenses";
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { Cross1Icon} from '@radix-ui/react-icons';
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

type selectedCategory = string | null

const MainContent = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [addingToBudget, setAddingToBudget] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");
  const [showExpense, setShowExpense] = useState(false);
  const [update, setUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<selectedCategory>(null);

  const sheetName = 'Categories'
  const router = useRouter()
  const username = Cookies.get('username')
  // console.log(username)
  const userId = String(username)

  useEffect(() => {
  
     fetchData( userId, sheetName)
        .then(rows => {
          console.log(selectedCategory)
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
    setAllocationAmount("");
    setAddingToBudget(false);
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

  const closePopUp = () => {
    setSelectedCategory(null)
    console.log(selectedCategory)
    console.log('closing ')
    setUpdate(true)
  }

  return (
    <div className="w-full h-screen px-4 py-4">
     
        {!budgetCategories.length && !addingToBudget && (
          <div className="w-full h-[50%] flex items-center justify-center">
            <Spinner />
          </div>
        )}
        
        {(budgetCategories.length || addingToBudget) && (
          <div className="w-[90%] md:w-[80%] mx-auto mb-[50px]">

            {budgetCategories.length > 0 && (
              <div className="my-6 rounded-md  bg-indigo-100 shadow-xl">
                  <div className="grid grid-cols-3 sm:grid-cols-6 px-4 py-2 bg-indigo-300 rounded-t-md items-center p-1 text-sm md:text-lg font-semibold ">
                    <p>Expense Categories</p>
                    <p className="hidden sm:block">Total Allocation</p>
                    <p className="">Amount Used</p>
                    <p>Percent Used</p>
                    <p className="hidden sm:block justify-self-center ">Expenses</p>
                  </div>
                  {budgetCategories.map((category, index) => (
                  <div key={index}
                  className="px-4 py-2">
                    <div  
                      className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 pb-0 items-center ml-1"
                    >
                      <p> {category.categoryName}</p> 
                      <p className="hidden sm:block">R{category.allocationAmount}</p>
                      <p>R{category.amountUsed} </p>
                      <div>{category.percentUsed ? category.percentUsed : 0}%
                      </div>
                      <p
                        onClick={() => showCategoryExpenses(category.categoryName)}
                        className="hidden sm:block mx-auto"
                      >
                        <EyeOpenIcon />
                      </p>

                      <div onClick={() => handleDeleteCategory(category.categoryName)}
                        className="hidden sm:block w-max text-sm lg:w-max text-[#272643] bg-amber-200 border-2 border-amber-400 font-semibold px-2 py-1 rounded-lg ml-auto mx-auto cursor-pointer">
                        delete
                      </div>

                      {/* If in small view */}
                      <div className="relative md:hidden">

                        <span className="font-bold underline hover:cursor-pointer"
                         onClick={() => setSelectedCategory(category.categoryName)}>
                          actions
                        </span>
                        
                        {selectedCategory === category.categoryName && (<div className="block absolute z-10 bg-indigo-300 w-[200px] px-4 py-2">
                          <p className="ml-auto w-min hover:cursor-pointer"
                            onClick={closePopUp}
                          ><Cross1Icon /> </p>  
                          <p onClick={() => handleDeleteCategory(category.categoryName)}
                          className="focus:underline hover:underline hover:cursor-pointer">delete</p>
                          <p onClick={() => showCategoryExpenses(category.categoryName)}
                          className="focus:underline hover:underline hover:cursor-pointer"
                          >show expenses</p>
                        </div>
                        )}
                      </div>

                    </div>
                    {/* don't underline last items */}
                    {index != budgetCategories.length - 1 && <hr className="border-b border-gray-300 w-[98%] mx-auto mt-1"/>}
                    </div>
                  ))}
                
              </div>
            )}

             <div className="flex justify-between items-center"> 
            <button onClick={() => setAddingToBudget(true)}
              className="w-max text-white bg-teal-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg"
            >Add Category</button>
            {addingToBudget && (<button onClick={() => setAddingToBudget(false)}
              className='mr-2 border-2 border-black px-2 rounded-full'
            >x</button>)
            }
            </div>

            {addingToBudget && (
              <div className="my-6">
                <div className="md:border-2 border-[#272643] md:w-max rounded-md">
                  <input
                    placeholder="Expense Category Name"
                    value={categoryName}
                    
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="focus:outline-none rounded-md px-1 mb-2 md:mb-0 block md:inline-block border-2 border-[#272643] md:border-none"
                  />
                  <input
                    placeholder="Allocation Amount"
                    value={allocationAmount}
                    onChange={(e) =>
                      setAllocationAmount(e.target.value)
                    }
                    className="focus:outline-none rounded-md px-1 mb-2 md:mb-0 block md:inline-block border-2 border-[#272643] md:border-none"
                  />
                  <button onClick={handleAddCategory}
                    className="block md:inline-block bg-[#0a2f35] text-white px-2 py-1 font-semibold"
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
