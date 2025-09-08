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
        # Get credentials from environment variable
        creds_json = os.getenv('GOOGLE_SHEETS_CREDENTIALS')
        if not creds_json:
            raise ValueError("GOOGLE_SHEETS_CREDENTIALS environment variable not set")
        
        creds_dict = json.loads(creds_json)
        creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
        client = gspread.authorize(creds)
        
        # Your Google Sheets ID
        spreadsheet_id = "1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo"
        return client.open_by_key(spreadsheet_id)
    except Exception as e:
        print(f"Error connecting to Google Sheets: {e}")
        return None

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
        
        # Get all values from the sheet
        values = bot_control_sheet.get_all_records()
        if not values:
            return jsonify({"error": "No data found in Bot_Control sheet"}), 404
        
        # Get the latest status (last row)
        latest_status = values[-1]
        
        return jsonify({
            "status": latest_status.get("status", "unknown"),
            "last_started": latest_status.get("last_started", ""),
            "market_hours": latest_status.get("market_hours", False),
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
        })
    
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
        
        # Update the bot status
        bot_control_sheet.update('A2', 'running')  # Status column
        bot_control_sheet.update('B2', ist_time.strftime('%I:%M:%S %p'))  # Last started
        bot_control_sheet.update('C2', 'TRUE')  # Market hours
        
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
        
        # Update the bot status
        bot_control_sheet.update('A2', 'stopped')  # Status column
        bot_control_sheet.update('C2', 'FALSE')  # Market hours
        
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