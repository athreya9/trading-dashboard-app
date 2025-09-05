"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Target, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface AdvisorData {
  systemStatus: "operational" | "warning" | "error"
  dataFreshness: number // seconds
  marketMood: "BULLISH" | "BEARISH" | "NEUTRAL"
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
        return "bg-green-600 text-white"
      case "BUY":
        return "bg-green-500 text-white"
      case "SELL":
        return "bg-red-500 text-white"
      case "STRONG SELL":
        return "bg-red-600 text-white"
      case "HOLD":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
          <Target className="h-6 w-6" />
          YOUR TRADING ADVISOR - LIVE STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {advisorData.systemStatus === "operational" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-lg font-semibold">🟢 System Status:</span>
          </div>
          <span className={getStatusColor(advisorData.systemStatus)}>
            All systems operational. Data is {advisorData.dataFreshness} seconds fresh.
          </span>
        </div>

        {/* Market Mood */}
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <span className="text-lg font-semibold">📈 Market Mood:</span>
          <Badge
            className={`${advisorData.marketMood === "BULLISH" ? "bg-green-600" : advisorData.marketMood === "BEARISH" ? "bg-red-600" : "bg-yellow-600"} text-white`}
          >
            {advisorData.marketMood}
          </Badge>
          <span className="text-gray-300">(Nifty 50 is above 200-Day Average)</span>
        </div>

        {/* Today's Top Opportunity */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">💡 TODAY'S TOP OPPORTUNITY:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Stock:</span>
                <span className="font-bold text-white">{advisorData.opportunity.stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Action:</span>
                <Badge className={getActionColor(advisorData.opportunity.action)}>
                  {advisorData.opportunity.action}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Entry:</span>
                <span className="text-white">
                  ₹{advisorData.opportunity.entry.min} - ₹{advisorData.opportunity.entry.max}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Stop Loss:</span>
                <span className="text-red-400">₹{advisorData.opportunity.stopLoss}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Target:</span>
                <span className="text-green-400">₹{advisorData.opportunity.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Risk/Reward:</span>
                <span className="text-white">{advisorData.opportunity.riskRewardRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hold Time:</span>
                <span className="text-white">{advisorData.opportunity.holdTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Confidence:</span>
                <span className="text-green-400 font-bold">{advisorData.opportunity.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-700/50 rounded border-l-4 border-blue-400">
            <p className="text-gray-200 italic">
              <strong>Reason:</strong> {advisorData.opportunity.reason}
            </p>
          </div>
        </div>

        {/* Capital Allocation */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />💼 CAPITAL ALLOCATION:
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
            <Clock className="h-5 w-5" />⏰ TIMELINE:
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
            ✅ Confidence: Based on {Math.floor(advisorData.opportunity.confidence / 15)} of 6 indicators aligned
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
