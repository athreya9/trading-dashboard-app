import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GSHEET_CREDENTIALS || '{}');
    const sheetId = process.env.GOOGLE_SHEET_ID || '1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo';
    
    // Check if credentials are available
    if (!credentials.client_email || !credentials.private_key) {
      return NextResponse.json({
        success: false,
        error: 'Missing Google Sheets credentials. Please check GSHEET_CREDENTIALS environment variable.',
        hasCredentials: false,
        hasSheetId: !!sheetId
      }, { status: 400 });
    }
    
    // Authenticate using the new environment variable format
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    
    // Test the connection
    await doc.loadInfo();
    
    // Get sheet names for debugging
    const sheetNames = doc.sheetsByIndex.map(sheet => sheet.title);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Google Sheets!',
      spreadsheet: {
        title: doc.title,
        sheetCount: doc.sheetCount,
        sheetNames: sheetNames,
        sheetId: sheetId
      },
      authentication: {
        serviceAccount: credentials.client_email,
        hasPrivateKey: !!credentials.private_key
      }
    });
    
  } catch (error: any) {
    console.error('❌ Google Sheets authentication test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}