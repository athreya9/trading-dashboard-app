"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, AlertCircle, Filter } from "lucide-react"
import { TradingSignalCard } from "./trading-signal-card"

interface EnhancedSignal {
  instrument: string
  signal: "BUY" | "SELL" | "HOLD"
  confidence: number
  price: number
  target?: number
  stopLoss?: number
  reasons: string[]
  news_insights?: string
  timestamp: string
}

export function EnhancedSignalsDashboard() {
  const [signals, setSignals] = useState<EnhancedSignal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'HIGH_CONFIDENCE'>('ALL')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchEnhancedSignals = async () => {
    setIsLoading(true)
    try {
      // First try to get generated signals from real price data
      const signalsResponse = await fetch('/api/generate-signals')
      const signalsData = await signalsResponse.json()
      
      console.log('📊 Generated signals from price data:', signalsData)

      if (signalsData.success && signalsData.signals && signalsData.signals.length > 0) {
        // Convert generated signals to enhanced signals format
        const enhancedSignals: EnhancedSignal[] = signalsData.signals.map((signal: any) => {
          const reasons = [
            signal.Reason,
            `RSI: ${signal.RSI}`,
            `MACD: ${signal.MACD}`,
            'Based on technical analysis of real market data'
          ]

          return {
            instrument: signal.Stock,
            signal: signal.Action as "BUY" | "SELL" | "HOLD",
            confidence: signal.Confidence,
            price: signal.Price,
            target: signal.Target,
            stopLoss: signal.StopLoss,
            reasons: reasons,
            news_insights: `Technical analysis based on real NIFTY data. ${signal.Reason}`,
            timestamp: new Date(signal.Date).toLocaleString()
          }
        }).filter((signal: EnhancedSignal) => signal.confidence > 0)

        setSignals(enhancedSignals)
        setLastUpdate(new Date().toLocaleTimeString())
        console.log('✅ Processed real signals:', enhancedSignals.length)
        return
      } else if (signalsData.error) {
        console.error('❌ Error from generate-signals API:', signalsData.error);
        toast.error("Failed to generate signals", {
          description: signalsData.error,
        });
      }

      // If no signals from either source
      console.log('📭 No signals available from any source')
      setSignals([])
      setLastUpdate(new Date().toLocaleTimeString())
      
    } catch (error) {
      console.error('❌ Error fetching enhanced signals:', error)
      toast.error("Error fetching enhanced signals", {
        description: (error as Error).message,
      });
      setSignals([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnhancedSignals()
    const interval = setInterval(fetchEnhancedSignals, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getFilteredSignals = () => {
    switch (filter) {
      case 'BUY':
        return signals.filter(s => s.signal === 'BUY')
      case 'SELL':
        return signals.filter(s => s.signal === 'SELL')
      case 'HIGH_CONFIDENCE':
        return signals.filter(s => s.confidence > 70)
      default:
        return signals
    }
  }

  const filteredSignals = getFilteredSignals()

  const getFilterBadgeColor = (filterType: string) => {
    return filter === filterType ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }

  const signalStats = {
    total: signals.length,
    buy: signals.filter(s => s.signal === 'BUY').length,
    sell: signals.filter(s => s.signal === 'SELL').length,
    highConfidence: signals.filter(s => s.confidence > 70).length
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            📊 ENHANCED TRADING SIGNALS
          </CardTitle>
          
          <Button
            onClick={fetchEnhancedSignals}
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {/* Stats and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          {/* Signal Statistics */}
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Total: {signalStats.total}
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Buy: {signalStats.buy}
            </Badge>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Sell: {signalStats.sell}
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              High Confidence: {signalStats.highConfidence}
            </Badge>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {['ALL', 'BUY', 'SELL', 'HIGH_CONFIDENCE'].map((filterType) => (
                <Button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  size="sm"
                  variant="outline"
                  className={getFilterBadgeColor(filterType)}
                >
                  {filterType.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {lastUpdate && (
          <div className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdate}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredSignals.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isLoading ? "Loading signals..." : "No signals found"}
            </h3>
            <p className="text-muted-foreground">
              {isLoading ? "Fetching latest trading signals..." : 
               filter === 'ALL' ? "No trading signals available at the moment." :
               `No signals match the ${filter.toLowerCase().replace('_', ' ')} filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSignals.map((signal, index) => (
              <TradingSignalCard key={index} signal={signal} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}