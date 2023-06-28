import { google } from "googleapis";

async function handler(req, res) {
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  console.log('auth: ',auth);
  const sheets = google.sheets({
    auth,
    version: "v4",
  });
  console.log('sheets: ',sheets);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: req.query.id,
    range: `${req.query.category}!A:E`
  })
  console.log('response: ',response);
  //get last row in sheet to get range
  const lastRow = response.data.values ? response.data.values.length + 1: 1
  const range = `${req.query.category}!A${lastRow}:E${lastRow}`

  try {

    if (req.method === "POST") {

      //if updating
      if(req.body.operation === "update") {
        const data = req.body.data;

        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: req.query.id,
          range: req.query.category,
          requestBody: {
            values: data,
          },
          valueInputOption: 'RAW',
        });

      }else if(req.body.operation === 'delete'){
        // if deleting expenses/expense
        const deleteRequests = req.body.deleteRequests
        // if deleting category
        const deleteRequest = req.body.deleteRequest
        
   
        //specific sheet targeted inside deleteRequests/s 
        const response = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: req.query.id,
          resource:{ 
            requests: deleteRequests?deleteRequests:deleteRequest,
          },   
      });

      }else if (req.body.operation == 'updateAll'){

        const response = await sheets.spreadsheets.values.update({
          spreadsheetId: req.query.id,
          range: req.body.range,
          valueInputOption: 'RAW',
          resource: {
            values: req.body.data
          },
        })
      }else if(req.body.operation == 'signup'){

        
      }

      res.status(200).json({ message: res.data });

    }else if(req.method === 'GET'){
      const data = response.data
      res.json(data)
    }

  } catch (error) {
    console.error("Google Sheets API Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } 

}

export default handler;