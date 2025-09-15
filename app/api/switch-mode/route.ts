import { NextResponse } from 'next/server';
import { getBotState, updateBotState } from '@/lib/bot-state';
import { getISTTimestamp } from '@/lib/ist-utils';

export async function POST(request: Request) {
  try {
    const { mode } = await request.json();

    if (!mode || !['emergency', 'full'].includes(mode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mode. Must be "emergency" or "full"'
      }, { status: 400 });
    }

    const currentState = await getBotState();

    if (currentState.mode === mode) {
      return NextResponse.json({
        success: false,
        error: `System is already in ${mode} mode`
      }, { status: 400 });
    }

    const previousMode = currentState.mode;
    const updatedState = await updateBotState({ mode, modeLastChanged: getISTTimestamp() });
    console.log(`🔄 System mode switched from ${previousMode} to ${mode} at ${updatedState.modeLastChanged}`);

    // In a real implementation, you would trigger other actions based on the mode switch, such as:
    // - Updating trading algorithm parameters
    // - Adjusting risk management settings

    // Simulate mode-specific configurations
    const modeConfig = {
      emergency: {
        maxPositionSize: 0.02, // 2% of portfolio
        stopLossPercentage: 0.05, // 5% stop loss
        enabledStrategies: ['basic_momentum', 'support_resistance'],
        riskLevel: 'conservative'
      },
      full: {
        maxPositionSize: 0.05, // 5% of portfolio
        stopLossPercentage: 0.08, // 8% stop loss
        enabledStrategies: ['momentum', 'mean_reversion', 'sentiment', 'breakout'],
        riskLevel: 'aggressive'
      }
    };

    return NextResponse.json({
      success: true,
      message: `System mode switched to ${mode.toUpperCase()} successfully`,
      mode: updatedState.mode,
      lastChanged: updatedState.modeLastChanged,
      previousMode,
      config: modeConfig[mode]
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to switch system mode',
      details: (error as Error).message
    }, { status: 500 });
  }
}