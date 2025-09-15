"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"

export function TradingAdviceBanner() {
  const [tradingAdvice, setTradingAdvice] = useState('Loading...')
  const [latestSignal, setLatestSignal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoading(true)
      try {
        // Fetch signals from our secure API
        const response = await fetch('/api/generate-signals')
        const signalsData = await response.json()
        
        if (signalsData.success && signalsData.signals.length > 0) {
          const latest = signalsData.signals[0];
          setTradingAdvice(latest.Reason || 'No advice available');
          setLatestSignal(latest);
          console.log('✅ Trading advice updated from API:', latest);
        } else {
          setTradingAdvice('Market in consolidation. No clear signals.');
          setLatestSignal({
            Action: 'HOLD',
            Stock: 'MARKET',
            Price: '0',
            Confidence: '0'
          });
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error fetching advice:', errorMessage)
        setTradingAdvice('Unable to fetch trading advice')
        toast.error("Unable to fetch trading advice", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdvice()
    // Refresh every 30 seconds - REAL API calls only
    const interval = setInterval(fetchAdvice, 30000)
    return () => clearInterval(interval)
  }, [])

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
              {isLoading ? (
                <RefreshCw className="h-6 w-6 text-white animate-spin" />
              ) : (
                getActionIcon(latestSignal?.Action)
              )}
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
              {latestSignal.Stock && (
                <div className="text-center">
                  <div className="text-white/80">Stock</div>
                  <div className="text-white font-bold">{latestSignal.Stock}</div>
                </div>
              )}
              {latestSignal.Price && (
                <div className="text-center">
                  <div className="text-white/80">Price</div>
                  <div className="text-white font-bold">₹{parseFloat(latestSignal.Price).toFixed(2)}</div>
                </div>
              )}
              {latestSignal.Target && (
                <div className="text-center">
                  <div className="text-white/80">Target</div>
                  <div className="text-green-300 font-bold">₹{parseFloat(latestSignal.Target).toFixed(2)}</div>
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