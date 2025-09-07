import { NextResponse } from 'next/server';

// In a real implementation, this would check the actual bot status
// For now, we'll simulate the status
let botState = {
  status: 'stopped' as 'running' | 'stopped' | 'error' | 'loading',
  lastStarted: null as string | null,
  lastStopped: null as string | null,
  uptime: null as string | null,
  tradesExecuted: 0,
  marketHours: false
};

const isMarketHours = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  // Market hours: Monday-Friday, 9:15 AM - 3:30 PM IST
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose;
};

export async function GET() {
  try {
    // Update market hours status
    botState.marketHours = isMarketHours();
    
    // Auto-stop bot if outside market hours
    if (!botState.marketHours && botState.status === 'running') {
      botState.status = 'stopped';
      botState.lastStopped = new Date().toLocaleTimeString();
    }

    return NextResponse.json({
      success: true,
      status: botState
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get bot status',
      details: (error as Error).message
    }, { status: 500 });
  }
}