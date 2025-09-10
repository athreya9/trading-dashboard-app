import { NextResponse } from 'next/server'
import { getISTTimestamp } from '@/lib/ist-utils';
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
    // Fetch last 2 rows to get previous close. Offset is rowCount - header - 2 rows.
    const offset = Math.max(0, sheet.rowCount - 1 - 2);
    const rows = await sheet.getRows({ limit: 2, offset });

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No data in Price_Data sheet' }, { status: 404 });
    }

    const latestRow = rows[rows.length - 1].toObject();
    const previousRow = rows.length > 1 ? rows[0].toObject() : latestRow;
    
    const data = {
      currentPrice: parseFloat(latestRow.close || '0'),
      todaysHigh: parseFloat(latestRow.high || '0'),
      todaysLow: parseFloat(latestRow.low || '0'),
      openingPrice: parseFloat(latestRow.open || '0'),
      previousClose: parseFloat(previousRow.close || '0'),
    };
    
    return NextResponse.json({
      success: true,
      data: data,
      timestamp: getISTTimestamp(),
      source: 'Google Sheets (Price_Data)',
      timezone: 'Asia/Kolkata'
    });
    
  } catch (error) {
    console.error('❌ Error fetching NIFTY data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data from Google Sheets',
      details: (error as Error).message,
      data: {
        currentPrice: 0,
        todaysHigh: 0,
        todaysLow: 0,
        openingPrice: 0,
        previousClose: 0,
      }
    }, { status: 500 });
  }
}