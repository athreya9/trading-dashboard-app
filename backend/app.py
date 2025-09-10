from flask import Flask, jsonify, request
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
import os
import json
from datetime import datetime
import pytz

app = Flask(__name__)
CORS(app)

# Google Sheets setup
SCOPES = ['https://www.googleapis.com/spreadsheets/read-write']

def get_spreadsheet():
    """Initialize Google Sheets connection"""
    try:
        creds_json = os.getenv('GSHEET_CREDENTIALS')
        if not creds_json:
            # Fallback for older variable name for compatibility
            creds_json = os.getenv('GOOGLE_SHEETS_CREDENTIALS')
            if not creds_json:
                raise ValueError("GSHEET_CREDENTIALS environment variable not set")
        
        creds_dict = json.loads(creds_json)
        creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
        client = gspread.authorize(creds)
        
        spreadsheet_id = os.getenv('GOOGLE_SHEET_ID')
        if not spreadsheet_id:
            raise ValueError("GOOGLE_SHEET_ID environment variable not set")
            
        return client.open_by_key(spreadsheet_id)
    except Exception as e:
        print(f"Error connecting to Google Sheets: {e}")
        return None

def update_bot_state_in_sheet(sheet, updates):
    """Finds and updates key-value pairs in the Bot_Control sheet."""
    cells_to_update = []
    for param, value in updates.items():
        try:
            cell = sheet.find(param)
            cells_to_update.append(gspread.Cell(cell.row, cell.col + 1, str(value)))
        except gspread.exceptions.CellNotFound:
            print(f"Parameter '{param}' not found in sheet. Appending new row.")
            sheet.append_row([param, str(value)])
    
    if cells_to_update:
        sheet.update_cells(cells_to_update)

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Trading Bot Backend API",
        "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
    })

@app.route('/api/bot-status', methods=['GET'])
def get_bot_status():
    """Get current bot status from Bot_Control sheet"""
    try:
        spreadsheet = get_spreadsheet()
        if not spreadsheet:
            return jsonify({"error": "Failed to connect to Google Sheets"}), 500
        
        bot_control_sheet = spreadsheet.worksheet('Bot_Control')
        
        records = bot_control_sheet.get_all_records()
        if not records:
            return jsonify({"error": "No data found in Bot_Control sheet"}), 404
        
        state = {}
        for record in records:
            param = record.get('parameter')
            value = record.get('value')
            if param:
                state[param] = value

        # Type conversions for consistency with frontend expectations
        if 'marketHours' in state:
            state['marketHours'] = str(state['marketHours']).lower() == 'true'
        if 'tradesExecuted' in state:
            state['tradesExecuted'] = int(state['tradesExecuted']) if str(state['tradesExecuted']).isdigit() else 0
        
        return jsonify({**state, "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/start-bot', methods=['POST'])
def start_bot():
    """Start the trading bot by updating Bot_Control sheet"""
    try:
        spreadsheet = get_spreadsheet()
        if not spreadsheet:
            return jsonify({"error": "Failed to connect to Google Sheets"}), 500
        
        bot_control_sheet = spreadsheet.worksheet('Bot_Control')
        
        # Get current IST time
        ist_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        
        updates = {
            "status": "running",
            "lastStarted": ist_time.strftime('%I:%M:%S %p'),
            "marketHours": True
        }
        update_bot_state_in_sheet(bot_control_sheet, updates)
        
        return jsonify({
            "message": "Bot started successfully",
            "status": "running",
            "started_at": ist_time.isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stop-bot', methods=['POST'])
def stop_bot():
    """Stop the trading bot by updating Bot_Control sheet"""
    try:
        spreadsheet = get_spreadsheet()
        if not spreadsheet:
            return jsonify({"error": "Failed to connect to Google Sheets"}), 500
        
        bot_control_sheet = spreadsheet.worksheet('Bot_Control')
        
        # Get current IST time
        ist_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        
        updates = {
            "status": "stopped",
            "lastStopped": ist_time.strftime('%I:%M:%S %p'),
            "marketHours": False
        }
        update_bot_state_in_sheet(bot_control_sheet, updates)
        
        return jsonify({
            "message": "Bot stopped successfully",
            "status": "stopped",
            "stopped_at": ist_time.isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)