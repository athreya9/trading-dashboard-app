import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export function getGoogleSheetDoc(): GoogleSpreadsheet {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !email || !key) {
    // This error will now be caught by the API route's try/catch block instead of crashing the build
    throw new Error('Missing Google Sheets environment variables. Check GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in your Vercel project settings.');
  }

  // Vercel environment variables escape newlines. We need to un-escape them.
  const privateKey = key.replace(/\\n/g, '\n');

  const serviceAccountAuth = new JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return new GoogleSpreadsheet(sheetId, serviceAccountAuth);
}