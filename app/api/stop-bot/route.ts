import { NextResponse } from 'next/server';
import { getBotState, updateBotState } from '@/lib/bot-state';
import { formatISTTimeOnly } from '@/lib/ist-utils';

export const dynamic = 'force-dynamic'; // Force dynamic rendering, prevent build-time errors

export async function POST() {
  console.log('🛑 Stop-bot API called at:', new Date().toISOString());
  
  try {
    // Get current bot state from Google Sheets
    console.log('📊 Getting current bot state...');
    const currentState = await getBotState();
    console.log('Current state:', currentState);

    // Allow stopping even if already stopped (for UI consistency)
    if (currentState.status === 'stopped') {
      console.log('⚠️ Bot is already stopped, but returning success for UI');
      return NextResponse.json({
        success: true,
        message: 'Bot is already stopped',
        status: currentState
      });
    }

    // Stop the bot - update state in Google Sheets
    console.log('🔄 Updating bot state to stopped...');
    const stopTime = formatISTTimeOnly();
    console.log('Stop time (IST):', stopTime);
    
    const newState = await updateBotState({
      status: 'stopped',
      lastStopped: stopTime,
      marketHours: false
    });

    console.log('✅ Bot state updated:', newState);

    // In a real implementation, you would:
    // 1. Gracefully shut down your trading bot process
    // 2. Close connections to trading APIs
    // 3. Save current state and positions
    // 4. Send notifications about bot shutdown
    
    console.log('✅ Trading bot stopped successfully at:', newState.lastStopped);

    return NextResponse.json({
      success: true,
      message: 'Trading bot stopped successfully',
      status: newState
    });

  } catch (error) {
    console.error('❌ Error stopping bot:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    
    try {
      console.log('🔄 Attempting to set error state...');
      await updateBotState({ status: 'error' });
    } catch (updateError) {
      console.error('❌ Failed to update error state:', updateError);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to stop trading bot',
      details: (error as Error).message
    }, { status: 500 });
  }
}