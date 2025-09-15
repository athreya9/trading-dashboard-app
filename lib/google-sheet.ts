import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function getGoogleSheet(sheetTitle: string) {
  const credentialsJson = process.env.GSHEET_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error('The GSHEET_CREDENTIALS environment variable is not set.');
  }
  const credentials = JSON.parse(credentialsJson);

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error('The GOOGLE_SHEET_ID environment variable is not set.');
  }

  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];

  if (!sheet) {
    throw new Error(`'${sheetTitle}' sheet not found in the document.`);
  }

  return sheet;
}