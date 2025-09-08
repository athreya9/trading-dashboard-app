"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Target, Activity } from "lucide-react"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"
import { TradingChart } from "@/components/trading-chart"
import { DailyTopTrades } from "@/components/daily-top-trades"
import { TradingBotControl } from "@/components/trading-bot-control"
import { TradingAdviceBanner } from "@/components/trading-advice-banner"
import { MarketStatus } from "@/components/market-status"
import { ModeSwitch } from "@/components/mode-switch"

interface NiftyData {
  currentPrice: number
  todaysHigh: number
  todaysLow: number
  openingPrice: number
  previousClose: number
}

// Removed unused interfaces - will be added back when real data sources are available

export default function NiftyQuantumPlatform() {
  console.log("[v0] NiftyQuantumPlatform component initializing")

  const [niftyData, setNiftyData] = useState<NiftyData>({
    currentPrice: 0,
    todaysHigh: 0,
    todaysLow: 0,
    openingPrice: 0,
    previousClose: 0,
  })

  // Removed fake data state - only keeping real Nifty data from Google Sheets

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    console.log("[v0] Setting up auto-refresh interval")
    // Initial data fetch
    refreshData()
    
    const interval = setInterval(() => {
      console.log("[v0] Auto-refresh triggered")
      refreshData()
    }, 30000) // Auto-refresh every 30 seconds (reduced from 5 seconds to save API calls)

    return () => {
      console.log("[v0] Cleaning up auto-refresh interval")
      clearInterval(interval)
    }
  }, [])

  const refreshData = async () => {
    console.log("[v0] refreshData called")
    setIsRefreshing(true)

    try {
      // Use OpenSheet API to directly access Google Sheets data
      const response = await fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output')
      const data = await response.json()
      
      if (data && data.length > 0) {
        // Get the latest row of data
        const latestRow = data[data.length - 1]
        
        setNiftyData({
          currentPrice: parseFloat(latestRow.Price || latestRow.CurrentPrice || '0') || 0,
          todaysHigh: parseFloat(latestRow.High || latestRow.TodaysHigh || '0') || 0,
          todaysLow: parseFloat(latestRow.Low || latestRow.TodaysLow || '0') || 0,
          openingPrice: parseFloat(latestRow.Open || latestRow.OpeningPrice || '0') || 0,
          previousClose: parseFloat(latestRow.PreviousClose || latestRow.PrevClose || '0') || 0,
        })
      }

      console.log("[v0] Data refresh completed successfully")
    } catch (error) {
      console.error("[v0] Error in refreshData:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  console.log("[v0] NiftyQuantumPlatform rendering")

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image 
                src="/da-logo.svg" 
                alt="DA Logo" 
                width={80}
                height={80}
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Trading Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium mb-2">
                Algorithmic Trading Intelligence Platform
              </p>
              <MarketStatus />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">₹{niftyData.currentPrice.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Current Price</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold text-foreground">₹{niftyData.todaysHigh.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Today's High</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold text-foreground">₹{niftyData.todaysLow.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Today's Low</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold text-foreground">₹{niftyData.openingPrice.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Opening Price</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold text-foreground">₹{niftyData.previousClose.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Previous Close</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <TradingAdviceBanner />

        <ModeSwitch />

        <TradingBotControl />

        <PersonalTradingAdvisor />

        <DailyTopTrades />

        <TradingChart symbol="NIFTY 50" />

        {/* Options Chain removed - will be added when real options data is available */}

        {/* Performance Summary removed - will be calculated from real trading data */}
      </div>
    </div>
  )
}
