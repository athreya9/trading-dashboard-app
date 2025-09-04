// This is your secure API endpoint.
// It will run as a serverless function on Vercel.
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  try {
    // Authenticate using your secure environment variable
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet('1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo', serviceAccountAuth);
    
    await doc.loadInfo(); // Loads the document properties and worksheets
    const sheet = doc.sheetsByTitle['Price Data'];
    const rows = await sheet.getRows();

    const data = rows.map(row => row._rawData); // Extract the data from the rows

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}