import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

interface AdviceData {
  recommendation: string;
  stock: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timestamp: string;
  reason?: string;
}

export async function GET() {
  try {
    // Authenticate using your secure environment variable
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet('1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo', serviceAccountAuth);
    
    await doc.loadInfo();
    
    // Read from Advisor_Output tab
    const sheet = doc.sheetsByTitle['Advisor_Output'];
    
    if (!sheet) {
      return NextResponse.json({ 
        error: 'Advisor_Output sheet not found',
        advice: 'No advice available - sheet not found'
      }, { status: 404 });
    }
    
    // Get the latest rows
    const rows = await sheet.getRows({ limit: 5, offset: 0 });
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        advice: 'No trading advice available at this time',
        recommendations: [],
        success: true 
      });
    }

    // Process multiple recommendations using proper column access
    const recommendations: AdviceData[] = rows.map(row => {
      // Use toObject() to get all row data or access by column headers
      const rowData = row.toObject();
      
      return {
        recommendation: rowData['Recommendation'] || rowData['recommendation'] || 'Hold current positions',
        stock: rowData['Stock'] || rowData['stock'] || '',
        action: (rowData['Action'] || rowData['action'] || 'HOLD') as 'BUY' | 'SELL' | 'HOLD',
        price: parseFloat(rowData['Price'] || rowData['price'] || '0') || 0,
        target: parseFloat(rowData['Target'] || rowData['target'] || '0') || 0,
        stopLoss: parseFloat(rowData['StopLoss'] || rowData['stopLoss'] || '0') || 0,
        confidence: parseFloat(rowData['Confidence'] || rowData['confidence'] || '0') || 0,
        timestamp: rowData['Date'] || rowData['date'] || new Date().toISOString(),
        reason: rowData['Reason'] || rowData['reason'] || 'Technical analysis'
      };
    }).filter(rec => rec.stock && rec.price > 0);

    // Get the primary advice (highest confidence or most recent)
    const primaryAdvice = recommendations.length > 0 
      ? recommendations.reduce((prev, current) => 
          (prev.confidence > current.confidence) ? prev : current
        )
      : null;

    const adviceText = primaryAdvice 
      ? `${primaryAdvice.action} ${primaryAdvice.stock} at ₹${primaryAdvice.price.toFixed(2)} (Confidence: ${primaryAdvice.confidence}%)`
      : 'No high-confidence trading opportunities available. Consider holding current positions.';

    return NextResponse.json({ 
      advice: adviceText,
      primaryRecommendation: primaryAdvice,
      allRecommendations: recommendations,
      totalSignals: recommendations.length,
      lastUpdated: new Date().toISOString(),
      success: true 
    });
    
  } catch (error) {
    console.error('Error fetching trading advice:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch trading advice',
      advice: 'Service temporarily unavailable. Please try again later.',
      details: (error as Error).message,
      success: false
    }, { status: 500 });
  }
}