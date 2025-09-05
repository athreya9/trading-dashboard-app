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
  signals: TradingSignal[]
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
    signals: [],
    timeline: {
      signalGenerated: "10:15:32 AM",
      nextCheck: "10:20:00 AM",
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchTradingData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      
      if (result.data && result.data.length > 0) {
        // Convert the raw data to TradingSignal format
        const signals: TradingSignal[] = result.data.slice(1).map((row: any[]) => ({
          Date: row[0] || '',
          Stock: row[1] || '',
          Action: row[2] as "BUY" | "SELL" | "HOLD" || 'HOLD',
          Price: parseFloat(row[3]) || 0,
          Target: row[4] ? parseFloat(row[4]) : undefined,
          StopLoss: row[5] ? parseFloat(row[5]) : undefined,
          Confidence: row[6] ? parseFloat(row[6]) : undefined,
        }))

        setAdvisorData(prev => ({
          ...prev,
          signals: signals.slice(0, 10), // Show latest 10 signals
          dataFreshness: 0,
          timeline: {
            signalGenerated: new Date().toLocaleTimeString(),
            nextCheck: new Date(Date.now() + 5 * 60000).toLocaleTimeString(),
          },
        }))
      }
    } catch (error) {
      console.error('Error fetching trading data:', error)
      setAdvisorData(prev => ({
        ...prev,
        systemStatus: "error",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTradingData()
    const interval = setInterval(fetchTradingData, 30000) // Update every 30 seconds
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
      case "BUY":
        return "bg-green-500 text-white"
      case "SELL":
        return "bg-red-500 text-white"
      case "HOLD":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getRowColor = (action: string) => {
    switch (action) {
      case "BUY":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      case "SELL":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      case "HOLD":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
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
        <div className="flex items-center justify-between">
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
          <button
            onClick={fetchTradingData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md text-sm transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Trading Signals Table */}
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            💡 LIVE TRADING SIGNALS FROM ALGO_PREDICTIONS:
          </h3>

          {advisorData.signals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {isLoading ? "Loading trading signals..." : "No trading signals available. Click refresh to load data."}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-700 sticky top-0">
                  <tr>
                    <th className="p-3 text-left text-yellow-400">Date</th>
                    <th className="p-3 text-left text-yellow-400">Stock</th>
                    <th className="p-3 text-center text-yellow-400">Action</th>
                    <th className="p-3 text-right text-yellow-400">Price</th>
                    <th className="p-3 text-right text-yellow-400">Target</th>
                    <th className="p-3 text-right text-yellow-400">Stop Loss</th>
                    <th className="p-3 text-right text-yellow-400">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {advisorData.signals.map((signal, index) => (
                    <tr
                      key={index}
                      className={`border-b border-slate-600 hover:bg-slate-700/50 transition-colors ${getRowColor(signal.Action)}`}
                    >
                      <td className="p-3 text-white font-mono text-xs">{signal.Date}</td>
                      <td className="p-3 font-bold text-white">{signal.Stock}</td>
                      <td className="p-3 text-center">
                        <Badge className={getActionColor(signal.Action)}>
                          {signal.Action}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-white">₹{signal.Price.toFixed(2)}</td>
                      <td className="p-3 text-right text-green-400">
                        {signal.Target ? `₹${signal.Target.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-3 text-right text-red-400">
                        {signal.StopLoss ? `₹${signal.StopLoss.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-3 text-right text-white">
                        {signal.Confidence ? `${signal.Confidence.toFixed(0)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />⏰ TIMELINE:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Last Updated:</span>
              <span className="text-white font-mono">{advisorData.timeline.signalGenerated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Next Update:</span>
              <span className="text-white font-mono">{advisorData.timeline.nextCheck}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}