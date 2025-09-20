"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"

// Define the structure of a single advisor data entry from Firestore
interface AdvisorEntry {
  recommendation: string; // e.g., "BUY NIFTY (CALL)"
  confidence: string;    // e.g., "85%"
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  reasons: string;
  timestamp: string;
}

interface TradingAdviceBannerProps {
  advisorOutput: AdvisorEntry[]; // Expecting advisorOutput data from dashboard API
}

export function TradingAdviceBanner({ advisorOutput }: TradingAdviceBannerProps) {
  // Add a check for advisorOutput being defined before accessing its length
  const latestSignal = advisorOutput && advisorOutput.length > 0 && advisorOutput[0].recommendation !== "No high-confidence signals found."
    ? advisorOutput[0]
    : null;

  const tradingAdvice = latestSignal
    ? latestSignal.reasons || 'No advice available' // Use 'reasons'
    : 'Market in consolidation. No clear signals.';

  const getActionIcon = (recommendation: string | undefined) => { // Pass recommendation string
    if (!recommendation) return <Minus className="h-5 w-5 text-yellow-500" />;
    if (recommendation.includes('BUY')) {
      return <TrendingUp className="h-5 w-5 text-green-500" />
    } else if (recommendation.includes('SELL')) {
      return <TrendingDown className="h-5 w-5 text-red-500" />
    } else {
      return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getActionColor = (recommendation: string | undefined) => { // Pass recommendation string
    if (!recommendation) return 'bg-yellow-500 text-white';
    if (recommendation.includes('BUY')) {
      return 'bg-green-500 text-white'
    } else if (recommendation.includes('SELL')) {
      return 'bg-red-500 text-white'
    } else {
      return 'bg-yellow-500 text-white'
    }
  }

  // Helper to extract action (BUY/SELL/HOLD) from recommendation string
  const getAction = (recommendation: string | undefined) => {
    if (!recommendation) return 'HOLD';
    if (recommendation.includes('BUY')) return 'BUY';
    if (recommendation.includes('SELL')) return 'SELL';
    return 'HOLD';
  };

  // Helper to extract symbol from recommendation string
  const getSymbol = (recommendation: string | undefined) => {
    if (!recommendation) return 'N/A';
    const match = recommendation.match(/BUY\s(.*?)\s/); // Assuming format "BUY SYMBOL (TYPE)"
    return match ? match[1] : 'N/A';
  };


  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getActionIcon(latestSignal?.recommendation)} {/* Use new property */}
              <h2 className="text-2xl font-bold text-white">Latest Trading Advice</h2>
            </div>
          </div>

          {latestSignal && (
            <Badge className={`${getActionColor(latestSignal.recommendation)} text-lg px-4 py-2 font-bold`}>
              {getAction(latestSignal.recommendation)} {/* Use new property */}
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xl text-white font-medium leading-relaxed">
            {tradingAdvice}
          </p>

          {latestSignal && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {latestSignal.recommendation && (
                <div className="text-center">
                  <div className="text-white/80">Symbol</div>
                  <div className="text-white font-bold">{getSymbol(latestSignal.recommendation)}</div>
                </div>
              )}
              {latestSignal.entry_price && (
                <div className="text-center">
                  <div className="text-white/80">Entry Price</div>
                  <div className="text-white font-bold">₹{latestSignal.entry_price.toFixed(2)}</div>
                </div>
              )}
              {latestSignal.take_profit && (
                <div className="text-center">
                  <div className="text-white/80">Take Profit</div>
                  <div className="text-green-300 font-bold">₹{latestSignal.take_profit.toFixed(2)}</div>
                </div>
              )}
              {latestSignal.confidence && (
                <div className="text-center">
                  <div className="text-white/80">Confidence</div>
                  <div className="text-white font-bold">{parseFloat(latestSignal.confidence).toFixed(0)}%</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-white/60">
          Last updated: {new Date().toLocaleTimeString()} • Auto-refreshes every 30 seconds
        </div>
      </CardContent>
    </Card>
  )
}