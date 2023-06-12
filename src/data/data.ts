import { BudgetCategory } from "@/Components/MainContent"

const ApiUrl = '/api/googleSheetsServer?id=1ULLXHjmMf0ZdDy7XSaWrdel_xbESp3lAwfcLISHQ6Pk'

export const fetchData = (
   userId: string,
   sheetName: string,
) => {

  return fetch( `${ApiUrl}&category=${sheetName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
  .then(data =>{ 
    //remove first line with headings
    data.values.splice(0, 1)

    //get all rows of data under the user
    const rows: string [] = data.values.filter((row: string[]) => row[0] === userId)
    
    return rows;  
  }) 

}

export const updateData = (newData: (string | number) [], sheetName: string) => {

  // add Data to sheet
  const addToData = fetch(`${ApiUrl}&category=${sheetName}`, {
    method: 'POST',
    body: JSON.stringify({
      operation: 'update',
      data: [newData],
  }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

}

export const updateAmounts = (userId: string, categoryName: string, expenseAmount: string) =>{
  return fetchData(userId, "Categories")
  .then(data => {
    //find index of current category
    const categoryIndex = data.findIndex(data => data[0] === userId && data[1] === categoryName)
    console.log(categoryIndex)
    // get total Amount + parsefloat(newData[3])
    if(categoryIndex != -1){
      console.log(data, categoryIndex)
      // get and update amounts from current category
      const categories: string[] = data
      const category = categories[categoryIndex]
      const totalAmount = parseInt(category[2])
      const amountUsed = parseInt(category[3]) + parseInt(expenseAmount)
      const percentUsed = (amountUsed / totalAmount) * 100 + '%'

      const updatedCategory = [userId, categoryName, totalAmount, amountUsed,  percentUsed]
      console.log(categoryIndex)
      console.log(category)

      return fetch(`${ApiUrl}&category=Categories`, {
        method: 'POST',
        body: JSON.stringify({
          operation: 'updateAll',
          range: `Categories!${categoryIndex + 2}:${categoryIndex + 2}`,
          data: [updatedCategory],
      }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    //calc percent used
    //update amount and percent used

  })
}

export const deleteExpenses = ( categoryName: string, userId: string, expenseName?: string) => {
  
  return fetchData(userId, 'Expenses')
    .then(data => {
      console.log(data)

      const sortIndices = data.map((data, i) => {
        if(expenseName){
          if (data[0] === userId && data[1] === categoryName && data[2] === expenseName) {
            return i;
          }
          else {
            return -1; 
          }
        }else{
          if(data[0] === userId && data[1] === categoryName){
            return i;
          }
          else {
            return -1; 
          }
        }
      }).filter(index => index !== -1);

      const indices: number[] = sortIndices;
      console.log(indices)
      
      const deleteRequests = indices.map(rowIndex => {
        return {
          deleteDimension: {
            range: {
              sheetId: '1828482324',
              dimension: 'ROWS',
              startIndex: rowIndex +1,
              endIndex: rowIndex + 2,
            },
          },
        };
      }).reverse();     

      console.log(deleteRequests)

      return fetch(`${ApiUrl}&category=Expenses`, {
        method: 'POST',
        body: JSON.stringify({
          operation: 'delete',
          deleteRequests
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
}


export const deleteCategory = ( categoryName: string, userId: string) => {
  
  return fetchData(userId, 'Categories')
    .then(data => {

      const categoryIndex = data.findIndex(category => category[0] === userId && category[1] === categoryName);
      console.log(categoryIndex)
      
      const deleteRequest = {
          deleteDimension: {
            range: {
              sheetId: '0',
              dimension: 'ROWS',
              startIndex: categoryIndex + 1,
              endIndex: categoryIndex + 2,
            },
          },
        }     

      return fetch(`${ApiUrl}&category=Categories`, {
        method: 'POST',
        body: JSON.stringify({
          operation: 'delete',
          deleteRequest
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
}


