import { NextResponse } from 'next/server';
import { formatGoogleSheetsTimestamp, getISTTimestamp } from '@/lib/ist-utils';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface PriceData {
  timestamp: string;
  instrument: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  SMA_20: string;
  SMA_50: string;
  RSI_14: string;
  MACD_12_26_9: string;
  MACDh_12_26_9: string;
  MACDs_12_26_9: string;
  ATRr_14: string;
  bos: string;
  choch: string;
}

interface TradingSignal {
  Date: string;
  Stock: string;
  Action: 'BUY' | 'SELL' | 'HOLD';
  Price: number;
  Target?: number;
  StopLoss?: number;
  Confidence: number;
  Reason: string;
  RSI: number;
  MACD: number;
}

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
  const sheet = doc.sheetsByTitle['Price Data'];
  if (!sheet) {
    throw new Error("'Price Data' sheet not found in the document.");
  }
  return sheet;
}

export async function GET() {
  try {
    // Fetch real price data from Google Sheets using authenticated client
    const sheet = await getPriceDataSheet();
    const rows = await sheet.getRows();
    const priceData: PriceData[] = rows.map(row => row.toObject() as unknown as PriceData);
    
    if (!priceData || priceData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No price data available',
        signals: []
      });
    }
    
    // Get the latest 10 data points for analysis
    const recentData = priceData.slice(-10);
    const signals: TradingSignal[] = [];
    
    // Analyze each recent data point for trading signals
    recentData.forEach((data, index) => {
      const price = parseFloat(data.close);
      const rsi = parseFloat(data.RSI_14);
      const macd = parseFloat(data.MACD_12_26_9);
      const macdSignal = parseFloat(data.MACDs_12_26_9);
      const sma20 = parseFloat(data.SMA_20);
      const sma50 = parseFloat(data.SMA_50);
      const atr = parseFloat(data.ATRr_14);
      
      // Skip if essential data is missing
      if (isNaN(price) || isNaN(rsi) || isNaN(macd)) return;
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let confidence = 50;
      let reason = 'Market consolidation';
      
      // Generate signals based on technical indicators
      
      // RSI Oversold/Overbought signals
      if (rsi < 30) {
        action = 'BUY';
        confidence = 75;
        reason = 'RSI oversold condition, potential bounce expected';
      } else if (rsi > 70) {
        action = 'SELL';
        confidence = 75;
        reason = 'RSI overbought condition, potential correction expected';
      }
      
      // MACD crossover signals
      else if (macd > macdSignal && macd > 0) {
        action = 'BUY';
        confidence = 70;
        reason = 'MACD bullish crossover above zero line';
      } else if (macd < macdSignal && macd < 0) {
        action = 'SELL';
        confidence = 70;
        reason = 'MACD bearish crossover below zero line';
      }
      
      // SMA trend signals
      else if (sma20 > sma50 && price > sma20) {
        action = 'BUY';
        confidence = 65;
        reason = 'Price above SMA20, SMA20 above SMA50 - uptrend confirmed';
      } else if (sma20 < sma50 && price < sma20) {
        action = 'SELL';
        confidence = 65;
        reason = 'Price below SMA20, SMA20 below SMA50 - downtrend confirmed';
      }
      
      // Market structure signals (BOS/CHOCH)
      else if (data.bos === '1') {
        action = 'BUY';
        confidence = 80;
        reason = 'Break of Structure (BOS) - bullish momentum';
      } else if (data.bos === '-1') {
        action = 'SELL';
        confidence = 80;
        reason = 'Break of Structure (BOS) - bearish momentum';
      } else if (data.choch === '1') {
        action = 'BUY';
        confidence = 75;
        reason = 'Change of Character (CHOCH) - trend reversal to bullish';
      } else if (data.choch === '-1') {
        action = 'SELL';
        confidence = 75;
        reason = 'Change of Character (CHOCH) - trend reversal to bearish';
      }
      
      // Only include signals with confidence > 60
      if (confidence > 60) {
        const target = action === 'BUY' ? price + (atr * 2) : price - (atr * 2);
        const stopLoss = action === 'BUY' ? price - atr : price + atr;
        
        signals.push({
          Date: formatGoogleSheetsTimestamp(data.timestamp),
          Stock: 'NIFTY 50',
          Action: action,
          Price: Math.round(price * 100) / 100,
          Target: Math.round(target * 100) / 100,
          StopLoss: Math.round(stopLoss * 100) / 100,
          Confidence: confidence,
          Reason: reason,
          RSI: Math.round(rsi * 100) / 100,
          MACD: Math.round(macd * 100) / 100
        });
      }
    });
    
    // If no signals generated, create a consolidation message
    if (signals.length === 0) {
      signals.push({
        Date: formatGoogleSheetsTimestamp(recentData[recentData.length - 1]?.timestamp || new Date().toISOString()),
        Stock: '⚠️ MARKET STATUS',
        Action: 'HOLD',
        Price: parseFloat(recentData[recentData.length - 1]?.close || '0'),
        Confidence: 0,
        Reason: 'Market in consolidation - no clear signals. Wait for better setup.',
        RSI: parseFloat(recentData[recentData.length - 1]?.RSI_14 || '50'),
        MACD: parseFloat(recentData[recentData.length - 1]?.MACD_12_26_9 || '0')
      });
    }
    
    return NextResponse.json({
      success: true,
      signals: signals.slice(-5), // Return latest 5 signals
      dataPoints: recentData.length,
      lastUpdate: getISTTimestamp(),
      timezone: 'Asia/Kolkata (IST)'
    });
    
  } catch (error) {
    console.error('❌ Error generating signals:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate trading signals',
      signals: []
    }, { status: 500 });
  }
}