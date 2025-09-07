"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Target, Activity } from "lucide-react"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"
import { TradingChart } from "@/components/trading-chart"
import { DailyTopTrades } from "@/components/daily-top-trades"

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
      // Fetch real data from Google Sheets API
      const response = await fetch('/api/data')
      const result = await response.json()
      
      if (result.data && result.data.length > 0) {
        // Parse the data from Google Sheets
        // Assuming the sheet has columns: Date, Symbol, Price, High, Low, Open, Close, etc.
        const latestRow = result.data[result.data.length - 1] // Get the latest data
        
        if (latestRow && latestRow.length >= 6) {
          setNiftyData({
            currentPrice: parseFloat(latestRow[2]) || 0,
            todaysHigh: parseFloat(latestRow[3]) || 0,
            todaysLow: parseFloat(latestRow[4]) || 0,
            openingPrice: parseFloat(latestRow[5]) || 0,
            previousClose: parseFloat(latestRow[6]) || 0,
          })
        }
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
            DA Trading Dashboard
          </h1>

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

        <PersonalTradingAdvisor />

        <DailyTopTrades />

        <TradingChart symbol="NIFTY 50" />

        {/* Options Chain removed - will be added when real options data is available */}

        {/* Performance Summary removed - will be calculated from real trading data */}
      </div>
    </div>
  )
}
