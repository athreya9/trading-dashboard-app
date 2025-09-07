"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"

interface TradingChartProps {
  symbol?: string
}

export function TradingChart({ symbol = "RELIANCE" }: TradingChartProps) {
  console.log("[v0] TradingChart component initializing for symbol:", symbol)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])

  const generateMockData = () => {
    const data = []
    let basePrice = 2800

    for (let i = 0; i < 50; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (50 - i))

      const change = (Math.random() - 0.5) * 40
      basePrice = Math.max(2500, Math.min(3200, basePrice + change))

      const open = basePrice
      const volatility = 20
      const high = open + Math.random() * volatility
      const low = open - Math.random() * volatility
      const close = low + Math.random() * (high - low)

      data.push({
        date: date.toLocaleDateString(),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      })

      basePrice = close
    }

    return data
  }

  const drawChart = () => {
    console.log("[v0] drawChart called, chartData length:", chartData.length)

    const canvas = canvasRef.current
    if (!canvas) {
      console.log("[v0] Canvas ref not available")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.log("[v0] Canvas context not available")
      return
    }

    try {
      // Set canvas size
      canvas.width = canvas.offsetWidth * 2
      canvas.height = 400 * 2
      ctx.scale(2, 2)

      // Clear canvas
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(0, 0, canvas.offsetWidth, 400)

      if (chartData.length === 0) {
        console.log("[v0] No chart data available")
        return
      }

      // Calculate price range
      const prices = chartData.flatMap((d) => [d.high, d.low])
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const priceRange = maxPrice - minPrice

      // Draw candlesticks
      const candleWidth = (canvas.offsetWidth - 80) / chartData.length

      chartData.forEach((data, index) => {
        const x = 40 + index * candleWidth
        const openY = 350 - ((data.open - minPrice) / priceRange) * 300
        const closeY = 350 - ((data.close - minPrice) / priceRange) * 300
        const highY = 350 - ((data.high - minPrice) / priceRange) * 300
        const lowY = 350 - ((data.low - minPrice) / priceRange) * 300

        // Draw wick
        ctx.strokeStyle = data.close >= data.open ? "#22c55e" : "#ef4444"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x + candleWidth / 2, highY)
        ctx.lineTo(x + candleWidth / 2, lowY)
        ctx.stroke()

        // Draw body
        ctx.fillStyle = data.close >= data.open ? "#22c55e" : "#ef4444"
        const bodyHeight = Math.abs(closeY - openY)
        const bodyY = Math.min(openY, closeY)
        ctx.fillRect(x + 2, bodyY, candleWidth - 4, Math.max(bodyHeight, 1))
      })

      // Draw price labels
      ctx.fillStyle = "#9ca3af"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"

      for (let i = 0; i <= 5; i++) {
        const price = minPrice + (priceRange * i) / 5
        const y = 350 - i * 60
        ctx.fillText(`₹${price.toFixed(0)}`, 35, y + 4)
      }

      // Draw signals
      if (chartData.length > 10) {
        // Buy signal
        const buyIndex = chartData.length - 10
        const buyX = 40 + buyIndex * candleWidth + candleWidth / 2
        const buyY = 350 - ((chartData[buyIndex].low - minPrice) / priceRange) * 300 + 20

        ctx.fillStyle = "#22c55e"
        ctx.beginPath()
        ctx.moveTo(buyX, buyY)
        ctx.lineTo(buyX - 8, buyY + 15)
        ctx.lineTo(buyX + 8, buyY + 15)
        ctx.closePath()
        ctx.fill()

        // Sell signal
        const sellIndex = chartData.length - 5
        const sellX = 40 + sellIndex * candleWidth + candleWidth / 2
        const sellY = 350 - ((chartData[sellIndex].high - minPrice) / priceRange) * 300 - 20

        ctx.fillStyle = "#ef4444"
        ctx.beginPath()
        ctx.moveTo(sellX, sellY)
        ctx.lineTo(sellX - 8, sellY - 15)
        ctx.lineTo(sellX + 8, sellY - 15)
        ctx.closePath()
        ctx.fill()
      }

      console.log("[v0] Chart drawing completed successfully")
    } catch (error) {
      console.error("[v0] Error in drawChart:", error)
    }
  }

  const loadChartData = async () => {
    console.log("[v0] loadChartData called")
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = generateMockData()
      console.log("[v0] Generated mock data, length:", data.length)
      setChartData(data)
    } catch (error) {
      console.error("[v0] Error loading chart data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("[v0] TradingChart useEffect - loading chart data")
    loadChartData()
  }, [])

  useEffect(() => {
    console.log("[v0] TradingChart useEffect - drawing chart")
    drawChart()
  }, [chartData])

  console.log("[v0] TradingChart rendering")

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          {symbol} - Price Chart
        </CardTitle>
        <Button onClick={loadChartData} disabled={isLoading} size="sm" variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] bg-gray-900 rounded-lg"
          style={{ width: "100%", height: "400px" }}
        />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Bullish Candle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Bearish Candle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-green-500"></div>
            <span>Buy Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
            <span>Sell Signal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
