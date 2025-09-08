import { NextResponse } from 'next/server';
import { getBotState, updateBotState, isMarketHours } from '@/lib/bot-state';

export async function GET() {
  try {
    // Get current bot state
    const currentState = getBotState();
    
    // Update market hours status
    const marketHours = isMarketHours();
    
    // Auto-stop bot if outside market hours
    if (!marketHours && currentState.status === 'running') {
      updateBotState({
        status: 'stopped',
        lastStopped: new Date().toLocaleTimeString(),
        marketHours: false
      });
    } else {
      updateBotState({ marketHours });
    }

    const updatedState = getBotState();
    
    console.log('✅ Bot status checked:', updatedState);

    return NextResponse.json({
      success: true,
      status: updatedState
    });
  } catch (error) {
    console.error('❌ Error getting bot status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get bot status',
      details: (error as Error).message
    }, { status: 500 });
  }
}