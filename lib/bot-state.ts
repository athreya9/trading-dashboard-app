import { formatISTTimeOnly } from './ist-utils';
import { getGoogleSheetDoc } from './google-sheets';
import type { GoogleSpreadsheet } from 'google-spreadsheet';

// Shared bot state across all API endpoints
interface BotState {
  status: 'running' | 'stopped' | 'error' | 'loading'
  lastStarted: string | null
  lastStopped: string | null
  uptime: string | null
  tradesExecuted: number
  marketHours: boolean
  mode?: 'emergency' | 'full'
  modeLastChanged?: string
}

// Default bot state
const defaultBotState: BotState = {
  status: 'stopped',
  lastStarted: null,
  lastStopped: null,
  uptime: null,
  tradesExecuted: 0,
  marketHours: false,
  mode: 'emergency',
  modeLastChanged: null,
}

async function getBotControlSheet(doc: GoogleSpreadsheet) {
  try {
    await doc.loadInfo(); // Authenticate and load sheet info
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
        { parameter: 'marketHours', value: 'false' },
        { parameter: 'mode', value: 'emergency' },
        { parameter: 'modeLastChanged', value: '' },
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
    const doc = getGoogleSheetDoc();
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
        case 'mode':
          state.mode = value === 'full' ? 'full' : 'emergency';
          break;
        case 'modeLastChanged':
          state.modeLastChanged = value || null;
          break;
      }
    }
    
    console.log('✅ Bot state loaded from Google Sheets:', state);
    return state;
  } catch (error) {
    console.error('❌ Failed to get bot state from Google Sheets:', error);
    throw new Error(`Failed to retrieve bot state: ${(error as Error).message}`);
  }
}

export async function updateBotState(updates: Partial<BotState>): Promise<BotState> {
  try {
    const doc = getGoogleSheetDoc();
    const sheet = await getBotControlSheet(doc);
    const rows = await sheet.getRows();
    
    // For batch updates, it's more efficient to work with cells
    await sheet.loadCells('A1:B' + (rows.length + 1));

    const newRowsToAdd: { parameter: string, value: string }[] = [];
    const rowMap = new Map(rows.map(r => [r.get('parameter'), r]));

    for (const [key, value] of Object.entries(updates)) {
      const row = rowMap.get(key);
      if (row) {
        // Get cell in column B (index 1) for the correct row
        // row.rowNumber is 1-based and includes header, getCell is 0-indexed
        const cell = sheet.getCell(row.rowNumber - 1, 1);
        cell.value = String(value);
      } else {
        // Add new parameter if it doesn't exist
        newRowsToAdd.push({ parameter: key, value: String(value) });
      }
    }
    
    // Save all modified cells in a single API call
    await sheet.saveUpdatedCells();
    if (newRowsToAdd.length > 0) await sheet.addRows(newRowsToAdd);

    // Return updated state
    const updatedState = await getBotState();
    console.log('✅ Bot state updated in Google Sheets:', updatedState);
    return updatedState;
  } catch (error) {
    console.error('❌ Failed to update bot state:', error);
    throw error;
  }
}