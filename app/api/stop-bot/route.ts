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

export async function POST() {
  try {
    // Check if bot is already stopped
    if (botState.status === 'stopped') {
      return NextResponse.json({
        success: false,
        error: 'Bot is already stopped',
        status: botState
      }, { status: 400 });
    }

    // Stop the bot
    botState.status = 'stopped';
    botState.lastStopped = new Date().toLocaleTimeString();

    // In a real implementation, you would:
    // 1. Gracefully shut down your trading bot process
    // 2. Close connections to trading APIs
    // 3. Save current state and positions
    // 4. Send notifications about bot shutdown
    
    console.log('🛑 Trading bot stopped at:', botState.lastStopped);

    return NextResponse.json({
      success: true,
      message: 'Trading bot stopped successfully',
      status: botState
    });

  } catch (error) {
    botState.status = 'error';
    
    return NextResponse.json({
      success: false,
      error: 'Failed to stop trading bot',
      details: (error as Error).message
    }, { status: 500 });
  }
}