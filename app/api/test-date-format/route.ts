import { NextResponse } from 'next/server';
import { formatGoogleSheetsTimestamp } from '@/lib/ist-utils';

export async function GET() {
  // Sample timestamp from your Google Sheets
  const sampleTimestamp = "2025-09-05 15:15:00";
  
  return NextResponse.json({
    originalTimestamp: sampleTimestamp,
    formattedWithGoogleSheetsFunction: formatGoogleSheetsTimestamp(sampleTimestamp),
    explanation: "The old 'formatISTTime' function was removed as it was causing incorrect date calculations. 'formatGoogleSheetsTimestamp' is the correct function to use for timestamps from the sheet.",
    correctFormat: "Should show September 5, 2025, 3:15 PM (not September 6)"
  });
}