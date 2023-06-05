import { sheets } from '../pages/api/googleSheetsServer';

export async function fetchData(useRange) {
  const spreadsheetId = '1ULLXHjmMf0ZdDy7XSaWrdel_xbESp3lAwfcLISHQ6Pk';
  const range = useRange;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = response.data.values;

  return values;
}
