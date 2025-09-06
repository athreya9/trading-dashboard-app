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

interface OptionsData {
  strikePrice: number
  calls: {
    oi: number
    iv: number
    volume: number
    lotSize: number
  }
  puts: {
    oi: number
    iv: number
    volume: number
    lotSize: number
  }
}

interface PerformanceData {
  estimatedPnL: number
  signalProbability: number
  signalDirection: "bullish" | "bearish"
}

export default function NiftyQuantumPlatform() {
  console.log("[v0] NiftyQuantumPlatform component initializing")

  const [niftyData, setNiftyData] = useState<NiftyData>({
    currentPrice: 21850.75,
    todaysHigh: 21920.5,
    todaysLow: 21780.25,
    openingPrice: 21800.0,
    previousClose: 21825.3,
  })

  const [optionsData, setOptionsData] = useState<OptionsData[]>([
    {
      strikePrice: 21700,
      calls: { oi: 125000, iv: 18.5, volume: 45000, lotSize: 50 },
      puts: { oi: 98000, iv: 19.2, volume: 32000, lotSize: 50 },
    },
    {
      strikePrice: 21750,
      calls: { oi: 180000, iv: 17.8, volume: 67000, lotSize: 50 },
      puts: { oi: 145000, iv: 18.9, volume: 48000, lotSize: 50 },
    },
    {
      strikePrice: 21800,
      calls: { oi: 220000, iv: 16.9, volume: 89000, lotSize: 50 },
      puts: { oi: 195000, iv: 17.5, volume: 72000, lotSize: 50 },
    },
    {
      strikePrice: 21850,
      calls: { oi: 285000, iv: 15.8, volume: 125000, lotSize: 50 },
      puts: { oi: 275000, iv: 16.2, volume: 118000, lotSize: 50 },
    },
    {
      strikePrice: 21900,
      calls: { oi: 195000, iv: 17.2, volume: 78000, lotSize: 50 },
      puts: { oi: 225000, iv: 16.8, volume: 95000, lotSize: 50 },
    },
    {
      strikePrice: 21950,
      calls: { oi: 145000, iv: 18.5, volume: 52000, lotSize: 50 },
      puts: { oi: 180000, iv: 17.9, volume: 68000, lotSize: 50 },
    },
    {
      strikePrice: 22000,
      calls: { oi: 98000, iv: 19.8, volume: 35000, lotSize: 50 },
      puts: { oi: 125000, iv: 18.6, volume: 45000, lotSize: 50 },
    },
  ])

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    estimatedPnL: 125750.5,
    signalProbability: 78.5,
    signalDirection: "bullish",
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    console.log("[v0] Setting up auto-refresh interval")
    const interval = setInterval(() => {
      console.log("[v0] Auto-refresh triggered")
      refreshData()
    }, 5000) // Auto-refresh every 5 seconds as specified

    return () => {
      console.log("[v0] Cleaning up auto-refresh interval")
      clearInterval(interval)
    }
  }, [])

  const refreshData = async () => {
    console.log("[v0] refreshData called")
    setIsRefreshing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const priceChange = (Math.random() - 0.5) * 50 // ±25 points
      const newPrice = Math.max(21500, Math.min(22200, niftyData.currentPrice + priceChange))

      console.log("[v0] Updating nifty data, new price:", newPrice)

      setNiftyData((prev) => ({
        currentPrice: newPrice,
        todaysHigh: Math.max(prev.todaysHigh, newPrice),
        todaysLow: Math.min(prev.todaysLow, newPrice),
        openingPrice: prev.openingPrice,
        previousClose: prev.previousClose,
      }))

      setOptionsData((prev) =>
        prev.map((option) => ({
          ...option,
          calls: {
            ...option.calls,
            oi: Math.max(50000, option.calls.oi + Math.floor((Math.random() - 0.5) * 10000)),
            iv: Math.max(10, Math.min(25, option.calls.iv + (Math.random() - 0.5) * 2)),
            volume: Math.max(10000, option.calls.volume + Math.floor((Math.random() - 0.5) * 5000)),
          },
          puts: {
            ...option.puts,
            oi: Math.max(50000, option.puts.oi + Math.floor((Math.random() - 0.5) * 10000)),
            iv: Math.max(10, Math.min(25, option.puts.iv + (Math.random() - 0.5) * 2)),
            volume: Math.max(10000, option.puts.volume + Math.floor((Math.random() - 0.5) * 5000)),
          },
        })),
      )

      setPerformanceData({
        estimatedPnL: 100000 + Math.random() * 100000,
        signalProbability: 60 + Math.random() * 30,
        signalDirection: Math.random() > 0.5 ? "bullish" : "bearish",
      })

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

        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Options Chain Dashboard
            </CardTitle>
            <Button onClick={refreshData} disabled={isRefreshing} size="sm" variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calls (CE) Column */}
              <div>
                <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Calls (CE)
                </h3>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Strike</th>
                        <th className="p-2 text-right">OI</th>
                        <th className="p-2 text-right">IV%</th>
                        <th className="p-2 text-right">Volume</th>
                        <th className="p-2 text-right">Lot Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionsData.map((option, index) => (
                        <tr
                          key={index}
                          className={`border-b hover:bg-muted/50 ${option.strikePrice === 21850 ? "bg-green-50 dark:bg-green-900/20" : ""}`}
                        >
                          <td className="p-2 font-medium">{option.strikePrice}</td>
                          <td className="p-2 text-right">{option.calls.oi.toLocaleString()}</td>
                          <td className="p-2 text-right">{option.calls.iv.toFixed(1)}%</td>
                          <td className="p-2 text-right">{option.calls.volume.toLocaleString()}</td>
                          <td className="p-2 text-right">{option.calls.lotSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Puts (PE) Column */}
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Puts (PE)
                </h3>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Strike</th>
                        <th className="p-2 text-right">OI</th>
                        <th className="p-2 text-right">IV%</th>
                        <th className="p-2 text-right">Volume</th>
                        <th className="p-2 text-right">Lot Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {optionsData.map((option, index) => (
                        <tr
                          key={index}
                          className={`border-b hover:bg-muted/50 ${option.strikePrice === 21850 ? "bg-red-50 dark:bg-red-900/20" : ""}`}
                        >
                          <td className="p-2 font-medium">{option.strikePrice}</td>
                          <td className="p-2 text-right">{option.puts.oi.toLocaleString()}</td>
                          <td className="p-2 text-right">{option.puts.iv.toFixed(1)}%</td>
                          <td className="p-2 text-right">{option.puts.volume.toLocaleString()}</td>
                          <td className="p-2 text-right">{option.puts.lotSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-xl">
              <Target className="h-6 w-6" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">₹{performanceData.estimatedPnL.toLocaleString()}</div>
                <div className="text-white/80 text-lg mt-2">Estimated P&L on Expiry</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {performanceData.signalProbability.toFixed(1)}%
                </div>
                <div className="text-white/80 text-lg mb-4">Signal Probability</div>

                {/* Signal Probability Meter */}
                <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      performanceData.signalDirection === "bullish" ? "bg-green-400" : "bg-red-400"
                    }`}
                    style={{ width: `${performanceData.signalProbability}%` }}
                  ></div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    performanceData.signalDirection === "bullish" ? "text-green-200" : "text-red-200"
                  }`}
                >
                  {performanceData.signalDirection === "bullish" ? "🐂 BULLISH" : "🐻 BEARISH"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
