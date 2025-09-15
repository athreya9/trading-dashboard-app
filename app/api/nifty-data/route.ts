import { NextResponse } from 'next/server';
import { getGoogleSheet } from '@/lib/google-sheet';
import { getISTTimestamp } from '@/lib/ist-utils';

// This interface should match the columns in your "Price_Data" sheet
interface PriceData {
  timestamp: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export async function GET() {
  try {
    const sheet = await getGoogleSheet('Price_Data');

    // Fetch a reasonable number of recent rows to calculate today's data.
    // 375 candles in a day (9:15 to 15:30) + some buffer for previous day's close.
    const rowsToFetch = 500;
    const offset = Math.max(0, sheet.rowCount - 1 - rowsToFetch);
    const rows = await sheet.getRows<PriceData>({ limit: rowsToFetch, offset });

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No price data available in the sheet.',
        data: { currentPrice: 0, todaysHigh: 0, todaysLow: 0, openingPrice: 0, previousClose: 0, priceChange: 0, priceChangePercent: 0 }
      });
    }

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD format

    const allData = rows.map(row => {
      const rowData = row.toObject();
      return {
        timestamp: rowData.timestamp,
        open: parseFloat(rowData.open),
        high: parseFloat(rowData.high),
        low: parseFloat(rowData.low),
        close: parseFloat(rowData.close),
      };
    }).filter(d => !isNaN(d.close)); // Filter out any invalid rows

    const todaysData = allData.filter(d => d.timestamp.startsWith(today));
    const previousDaysData = allData.filter(d => !d.timestamp.startsWith(today));

    let data = {
      currentPrice: 0,
      todaysHigh: 0,
      todaysLow: 0,
      openingPrice: 0,
      previousClose: 0,
      priceChange: 0,
      priceChangePercent: 0,
    };

    if (todaysData.length > 0) {
      data.openingPrice = todaysData[0].open;
      data.todaysHigh = Math.max(...todaysData.map(d => d.high));
      data.todaysLow = Math.min(...todaysData.map(d => d.low));
      data.currentPrice = todaysData[todaysData.length - 1].close;
    } else if (allData.length > 0) {
      // If no data for today, use the last available data point as current price
      data.currentPrice = allData[allData.length - 1].close;
    }

    if (previousDaysData.length > 0) {
      data.previousClose = previousDaysData[previousDaysData.length - 1].close;
    } else if (todaysData.length > 0) {
      // Fallback: if no previous day data, use today's open as previous close
      data.previousClose = todaysData[0].open;
    }
    
    if (data.currentPrice && data.previousClose) {
        data.priceChange = data.currentPrice - data.previousClose;
        data.priceChangePercent = (data.priceChange / data.previousClose) * 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        currentPrice: parseFloat(data.currentPrice.toFixed(2)),
        todaysHigh: parseFloat(data.todaysHigh.toFixed(2)),
        todaysLow: parseFloat(data.todaysLow.toFixed(2)),
        openingPrice: parseFloat(data.openingPrice.toFixed(2)),
        previousClose: parseFloat(data.previousClose.toFixed(2)),
        priceChange: parseFloat(data.priceChange.toFixed(2)),
        priceChangePercent: parseFloat(data.priceChangePercent.toFixed(2)),
      },
      timestamp: getISTTimestamp(),
      source: 'Google Sheets (Price_Data)',
      timezone: 'Asia/Kolkata'
    });
  } catch (error) {
    console.error('❌ Error fetching NIFTY data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data from Google Sheets',
      details: (error as Error).message,
      data: {
        currentPrice: 0,
        todaysHigh: 0,
        todaysLow: 0,
        openingPrice: 0,
        previousClose: 0,
        priceChange: 0,
        priceChangePercent: 0,
      }
    }, { status: 500 });
  }
}