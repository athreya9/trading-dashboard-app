// This is your secure API endpoint for Next.js App Router
// It will run as a serverless function on Vercel.
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GSHEET_CREDENTIALS || '{}');
    const sheetId = process.env.GOOGLE_SHEET_ID || '1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo';
    
    // Authenticate using the new environment variable format
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    
    await doc.loadInfo(); // Loads the document properties and worksheets
    
    // Read from Advisor_Output tab instead of algo_predictions
    const sheet = doc.sheetsByTitle['Advisor_Output'];
    
    // Get a larger range to ensure we capture all trading signals
    // Read from A1 to H1000 to capture all columns and up to 1000 rows of data
    await sheet.loadCells('A1:H1000');
    
    // Get all rows with data (this will now include all rows up to 1000)
    const rows = await sheet.getRows({ limit: 1000, offset: 0 });

    const data = rows.map(row => row._rawData); // Extract the data from the rows

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}