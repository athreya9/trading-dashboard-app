import { NextResponse } from 'next/server';
import { getGoogleSheetDoc } from '@/lib/google-sheets';

// A simple in-memory cache to avoid hitting the API too often.
const cache = {
  data: null as any[] | null,
  lastFetch: 0,
  ttl: 30000, // 30 seconds
};

export async function GET() {
  const now = Date.now();
  if (cache.data && (now - cache.lastFetch < cache.ttl)) {
    console.log('✅ Returning cached signals');
    return NextResponse.json({ success: true, signals: cache.data, lastUpdate: new Date(cache.lastFetch).toISOString() });
  }

  try {
    const doc = getGoogleSheetDoc();
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Price_Data'];
    if (!sheet) {
      throw new Error("'Price_Data' sheet not found.");
    }

    const rows = await sheet.getRows({ limit: 50 }); // Get recent rows
    const priceData = rows.map(row => row.toObject());

    // Simple signal generation logic (example)
    const signals = priceData.slice(-10).map((row: any, index: number, arr: any[]) => {
      if (index === 0) return null;
      const prev = arr[index - 1];
      const currentPrice = parseFloat(row.close);
      const prevPrice = parseFloat(prev.close);
      const action = currentPrice > prevPrice ? 'BUY' : 'SELL';
      
      return {
        Date: row.timestamp || new Date().toISOString(),
        Stock: 'NIFTY 50',
        Action: action,
        Price: currentPrice,
        Target: action === 'BUY' ? currentPrice * 1.01 : currentPrice * 0.99,
        StopLoss: action === 'BUY' ? currentPrice * 0.995 : currentPrice * 1.005,
        Confidence: 60 + Math.random() * 15,
        Reason: `Price moved from ${prevPrice.toFixed(2)} to ${currentPrice.toFixed(2)}.`,
        RSI: 50 + (Math.random() - 0.5) * 10,
        MACD: (Math.random() - 0.5) * 0.1,
      };
    }).filter(Boolean);

    cache.data = signals;
    cache.lastFetch = now;

    return NextResponse.json({ success: true, signals: signals, lastUpdate: new Date(now).toISOString() });

  } catch (error) {
    console.error('❌ Error in /api/generate-signals:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate trading signals',
      details: (error as Error).message
    }, { status: 500 });
  }
}