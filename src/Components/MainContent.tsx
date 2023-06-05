import { useEffect, useState } from "react";
import Expenses from "./Expenses";
import PopUpExpenses from "./PopUpExpenses";
import { EyeOpenIcon } from '@radix-ui/react-icons';
import FetchData from "./FetchData";
// import handler from "@/pages/api/hello";

type BudgetCategory = {
  categoryName: string;
  allocationAmount: number;
  amountUsed: number;
  percentUsed: string;
  expenses: [];
};

const MainContent = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    []
  );
  const [tempBudgetCategories, setTempBudgetCategories] = useState<
    BudgetCategory[]
  >([]);
  const [creatingBudget, setCreatingBudget] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [allocationAmount, setAllocationAmount] = useState(0);
  const [showExpense, setShowExpense] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);

  useEffect(() => {

    const storedCategories = localStorage.getItem("budgetCategories");
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setTempBudgetCategories(parsedCategories);
      setBudgetCategories(parsedCategories);
    }
    

    //getData
    const sheetData = fetch('/api/googleSheetsServer', {
      method: 'POST',
      body: JSON.stringify([
        ['nosi123', 'Camp', 'Car'],
      ]),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // console.log(sheetData)
  }, [updateExpense]);

  const handleCreateBudget = () => {
    setCreatingBudget(true);
  };

  const handleAddCategory = () => {
    const amount = allocationAmount;
    if (categoryName && !isNaN(amount)) {
      const newCategory: BudgetCategory = {
        categoryName,
        allocationAmount: amount,
        amountUsed: 0,
        percentUsed: "0",
        expenses: [],
      };
      const updatedCategories = [...tempBudgetCategories, newCategory];
      setTempBudgetCategories(updatedCategories);
      setCategoryName("");
      setAllocationAmount(0);

      // Store updated categories in local storage
      localStorage.setItem(
        "budgetCategories",
        JSON.stringify(updatedCategories)
      );
    }
  };

  const handleDone = () => {
    setCreatingBudget(false);
    setBudgetCategories([...budgetCategories, ...tempBudgetCategories]);
    setTempBudgetCategories([]);
  };

  const showCategoryExpenses = (categoryName: string) => {
    setShowExpense(true);
    setCategoryName(categoryName);
  };

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
  );
};

export default MainContent;

// const authClient = new google.auth.GoogleAuth({
//   credentials: {
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_PRIVATE_KEY,
//   },
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// export const sheets = google.sheets({ version: 'v4', auth: authClient });
