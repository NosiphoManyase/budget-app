import {fetchData} from '../services/googleSheetsClient'

interface FetchDataProps {
  useRange: string;
}

const FetchData = async ({ useRange }: FetchDataProps) => {
  const values = await fetchData(useRange);

  return values;

//update data
// const values = [
//   ['New value 1', 'New value 2'],
//   ['New value 3', 'New value 4'],
// ]

// const response = await sheets.spreadsheets.values.update({
//   spreadsheetId,
//   range,
//   valueInputOption: 'USER_ENTERED', // Specify how the values are inputted
//   resource: {
//     values,
//   },
// });
}

export default FetchData
