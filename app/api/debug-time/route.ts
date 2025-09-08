import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const utcTime = now.toUTCString();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toLocaleString();
  
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return NextResponse.json({
    serverTime: {
      utc: utcTime,
      ist: istTime,
      day: day,
      hours: hours,
      minutes: minutes,
      currentTimeMinutes: currentTime
    },
    marketHours: {
      open: marketOpen,
      close: marketClose,
      isWeekday: day >= 1 && day <= 5,
      isWithinHours: currentTime >= marketOpen && currentTime <= marketClose,
      isMarketOpen: day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose
    }
  });
}