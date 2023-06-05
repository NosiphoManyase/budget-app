import { google } from "googleapis";
import { request } from "http";

async function handler(req, res) {
  console.log("in handler");

  //get last row in sheet
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1ULLXHjmMf0ZdDy7XSaWrdel_xbESp3lAwfcLISHQ6Pk",
    range: 'Categories!A:A'
  })

  const lastRow = response.data.values ? response.data.values.length + 1: 1
  const range = `Categories!A${lastRow}:K${lastRow}`

  try {
    if (req.method === "POST") {
      // const { name, message } = req.body;
      const budgetCategories = req.body;

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({
        auth,
        version: "v4",
      });

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: "1ULLXHjmMf0ZdDy7XSaWrdel_xbESp3lAwfcLISHQ6Pk",
        range: "Categories!A3:C",
        requestBody: {
          values: budgetCategories,
        },
        valueInputOption: 'RAW',
      });
    }else if(req.method === 'GET'){
      const data = response.data

      return data
    }
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(200).json({ message: "Hey!" });
}

export default handler;
