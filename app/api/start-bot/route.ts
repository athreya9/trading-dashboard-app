import { NextResponse } from 'next/server';
import { getBotState, updateBotState, isMarketHours } from '@/lib/bot-state';

export async function POST() {
  try {
    // Check if market is open
    if (!isMarketHours()) {
      console.log('❌ Cannot start bot outside market hours');
      return NextResponse.json({
        success: false,
        error: 'Cannot start bot outside market hours',
        message: 'Trading bot can only run Monday-Friday, 9:15 AM - 3:30 PM IST'
      }, { status: 400 });
    }

    // Get current bot state from Google Sheets
    const currentState = await getBotState();

    // Check if bot is already running
    if (currentState.status === 'running') {
      console.log('❌ Bot is already running');
      return NextResponse.json({
        success: false,
        error: 'Bot is already running',
        status: currentState
      }, { status: 400 });
    }

    // Start the bot - update state in Google Sheets
    const newState = await updateBotState({
      status: 'running',
      lastStarted: new Date().toLocaleTimeString(),
      marketHours: true
    });

    // In a real implementation, you would:
    // 1. Start your actual trading bot process
    // 2. Initialize connections to trading APIs
    // 3. Begin monitoring and executing trades
    
    console.log('✅ Trading bot started at:', newState.lastStarted);

    return NextResponse.json({
      success: true,
      message: 'Trading bot started successfully',
      status: newState
    });

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    try {
      await updateBotState({ status: 'error' });
    } catch (updateError) {
      console.error('❌ Failed to update error state:', updateError);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to start trading bot',
      details: (error as Error).message
    }, { status: 500 });
  }
}