import { NextResponse } from 'next/server';
import { getBotState, updateBotState } from '@/lib/bot-state';

export async function POST() {
  try {
    // Get current bot state
    const currentState = getBotState();

    // Check if bot is already stopped
    if (currentState.status === 'stopped') {
      console.log('❌ Bot is already stopped');
      return NextResponse.json({
        success: false,
        error: 'Bot is already stopped',
        status: currentState
      }, { status: 400 });
    }

    // Stop the bot
    const newState = updateBotState({
      status: 'stopped',
      lastStopped: new Date().toLocaleTimeString()
    });

    // In a real implementation, you would:
    // 1. Gracefully shut down your trading bot process
    // 2. Close connections to trading APIs
    // 3. Save current state and positions
    // 4. Send notifications about bot shutdown
    
    console.log('✅ Trading bot stopped at:', newState.lastStopped);

    return NextResponse.json({
      success: true,
      message: 'Trading bot stopped successfully',
      status: newState
    });

  } catch (error) {
    console.error('❌ Error stopping bot:', error);
    updateBotState({ status: 'error' });
    
    return NextResponse.json({
      success: false,
      error: 'Failed to stop trading bot',
      details: (error as Error).message
    }, { status: 500 });
  }
}