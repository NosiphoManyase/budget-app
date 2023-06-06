import { BudgetCategory } from "@/Components/MainContent"

export const fetchData = (categoriesApiUrl: string,
   userId: string,
   setBudgetCategories: React.Dispatch<React.SetStateAction<BudgetCategory[]>>
) => {

  const getData = fetch( categoriesApiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
  .then(data =>{ 
    //remove first line with headings
    data.values.splice(0, 1)

    //get all categories under the user
    const currentUserCategories: string [] = data.values.filter((categories: string[]) => categories[0] === userId)
    console.log(currentUserCategories)

    //save categories in object format to budget categories
    const allCategories: BudgetCategory[] = currentUserCategories.map((categories) =>(
      {
        userId: categories[0],
        categoryName: categories[1],
        allocationAmount: parseFloat(categories[2]),
        amountUsed: parseFloat(categories[3]),
        percentUsed: categories[4],
      }
    ))
      console.log(allCategories)
    setBudgetCategories(allCategories)
  }) 

}

export const updateData = (newCategoryArray: (string | number) [], categoriesApiUrl: string) => {

  // add Data to sheet
  const addToData = fetch(categoriesApiUrl, {
    method: 'POST',
    body: JSON.stringify([
      newCategoryArray
    ]),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

