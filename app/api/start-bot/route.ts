import { NextResponse } from 'next/server';

// Shared bot state (in production, this would be in a database or external service)
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
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose;
};

export async function POST() {
  try {
    // Check if market is open
    if (!isMarketHours()) {
      return NextResponse.json({
        success: false,
        error: 'Cannot start bot outside market hours',
        message: 'Trading bot can only run Monday-Friday, 9:15 AM - 3:30 PM IST'
      }, { status: 400 });
    }

    // Check if bot is already running
    if (botState.status === 'running') {
      return NextResponse.json({
        success: false,
        error: 'Bot is already running',
        status: botState
      }, { status: 400 });
    }

    // Start the bot
    botState.status = 'running';
    botState.lastStarted = new Date().toLocaleTimeString();
    botState.marketHours = true;

    // In a real implementation, you would:
    // 1. Start your actual trading bot process
    // 2. Initialize connections to trading APIs
    // 3. Begin monitoring and executing trades
    
    console.log('🤖 Trading bot started at:', botState.lastStarted);

    return NextResponse.json({
      success: true,
      message: 'Trading bot started successfully',
      status: botState
    });

  } catch (error) {
    botState.status = 'error';
    
    return NextResponse.json({
      success: false,
      error: 'Failed to start trading bot',
      details: (error as Error).message
    }, { status: 500 });
  }
}