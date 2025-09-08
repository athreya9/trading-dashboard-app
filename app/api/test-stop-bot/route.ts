import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔍 Testing stop-bot functionality...');
    
    // Test 1: Check if we can reach this endpoint
    console.log('✅ Stop-bot endpoint reached');
    
    // Test 2: Check environment variables
    const hasCredentials = !!process.env.GSHEET_CREDENTIALS;
    const hasSheetId = !!process.env.GOOGLE_SHEET_ID;
    
    console.log('Environment check:', {
      hasCredentials,
      hasSheetId,
      sheetId: process.env.GOOGLE_SHEET_ID || '1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo'
    });
    
    // Test 3: Try to import and call the actual stop-bot logic
    const { getBotState, updateBotState } = await import('@/lib/bot-state');
    const { formatISTTimeOnly } = await import('@/lib/ist-utils');
    
    console.log('✅ Imports successful');
    
    // Test 4: Get current state
    const currentState = await getBotState();
    console.log('Current bot state:', currentState);
    
    // Test 5: Try to update state
    const newState = await updateBotState({
      status: 'stopped',
      lastStopped: formatISTTimeOnly()
    });
    
    console.log('✅ State updated successfully:', newState);
    
    return NextResponse.json({
      success: true,
      message: 'Stop-bot test completed successfully',
      currentState,
      newState,
      environment: {
        hasCredentials,
        hasSheetId
      }
    });
    
  } catch (error) {
    console.error('❌ Stop-bot test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Stop-bot test failed',
      details: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}