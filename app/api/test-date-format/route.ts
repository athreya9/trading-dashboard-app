import { NextResponse } from 'next/server';
import { formatGoogleSheetsTimestamp, formatISTTime } from '@/lib/ist-utils';

export async function GET() {
  // Sample timestamp from your Google Sheets
  const sampleTimestamp = "2025-09-05 15:15:00";
  
  return NextResponse.json({
    originalTimestamp: sampleTimestamp,
    formattedWithGoogleSheetsFunction: formatGoogleSheetsTimestamp(sampleTimestamp),
    formattedWithOldFunction: formatISTTime(sampleTimestamp),
    explanation: "Google Sheets timestamps are already in IST, so we shouldn't add offset",
    correctFormat: "Should show September 5, 2025, 3:15 PM (not September 6)"
  });
}