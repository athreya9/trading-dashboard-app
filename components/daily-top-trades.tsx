"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react"

interface TradeOpportunity {
  stockName: string
  symbol: string
  action: "BUY" | "SELL"
  entryPrice: number
  stopLoss: number
  targetPrice: number
  riskRewardRatio: string
  confidenceScore: number
  reason: string
}

export function DailyTopTrades() {
  console.log("[v0] DailyTopTrades component initializing")

  const [trades, setTrades] = useState<TradeOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] DailyTopTrades useEffect - fetching top trades")

    // Simulate fetching data from Google Sheets 'Top_Trades' tab
    const fetchTopTrades = async () => {
      console.log("[v0] fetchTopTrades called")
      setIsLoading(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in real implementation, this would come from Google Sheets
        const mockTrades: TradeOpportunity[] = [
          {
            stockName: "Reliance Industries",
            symbol: "RELIANCE",
            action: "BUY",
            entryPrice: 2820,
            stopLoss: 2790,
            targetPrice: 2880,
            riskRewardRatio: "1:2.0",
            confidenceScore: 87,
            reason: "SMA Crossover + High Volume",
          },
          {
            stockName: "HDFC Bank",
            symbol: "HDFCBANK",
            action: "BUY",
            entryPrice: 1650,
            stopLoss: 1620,
            targetPrice: 1720,
            riskRewardRatio: "1:2.3",
            confidenceScore: 82,
            reason: "Breakout Above Resistance",
          },
          {
            stockName: "Infosys",
            symbol: "INFY",
            action: "SELL",
            entryPrice: 1420,
            stopLoss: 1450,
            targetPrice: 1360,
            riskRewardRatio: "1:2.0",
            confidenceScore: 79,
            reason: "Bearish Divergence + Overbought",
          },
          {
            stockName: "Tata Consultancy Services",
            symbol: "TCS",
            action: "BUY",
            entryPrice: 3850,
            stopLoss: 3800,
            targetPrice: 3950,
            riskRewardRatio: "1:2.0",
            confidenceScore: 75,
            reason: "Support Level Bounce",
          },
        ]

        // Filter for high-confidence trades (>70%)
        const highConfidenceTrades = mockTrades.filter((trade) => trade.confidenceScore > 70)

        console.log("[v0] Filtered high confidence trades:", highConfidenceTrades.length)

        setTrades(highConfidenceTrades.slice(0, 5)) // Maximum 5 trades
        console.log("[v0] Top trades data loaded successfully")
      } catch (error) {
        console.error("[v0] Error in fetchTopTrades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopTrades()
  }, [])

  console.log("[v0] DailyTopTrades rendering, trades count:", trades.length, "isLoading:", isLoading)

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Top 5 Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading trading opportunities...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (trades.length === 0) {
    return (
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Top 5 Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <div className="text-lg font-semibold text-foreground mb-2">No high-quality opportunities found.</div>
            <div className="text-muted-foreground">It's better to preserve capital and wait for tomorrow.</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Today's Top 5 Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trades.map((trade, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden ${
                trade.action === "BUY"
                  ? "border-l-4 border-l-green-500 bg-green-50/5"
                  : "border-l-4 border-l-red-500 bg-red-50/5"
              }`}
            >
              <CardContent className="p-4">
                {/* Stock Name & Symbol */}
                <div className="mb-3">
                  <h3 className="font-semibold text-foreground text-sm">{trade.stockName}</h3>
                  <p className="text-xs text-muted-foreground">{trade.symbol}</p>
                </div>

                {/* Action Badge */}
                <div className="mb-4">
                  <Badge
                    className={`text-sm font-bold px-3 py-1 ${
                      trade.action === "BUY"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {trade.action === "BUY" ? (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trade.action}
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {trade.action}
                      </>
                    )}
                  </Badge>
                </div>

                {/* Price Information */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="font-medium">₹{trade.entryPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="font-medium text-red-500">₹{trade.stopLoss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium text-green-500">₹{trade.targetPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">R:R Ratio:</span>
                    <span className="font-medium">{trade.riskRewardRatio}</span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <span className="text-xs font-medium">{trade.confidenceScore}%</span>
                  </div>
                  <Progress value={trade.confidenceScore} className="h-2" />
                </div>

                {/* Reason */}
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Reason: </span>
                  {trade.reason}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
