"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

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
    dataFreshness: 0,
    marketMood: "NEUTRAL",
    signals: [],
    timeline: {
      signalGenerated: "Loading...",
      nextCheck: "Loading...",
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchTradingData = async () => {
    setIsLoading(true)
    try {
      // Use OpenSheet API to directly access Google Sheets data
      const response = await fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output')
      const data = await response.json()

      if (data && data.length > 0) {
        console.log('✅ Raw data from Google Sheets:', data)
        
        // Handle the actual data structure - currently shows "NO SIGNALS"
        const signals: TradingSignal[] = []
        
        // Check if we have actual trading signals or just "NO SIGNALS" messages
        data.forEach((row: any, index: number) => {
          if (row['⚠️ NO SIGNALS']) {
            // Create a display signal for "NO SIGNALS" status
            signals.push({
              Date: new Date().toLocaleDateString(),
              Stock: 'MARKET STATUS',
              Action: 'HOLD' as "BUY" | "SELL" | "HOLD",
              Price: 0,
              Target: undefined,
              StopLoss: undefined,
              Confidence: 0,
            })
          } else if (row.Stock || row.Symbol) {
            // Parse actual trading signals if they exist
            signals.push({
              Date: row.Date || new Date().toLocaleDateString(),
              Stock: row.Stock || row.Symbol || `Signal ${index + 1}`,
              Action: (row.Action || 'HOLD') as "BUY" | "SELL" | "HOLD",
              Price: parseFloat(row.Price || row.EntryPrice || '0') || 0,
              Target: row.Target ? parseFloat(row.Target) : undefined,
              StopLoss: row.StopLoss ? parseFloat(row.StopLoss) : undefined,
              Confidence: row.Confidence ? parseFloat(row.Confidence) : undefined,
            })
          }
        })

        // Determine market mood based on signals
        const buySignals = signals.filter(s => s.Action === 'BUY').length
        const sellSignals = signals.filter(s => s.Action === 'SELL').length
        const marketMood = buySignals > sellSignals ? 'BULLISH' : sellSignals > buySignals ? 'BEARISH' : 'NEUTRAL'

        setAdvisorData(prev => ({
          ...prev,
          signals: signals.slice(0, 10), // Show latest 10 signals
          dataFreshness: 0,
          marketMood: marketMood as "BULLISH" | "BEARISH" | "NEUTRAL",
          systemStatus: "operational",
          timeline: {
            signalGenerated: new Date().toLocaleTimeString(),
            nextCheck: new Date(Date.now() + 30 * 60000).toLocaleTimeString(), // 30 minutes from now
          },
        }))
      } else {
        setAdvisorData(prev => ({
          ...prev,
          systemStatus: "operational",
          signals: [],
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
        return "bg-green-100/10 dark:bg-green-900/30 border-l-4 border-l-green-500"
      case "SELL":
        return "bg-red-100/10 dark:bg-red-900/30 border-l-4 border-l-red-500"
      case "HOLD":
        return "bg-yellow-100/10 dark:bg-yellow-900/30 border-l-4 border-l-yellow-500"
      default:
        return "bg-gray-100/10 dark:bg-gray-900/30 border-l-4 border-l-gray-500"
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
            💡 LIVE TRADING SIGNALS FROM ADVISOR_OUTPUT:
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
                        <Badge className={`${getActionColor(signal.Action)} font-bold px-3 py-1 text-sm`}>
                          {signal.Action === "BUY" ? "🟢 BUY" : signal.Action === "SELL" ? "🔴 SELL" : "🟡 HOLD"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-white">₹{signal.Price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right text-green-400">
                        {signal.Target ? `₹${signal.Target.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="p-3 text-right text-red-400">
                        {signal.StopLoss ? `₹${signal.StopLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
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