import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const utcTime = now.toUTCString();
  
  // IST calculation
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const istTimeString = istTime.toLocaleString();
  
  // UTC values
  const utcDay = now.getDay();
  const utcHours = now.getHours();
  const utcMinutes = now.getMinutes();
  const utcCurrentTime = utcHours * 60 + utcMinutes;
  
  // IST values
  const istDay = istTime.getDay();
  const istHours = istTime.getHours();
  const istMinutes = istTime.getMinutes();
  const istCurrentTime = istHours * 60 + istMinutes;
  
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return NextResponse.json({
    serverTime: {
      utc: utcTime,
      ist: istTimeString,
      utcDay: utcDay,
      utcHours: utcHours,
      utcMinutes: utcMinutes,
      utcCurrentTimeMinutes: utcCurrentTime,
      istDay: istDay,
      istHours: istHours,
      istMinutes: istMinutes,
      istCurrentTimeMinutes: istCurrentTime
    },
    marketHours: {
      open: marketOpen,
      close: marketClose,
      isWeekday: istDay >= 1 && istDay <= 5,
      isWithinHours: istCurrentTime >= marketOpen && istCurrentTime <= marketClose,
      isMarketOpen: istDay >= 1 && istDay <= 5 && istCurrentTime >= marketOpen && istCurrentTime <= marketClose
    }
  });
}