"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"

interface TradingAdviceBannerProps {
  advisorOutput: any[]; // Expecting advisorOutput data from dashboard API
}

export function TradingAdviceBanner({ advisorOutput }: TradingAdviceBannerProps) {
  const latestSignal = advisorOutput.length > 0 && advisorOutput[0].Recommendation !== "No high-confidence signals found."
    ? advisorOutput[0]
    : null;

  const tradingAdvice = latestSignal
    ? latestSignal.Reasons || 'No advice available'
    : 'Market in consolidation. No clear signals.';

  const getActionIcon = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'SELL':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'BUY':
        return 'bg-green-500 text-white'
      case 'SELL':
        return 'bg-red-500 text-white'
      default:
        return 'bg-yellow-500 text-white'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* No loading state here, as data comes from parent */}
              {getActionIcon(latestSignal?.Action)}
              <h2 className="text-2xl font-bold text-white">Latest Trading Advice</h2>
            </div>
          </div>

          {latestSignal && (
            <Badge className={`${getActionColor(latestSignal.Action)} text-lg px-4 py-2 font-bold`}>
              {latestSignal.Action?.toUpperCase() || 'HOLD'}
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xl text-white font-medium leading-relaxed">
            {tradingAdvice}
          </p>

          {latestSignal && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {latestSignal.Symbol && ( // Changed from Stock to Symbol
                <div className="text-center">
                  <div className="text-white/80">Symbol</div>
                  <div className="text-white font-bold">{latestSignal.Symbol}</div>
                </div>
              )}
              {latestSignal["Entry Price"] && ( // Changed from Price to Entry Price
                <div className="text-center">
                  <div className="text-white/80">Entry Price</div>
                  <div className="text-white font-bold">₹{parseFloat(latestSignal["Entry Price"]).toFixed(2)}</div>
                </div>
              )}
              {latestSignal["Take Profit"] && ( // Changed from Target to Take Profit
                <div className="text-center">
                  <div className="text-white/80">Take Profit</div>
                  <div className="text-green-300 font-bold">₹{parseFloat(latestSignal["Take Profit"]).toFixed(2)}</div>
                </div>
              )}
              {latestSignal.Confidence && (
                <div className="text-center">
                  <div className="text-white/80">Confidence</div>
                  <div className="text-white font-bold">{parseFloat(latestSignal.Confidence).toFixed(0)}%</div>
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