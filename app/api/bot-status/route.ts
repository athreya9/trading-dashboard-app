import { NextResponse } from 'next/server';
import { getBotState, updateBotState } from '@/lib/bot-state';
import { formatISTTimeOnly, isMarketHours } from '@/lib/ist-utils';

export const dynamic = 'force-dynamic'; // Force dynamic rendering, prevent build-time errors

export async function GET() {
  try {
    // Get current bot state from Google Sheets
    const currentState = await getBotState();
    
    // Update market hours status
    const marketHours = isMarketHours();
    
    // Auto-stop bot if outside Indian market hours
    if (!marketHours && currentState.status === 'running') {
      await updateBotState({
        status: 'stopped',
        lastStopped: formatISTTimeOnly(),
        marketHours: false
      });
    } else {
      await updateBotState({ marketHours });
    }

    const updatedState = await getBotState();
    
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