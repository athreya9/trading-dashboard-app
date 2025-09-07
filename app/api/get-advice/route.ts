import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Authenticate using your secure environment variable
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet('1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo', serviceAccountAuth);
    
    await doc.loadInfo(); // Loads the document properties and worksheets
    
    // Read from Advisor_Output tab
    const sheet = doc.sheetsByTitle['Advisor_Output'];
    
    if (!sheet) {
      return NextResponse.json({ error: 'Advisor_Output sheet not found' }, { status: 404 });
    }
    
    // Get all rows with data
    const rows = await sheet.getRows({ limit: 10, offset: 0 });
    
    if (rows.length === 0) {
      return NextResponse.json({ advice: 'No advice available' });
    }

    // Get the latest advice (first row after headers)
    const latestRow = rows[0];
    
    // Extract advice data using proper column access
    const rowData = latestRow.toObject();
    const advice = {
      recommendation: rowData['Recommendation'] || rowData['recommendation'] || 'No recommendation available',
      stock: rowData['Stock'] || rowData['stock'] || '',
      action: rowData['Action'] || rowData['action'] || '',
      price: rowData['Price'] || rowData['price'] || '',
      target: rowData['Target'] || rowData['target'] || '',
      stopLoss: rowData['StopLoss'] || rowData['stopLoss'] || '',
      confidence: rowData['Confidence'] || rowData['confidence'] || '',
      timestamp: rowData['Date'] || rowData['date'] || new Date().toISOString(),
    };

    return NextResponse.json({ 
      advice: advice.recommendation,
      details: advice,
      success: true 
    });
    
  } catch (error) {
    console.error('Error fetching advice:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch advice',
      details: (error as Error).message 
    }, { status: 500 });
  }
}