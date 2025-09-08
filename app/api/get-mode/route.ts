import { NextResponse } from 'next/server';

// Shared system mode state (in production, this would be in a database)
let systemMode = {
  mode: 'emergency' as 'emergency' | 'full',
  lastChanged: new Date().toLocaleTimeString(),
  changedBy: 'system'
};

export async function GET() {
  try {
    // In a real implementation, you would fetch this from a database
    // and include additional information like:
    // - Mode change history
    // - Current active strategies
    // - Performance metrics per mode
    // - Risk parameters

    const modeDetails = {
      emergency: {
        description: 'Basic analysis only - capital preservation focus',
        riskLevel: 'Low',
        maxPositionSize: '2%',
        strategies: ['Basic Momentum', 'Support/Resistance'],
        features: [
          'Conservative risk management',
          'Basic technical indicators only',
          'Lower position sizes',
          'Strict stop-losses',
          'No high-risk trades'
        ]
      },
      full: {
        description: 'Full analysis with sentiment & advanced signals',
        riskLevel: 'Medium-High',
        maxPositionSize: '5%',
        strategies: ['Momentum', 'Mean Reversion', 'Sentiment', 'Breakout'],
        features: [
          'Advanced technical analysis',
          'Sentiment analysis integration',
          'Higher position sizes allowed',
          'Complex trading strategies',
          'All signal types enabled'
        ]
      }
    };

    return NextResponse.json({
      success: true,
      mode: systemMode.mode,
      lastChanged: systemMode.lastChanged,
      changedBy: systemMode.changedBy,
      details: modeDetails[systemMode.mode],
      availableModes: ['emergency', 'full']
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get system mode',
      details: (error as Error).message
    }, { status: 500 });
  }
}