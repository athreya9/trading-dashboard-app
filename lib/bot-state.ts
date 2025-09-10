import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { formatISTTimeOnly } from './ist-utils';

// Shared bot state across all API endpoints
interface BotState {
  status: 'running' | 'stopped' | 'error' | 'loading'
  lastStarted: string | null
  lastStopped: string | null
  uptime: string | null
  tradesExecuted: number
  marketHours: boolean
}

// Default bot state
const defaultBotState: BotState = {
  status: 'stopped',
  lastStarted: null,
  lastStopped: null,
  uptime: null,
  tradesExecuted: 0,
  marketHours: false
}

async function getGoogleSheetsDoc() {
  try {
    const credentials = JSON.parse(process.env.GSHEET_CREDENTIALS || '{}');
    const sheetId = process.env.GOOGLE_SHEET_ID || '1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo';
    
    const serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error('❌ Failed to connect to Google Sheets:', error);
    throw error;
  }
}

async function getBotControlSheet(doc: GoogleSpreadsheet) {
  try {
    // Try to get existing Bot_Control sheet
    let sheet = doc.sheetsByTitle['Bot_Control'];
    if (!sheet) {
      // Create Bot_Control sheet if it doesn't exist
      console.log('📝 Creating Bot_Control sheet...');
      sheet = await doc.addSheet({ 
        title: 'Bot_Control',
        headerValues: ['parameter', 'value']
      });
      
      // Initialize with default values
      await sheet.addRows([
        { parameter: 'status', value: 'stopped' },
        { parameter: 'lastStarted', value: '' },
        { parameter: 'lastStopped', value: '' },
        { parameter: 'uptime', value: '' },
        { parameter: 'tradesExecuted', value: '0' },
        { parameter: 'marketHours', value: 'false' }
      ]);
    }
    return sheet;
  } catch (error) {
    console.error('❌ Failed to get/create Bot_Control sheet:', error);
    throw error;
  }
}

export async function getBotState(): Promise<BotState> {
  try {
    const doc = await getGoogleSheetsDoc();
    const sheet = await getBotControlSheet(doc);
    const rows = await sheet.getRows();
    
    const state: BotState = { ...defaultBotState };
    
    for (const row of rows) {
      const param = row.get('parameter');
      const value = row.get('value');
      
      switch (param) {
        case 'status':
          state.status = value || 'stopped';
          break;
        case 'lastStarted':
          state.lastStarted = value || null;
          break;
        case 'lastStopped':
          state.lastStopped = value || null;
          break;
        case 'uptime':
          state.uptime = value || null;
          break;
        case 'tradesExecuted':
          state.tradesExecuted = parseInt(value) || 0;
          break;
        case 'marketHours':
          state.marketHours = value === 'true';
          break;
      }
    }
    
    console.log('✅ Bot state loaded from Google Sheets:', state);
    return state;
  } catch (error) {
    console.error('❌ Failed to get bot state, using default:', error);
    return { ...defaultBotState };
  }
}

export async function updateBotState(updates: Partial<BotState>): Promise<BotState> {
  try {
    const doc = await getGoogleSheetsDoc();
    const sheet = await getBotControlSheet(doc);
    const rows = await sheet.getRows();
    
    // Update each parameter
    for (const [key, value] of Object.entries(updates)) {
      const row = rows.find(r => r.get('parameter') === key);
      if (row) {
        row.set('value', String(value));
        await row.save();
      } else {
        // Add new parameter if it doesn't exist
        await sheet.addRow({ parameter: key, value: String(value) });
      }
    }
    
    // Return updated state
    const updatedState = await getBotState();
    console.log('✅ Bot state updated in Google Sheets:', updatedState);
    return updatedState;
  } catch (error) {
    console.error('❌ Failed to update bot state:', error);
    throw error;
  }
}