import { NextResponse } from 'next/server';
import { doc } from '@/lib/google-sheets';

export async function GET() {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Price_Data'];
    if (!sheet) {
      throw new Error("'Price_Data' sheet not found in the document.");
    }
    // Fetch last 50 data rows for the chart
    const offset = Math.max(0, sheet.rowCount - 1 - 50);
    const rows = await sheet.getRows({ limit: 50, offset });
    const priceData = rows.map(row => row.toObject());

    return NextResponse.json({ success: true, data: priceData });
  } catch (error) {
    console.error('❌ Error fetching price data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch price data',
      details: (error as Error).message
    }, { status: 500 });
  }
}