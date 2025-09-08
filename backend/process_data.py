import gspread
from google.oauth2.service_account import Credentials
import os
import json
import requests
from datetime import datetime
import pytz
import time

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

def check_bot_status(spreadsheet):
    """Check if bot is running from Bot_Control sheet"""
    try:
        bot_control_sheet = spreadsheet.worksheet('Bot_Control')
        values = bot_control_sheet.get_all_records()
        
        if not values:
            print("No data found in Bot_Control sheet")
            return False
        
        # Get the latest status (last row)
        latest_status = values[-1]
        status = latest_status.get("status", "").lower()
        
        print(f"Bot status: {status}")
        return status == "running"
    
    except Exception as e:
        print(f"Error checking bot status: {e}")
        return False

def fetch_market_data():
    """Fetch real market data (placeholder - replace with actual API)"""
    try:
        # This is a placeholder - replace with actual market data API
        # For now, we'll simulate some data
        ist_time = datetime.now(pytz.timezone('Asia/Kolkata'))
        
        # Simulate market data
        market_data = {
            "NIFTY": {
                "price": 24856.5,
                "change": 125.3,
                "change_percent": 0.51
            },
            "HDFCBANK": {
                "price": 970.45,
                "change": -5.25,
                "change_percent": -0.54
            },
            "RELIANCE": {
                "price": 1382.7,
                "change": 12.8,
                "change_percent": 0.93
            }
        }
        
        return market_data, ist_time
    
    except Exception as e:
        print(f"Error fetching market data: {e}")
        return None, None

def update_price_data(spreadsheet, market_data, timestamp):
    """Update Price_Data sheet with latest market data"""
    try:
        price_sheet = spreadsheet.worksheet('Price_Data')
        
        # Format timestamp for IST
        ist_timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')
        
        # Prepare data rows
        for symbol, data in market_data.items():
            row_data = [
                ist_timestamp,
                symbol,
                data['price'],
                data['change'],
                data['change_percent']
            ]
            
            # Append new row
            price_sheet.append_row(row_data)
            print(f"Updated {symbol}: ₹{data['price']}")
        
        return True
    
    except Exception as e:
        print(f"Error updating price data: {e}")
        return False

def generate_trading_signals(market_data):
    """Generate trading signals based on market data"""
    try:
        # Simple signal generation logic (replace with your strategy)
        signals = []
        
        for symbol, data in market_data.items():
            if data['change_percent'] > 1.0:
                signals.append({
                    "symbol": symbol,
                    "signal": "BUY",
                    "reason": f"Strong upward momentum (+{data['change_percent']:.2f}%)",
                    "confidence": "HIGH"
                })
            elif data['change_percent'] < -1.0:
                signals.append({
                    "symbol": symbol,
                    "signal": "SELL",
                    "reason": f"Strong downward momentum ({data['change_percent']:.2f}%)",
                    "confidence": "HIGH"
                })
        
        return signals
    
    except Exception as e:
        print(f"Error generating signals: {e}")
        return []

def update_advisor_output(spreadsheet, signals, timestamp):
    """Update Advisor_Output sheet with trading signals"""
    try:
        advisor_sheet = spreadsheet.worksheet('Advisor_Output')
        
        # Format timestamp for IST
        ist_timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')
        
        if signals:
            # If we have signals, add them
            for signal in signals:
                row_data = [
                    ist_timestamp,
                    signal['signal'],
                    signal['symbol'],
                    signal['reason'],
                    signal['confidence']
                ]
                advisor_sheet.append_row(row_data)
                print(f"Added signal: {signal['signal']} {signal['symbol']}")
        else:
            # No signals - market consolidation
            row_data = [
                ist_timestamp,
                "HOLD",
                "MARKET",
                "Market may be in consolidation - Wait for a clearer setup",
                "MEDIUM"
            ]
            advisor_sheet.append_row(row_data)
            print("No clear signals - Added HOLD recommendation")
        
        return True
    
    except Exception as e:
        print(f"Error updating advisor output: {e}")
        return False

def main():
    """Main function to process market data and update sheets"""
    print(f"Starting data processing at {datetime.now(pytz.timezone('Asia/Kolkata'))}")
    
    # Initialize Google Sheets connection
    spreadsheet = get_spreadsheet()
    if not spreadsheet:
        print("Failed to connect to Google Sheets")
        return
    
    # Check if bot is running
    if not check_bot_status(spreadsheet):
        print("Bot is not running. Exiting...")
        return
    
    print("Bot is running. Processing market data...")
    
    # Fetch market data
    market_data, timestamp = fetch_market_data()
    if not market_data:
        print("Failed to fetch market data")
        return
    
    # Update Price_Data sheet
    if update_price_data(spreadsheet, market_data, timestamp):
        print("Successfully updated price data")
    else:
        print("Failed to update price data")
        return
    
    # Generate trading signals
    signals = generate_trading_signals(market_data)
    
    # Update Advisor_Output sheet
    if update_advisor_output(spreadsheet, signals, timestamp):
        print("Successfully updated advisor output")
    else:
        print("Failed to update advisor output")
    
    print("Data processing completed successfully!")

if __name__ == "__main__":
    main()