import { NextResponse } from 'next/server';
import { getISTTime, formatISTTime, isISTMarketHours } from '@/lib/ist-utils';

export async function GET() {
  const now = new Date();
  const utcTime = now.toUTCString();
  const istTime = getISTTime();
  const istTimeString = formatISTTime();
  
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
  
  const marketOpen = 9 * 60 + 15; // 9:15 AM IST
  const marketClose = 15 * 60 + 30; // 3:30 PM IST
  const isMarketOpen = isISTMarketHours();
  
  return NextResponse.json({
    serverTime: {
      utc: utcTime,
      ist: istTimeString,
      istFormatted: istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      utcDay: utcDay,
      utcHours: utcHours,
      utcMinutes: utcMinutes,
      utcCurrentTimeMinutes: utcCurrentTime,
      istDay: istDay,
      istHours: istHours,
      istMinutes: istMinutes,
      istCurrentTimeMinutes: istCurrentTime
    },
    indianMarketHours: {
      open: marketOpen,
      close: marketClose,
      openTime: '9:15 AM IST',
      closeTime: '3:30 PM IST',
      isWeekday: istDay >= 1 && istDay <= 5,
      isWithinHours: istCurrentTime >= marketOpen && istCurrentTime <= marketClose,
      isMarketOpen: isMarketOpen,
      timezone: 'Asia/Kolkata (IST)',
      currentStatus: isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'
    }
  });
}