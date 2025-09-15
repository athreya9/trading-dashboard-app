"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function MarketStatus() {
  const [marketMood, setMarketMood] = useState('NEUTRAL')
  const [totalSignals, setTotalSignals] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        // Fetch signals from our secure API
        const response = await fetch('/api/generate-signals')
        const signalsData = await response.json()
        
        if (signalsData.success && signalsData.signals.length > 0) {
          // Calculate market mood based on generated signals
          const buySignals = signalsData.signals.filter((s: any) => s.Action === 'BUY').length
          const sellSignals = signalsData.signals.filter((s: any) => s.Action === 'SELL').length
          
          let mood = 'NEUTRAL'
          if (buySignals > sellSignals) mood = 'BULLISH'
          else if (sellSignals > buySignals) mood = 'BEARISH'
          
          setMarketMood(mood)
          setTotalSignals(signalsData.signals.length)
          setLastUpdate(new Date().toLocaleTimeString())
        }
      } catch (error) {
        console.error('Error fetching market status:', error)
        toast.error("Could not fetch market status", {
          description: (error as Error).message,
        });
      }
    }

    fetchMarketStatus()
    const interval = setInterval(fetchMarketStatus, 60000) // Update every minute with REAL data
    return () => clearInterval(interval)
  }, [])

  const getMoodIcon = () => {
    switch (marketMood) {
      case 'BULLISH':
        return <TrendingUp className="h-4 w-4" />
      case 'BEARISH':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getMoodColor = () => {
    switch (marketMood) {
      case 'BULLISH':
        return 'bg-green-500 text-white'
      case 'BEARISH':
        return 'bg-red-500 text-white'
      default:
        return 'bg-yellow-500 text-white'
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Badge className={`${getMoodColor()} flex items-center gap-1 px-3 py-1`}>
        {getMoodIcon()}
        {marketMood}
      </Badge>
      <span className="text-muted-foreground">
        {totalSignals} signals • Updated {lastUpdate}
      </span>
    </div>
  )
}