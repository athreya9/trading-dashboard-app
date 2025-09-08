import { NextResponse } from 'next/server';

// In a real implementation, this would be stored in a database
let systemMode = {
  mode: 'emergency' as 'emergency' | 'full',
  lastChanged: new Date().toLocaleTimeString(),
  changedBy: 'system'
};

export async function POST(request: Request) {
  try {
    const { mode } = await request.json();

    // Validate mode
    if (!mode || !['emergency', 'full'].includes(mode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid mode. Must be "emergency" or "full"'
      }, { status: 400 });
    }

    // Check if mode is already set
    if (systemMode.mode === mode) {
      return NextResponse.json({
        success: false,
        error: `System is already in ${mode} mode`
      }, { status: 400 });
    }

    // Switch mode
    const previousMode = systemMode.mode;
    systemMode.mode = mode;
    systemMode.lastChanged = new Date().toLocaleTimeString();
    systemMode.changedBy = 'user';

    // In a real implementation, you would:
    // 1. Update trading algorithm parameters
    // 2. Adjust risk management settings
    // 3. Enable/disable certain trading strategies
    // 4. Update position sizing rules
    // 5. Log the mode change for audit purposes

    console.log(`🔄 System mode switched from ${previousMode} to ${mode} at ${systemMode.lastChanged}`);

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
      mode: systemMode.mode,
      lastChanged: systemMode.lastChanged,
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