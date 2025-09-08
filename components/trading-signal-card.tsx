"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target, AlertCircle, Newspaper } from "lucide-react"

interface TradingSignalProps {
  signal: {
    instrument: string
    signal: "BUY" | "SELL" | "HOLD"
    confidence: number
    price: number
    target?: number
    stopLoss?: number
    reasons: string[]
    news_insights?: string
    timestamp?: string
  }
}

export function TradingSignalCard({ signal }: TradingSignalProps) {
  const getSignalIcon = () => {
    switch (signal.signal) {
      case "BUY":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "SELL":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getSignalColor = () => {
    switch (signal.signal) {
      case "BUY":
        return "border-l-green-500 bg-green-50/5"
      case "SELL":
        return "border-l-red-500 bg-red-50/5"
      default:
        return "border-l-yellow-500 bg-yellow-50/5"
    }
  }

  const getConfidenceColor = () => {
    if (signal.confidence > 70) return "text-green-500"
    if (signal.confidence > 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getConfidenceEmoji = () => {
    if (signal.confidence > 70) return "🟢"
    if (signal.confidence > 50) return "🟡"
    return "🔴"
  }

  const getActionBadgeColor = () => {
    switch (signal.signal) {
      case "BUY":
        return "bg-green-500 text-white hover:bg-green-600"
      case "SELL":
        return "bg-red-500 text-white hover:bg-red-600"
      default:
        return "bg-yellow-500 text-white hover:bg-yellow-600"
    }
  }

  return (
    <Card className={`signal-card border-l-4 ${getSignalColor()} hover:shadow-lg transition-all duration-200`}>
      <CardContent className="p-6">
        {/* Header with Signal and Confidence */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getSignalIcon()}
            <h3 className="text-xl font-bold text-foreground">
              🎯 {signal.instrument}
            </h3>
            <Badge className={`${getActionBadgeColor()} font-bold px-3 py-1`}>
              {signal.signal}
            </Badge>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${getConfidenceColor()}`}>
              {signal.confidence}% {getConfidenceEmoji()}
            </div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* Price Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Entry Price</div>
            <div className="text-lg font-bold text-foreground">₹{signal.price.toFixed(2)}</div>
          </div>
          
          {signal.target && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Target</div>
              <div className="text-lg font-bold text-green-600">₹{signal.target.toFixed(2)}</div>
            </div>
          )}
          
          {signal.stopLoss && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Stop Loss</div>
              <div className="text-lg font-bold text-red-600">₹{signal.stopLoss.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Reasons Section */}
        <div className="mb-4">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
            <Target className="h-4 w-4 text-blue-500" />
            Reasons:
          </h4>
          <ul className="space-y-2">
            {signal.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* News Insights Section */}
        {signal.news_insights && (
          <div className="border-t pt-4">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
              <Newspaper className="h-4 w-4 text-orange-500" />
              📰 Market Context:
            </h4>
            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-l-blue-500">
              <p className="text-sm text-foreground leading-relaxed">
                {signal.news_insights}
              </p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {signal.timestamp && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Signal generated: {signal.timestamp}
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk Level:</span>
            <span className={`font-medium ${
              signal.confidence > 70 ? 'text-green-600' : 
              signal.confidence > 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {signal.confidence > 70 ? 'Low Risk' : 
               signal.confidence > 50 ? 'Medium Risk' : 'High Risk'}
            </span>
          </div>
          
          {signal.target && signal.stopLoss && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Risk/Reward:</span>
              <span className="font-medium text-foreground">
                1:{((signal.target - signal.price) / (signal.price - signal.stopLoss)).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}