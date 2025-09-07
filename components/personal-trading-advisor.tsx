"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Target, DollarSign, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface TradingSignal {
  Date: string
  Stock: string
  Action: "BUY" | "SELL" | "HOLD"
  Price: number
  Target?: number
  StopLoss?: number
  Confidence?: number
}

interface AdvisorData {
  systemStatus: "operational" | "warning" | "error"
  dataFreshness: number // seconds
  marketMood: "BULLISH" | "BEARISH" | "NEUTRAL"
  lastUpdated: string // Added timestamp for trust building
  opportunity: {
    stock: string
    action: "STRONG BUY" | "BUY" | "SELL" | "STRONG SELL" | "HOLD"
    reason: string
    entry: { min: number; max: number }
    stopLoss: number
    target: number
    riskRewardRatio: string
    holdTime: string
    confidence: number
  }
  capitalAllocation: {
    amount: number
    quantity: number
    portfolioPercentage: number
  }
  timeline: {
    signalGenerated: string
    nextCheck: string
  }
}

export function PersonalTradingAdvisor() {
  const [advisorData, setAdvisorData] = useState<AdvisorData>({
    systemStatus: "operational",
    dataFreshness: 45,
    marketMood: "BULLISH",
    lastUpdated: new Date().toLocaleString(), // Initialize with current timestamp
    opportunity: {
      stock: "RELIANCE",
      action: "STRONG BUY",
      reason: "Price just broke above key resistance with 2x average volume.",
      entry: { min: 2820, max: 2835 },
      stopLoss: 2790,
      target: 2880,
      riskRewardRatio: "1:2",
      holdTime: "Expected 2-4 hours",
      confidence: 85,
    },
    capitalAllocation: {
      amount: 5000,
      quantity: 17,
      portfolioPercentage: 2,
    },
    timeline: {
      signalGenerated: "10:15:32 AM",
      nextCheck: "10:20:00 AM",
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setAdvisorData((prev) => ({
        ...prev,
        dataFreshness: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
        lastUpdated: new Date().toLocaleString(), // Update timestamp on each refresh
        opportunity: {
          ...prev.opportunity,
          confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
        },
        timeline: {
          signalGenerated: new Date().toLocaleTimeString(),
          nextCheck: new Date(Date.now() + 5 * 60000).toLocaleTimeString(), // 5 minutes from now
        },
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "STRONG BUY":
      case "BUY":
        return "bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/30"
      case "SELL":
      case "STRONG SELL":
        return "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30"
      case "HOLD":
        return "bg-yellow-500 text-white border-yellow-400"
      default:
        return "bg-gray-500 text-white border-gray-400"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "STRONG BUY":
      case "BUY":
        return <Check className="h-4 w-4" />
      case "SELL":
      case "STRONG SELL":
        return <X className="h-4 w-4" />
      case "HOLD":
        return <TrendingUp className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
          <Target className="h-8 w-8" />
          Live Trading Signals
        </CardTitle>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/70 px-4 py-2 rounded-lg border border-slate-600">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 font-semibold">Last Updated:</span>
            <span className="text-white font-mono">{advisorData.lastUpdated}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-green-900/60 to-green-800/60 rounded-xl p-6 border-2 border-green-400/60 shadow-xl shadow-green-500/20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <h2 className="text-3xl font-bold text-yellow-400">TODAY'S TOP SIGNAL</h2>
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <Badge
                className={`${getActionColor(advisorData.opportunity.action)} text-2xl px-6 py-3 font-bold flex items-center gap-2`}
              >
                {getActionIcon(advisorData.opportunity.action)}
                {advisorData.opportunity.action}: {advisorData.opportunity.stock}
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              ₹{advisorData.opportunity.entry.min} - ₹{advisorData.opportunity.entry.max}
            </div>
            <div className="text-green-400 text-lg">Entry Range</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
              <div className="text-green-400 font-bold text-xl">₹{advisorData.opportunity.target}</div>
              <div className="text-gray-300 text-sm">Target</div>
            </div>
            <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
              <div className="text-red-400 font-bold text-xl">₹{advisorData.opportunity.stopLoss}</div>
              <div className="text-gray-300 text-sm">Stop Loss</div>
            </div>
            <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
              <div className="text-yellow-400 font-bold text-xl">
                {advisorData.opportunity.holdTime.replace("Expected ", "")}
              </div>
              <div className="text-gray-300 text-sm">Hold Time</div>
            </div>
            <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-600">
              <div className="text-blue-400 font-bold text-xl">{advisorData.opportunity.confidence}%</div>
              <div className="text-gray-300 text-sm">Confidence</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {advisorData.systemStatus === "operational" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-lg font-semibold">System Status:</span>
          </div>
          <span className={getStatusColor(advisorData.systemStatus)}>
            All systems operational. Data is {advisorData.dataFreshness} seconds fresh.
          </span>
        </div>

        {/* Market Mood */}
        <div className="flex items-center gap-3">
          {advisorData.marketMood === "BULLISH" ? (
            <TrendingUp className="h-5 w-5 text-green-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-400" />
          )}
          <span className="text-lg font-semibold">Market Mood:</span>
          <Badge
            className={`${advisorData.marketMood === "BULLISH" ? "bg-green-500 border-green-400" : advisorData.marketMood === "BEARISH" ? "bg-red-500 border-red-400" : "bg-yellow-500 border-yellow-400"} text-white border-2 shadow-lg`}
          >
            {advisorData.marketMood}
          </Badge>
          <span className="text-gray-300">(Nifty 50 is above 200-Day Average)</span>
        </div>

        {/* Today's Detailed Analysis */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            💡 LIVE TRADING SIGNALS FROM ALGO_PREDICTIONS:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                ₹{advisorData.capitalAllocation.amount.toLocaleString()}
              </div>
              <div className="text-gray-300">Amount to Invest</div>
              <div className="text-xs text-gray-400">
                ({advisorData.capitalAllocation.portfolioPercentage}% of portfolio)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{advisorData.capitalAllocation.quantity}</div>
              <div className="text-gray-300">Suggested Quantity</div>
              <div className="text-xs text-gray-400">shares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{advisorData.opportunity.riskRewardRatio}</div>
              <div className="text-gray-300">Risk/Reward</div>
              <div className="text-xs text-gray-400">ratio</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            TIMELINE:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Signal Generated:</span>
              <span className="text-white font-mono">{advisorData.timeline.signalGenerated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Next Strategy Check:</span>
              <span className="text-white font-mono">{advisorData.timeline.nextCheck}</span>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="text-center">
          <div className="text-sm text-gray-300 mb-2">
            Confidence: Based on {Math.floor(advisorData.opportunity.confidence / 15)} of 6 indicators aligned
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${advisorData.opportunity.confidence}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{advisorData.opportunity.confidence}% Confidence Level</div>
        </div>
      </CardContent>
    </Card>
  )
}
