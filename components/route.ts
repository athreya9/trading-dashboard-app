import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

async function getPriceDataSheet() {
  const credentials = JSON.parse(process.env.GSHEET_CREDENTIALS || '{}');
  const sheetId = process.env.GOOGLE_SHEET_ID || '1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo';

  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Price_Data'];
  if (!sheet) {
    throw new Error("'Price_Data' sheet not found in the document.");
  }
  return sheet;
}

export async function GET() {
  try {
    const sheet = await getPriceDataSheet();
    // Fetch last 50 data rows for the chart
    const offset = Math.max(0, sheet.rowCount - 1 - 50);
    const rows = await sheet.getRows({ limit: 50, offset });
    const priceData = rows.map(row => row.toObject());

    return NextResponse.json({ success: true, data: priceData });
  } catch (error) {
    console.error('❌ Error fetching price data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch price data',
      details: (error as Error).message
    }, { status: 500 });
  }
}