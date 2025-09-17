"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
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
import { EnhancedSignalsDashboard } from "@/components/enhanced-signals-dashboard"

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

  const [advisorData, setAdvisorData] = useState<any[]>([])
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
      console.log("Fetching NIFTY data from: https://datradingplatform-884404713353.asia-south1.run.app/api/nifty-data");
      const niftyResponse = await fetch('https://datradingplatform-884404713353.asia-south1.run.app/api/nifty-data');
      console.log("NIFTY response status:", niftyResponse.status);
      const niftyResult = await niftyResponse.json();
      console.log("NIFTY result:", niftyResult);

      if (niftyResult.success && niftyResult.data) {
        setNiftyData(niftyResult.data);
        console.log('✅ Real NIFTY data loaded:', niftyResult.data);
      } else {
        console.error('❌ Failed to fetch real NIFTY data:', niftyResult.error);
        toast.error("Failed to fetch NIFTY data", {
          description: niftyResult.error || "The server could not be reached.",
        });
      }

      console.log("Fetching advisor data from: https://datradingplatform-884404713353.asia-south1.run.app/api/advisor-output");
      const advisorResponse = await fetch('https://datradingplatform-884404713353.asia-south1.run.app/api/advisor-output');
      console.log("Advisor response status:", advisorResponse.status);
      const advisorResult = await advisorResponse.json();
      console.log("Advisor result:", advisorResult);

      if (Array.isArray(advisorResult)) {
        setAdvisorData(advisorResult);
        console.log('📊 Google Sheets Advisor_Output:', advisorResult);
      }
    } catch (error) {
      console.error("[v0] Error in refreshData:", error);
      toast.error("An unexpected error occurred while refreshing data.", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  console.log("[v0] NiftyQuantumPlatform rendering")

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Trading Dashboard
                </h1>
                <Link href="/personal-trading-advisor">
                  <Button variant="outline">Personal Trading Advisor</Button>
                </Link>
              </div>
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

        <EnhancedSignalsDashboard />

        <PersonalTradingAdvisor advisorData={advisorData} />

        <DailyTopTrades />

        <TradingChart symbol="NIFTY 50" />

        {/* Options Chain removed - will be added when real options data is available */}

        {/* Performance Summary removed - will be calculated from real trading data */}
      </div>
    </div>
  )
}
