import { google } from "googleapis";

async function handler(req, res) {
  
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


  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: req.query.id,
    range: 'Categories!A:E'
  })

  //get last row in sheet
  const lastRow = response.data.values ? response.data.values.length + 1: 1
  const range = `Categories!A${lastRow}:K${lastRow}`

  try {

    if (req.method === "POST") {
      const budgetCategories = req.body;

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: req.query.id,
        range: range,
        requestBody: {
          values: budgetCategories,
        },
        valueInputOption: 'RAW',
      });

    }else if(req.method === 'GET'){
      const data = response.data
      res.json(data)
    }

  } catch (error) {
    console.error("Google Sheets API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(200).json({ message: res.data });
}

export default handler;
