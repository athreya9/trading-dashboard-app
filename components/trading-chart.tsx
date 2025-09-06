"use client"

import { useEffect, useRef, useState } from "react"
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
} from "lightweight-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"

interface TradingChartProps {
  symbol?: string
}

interface SignalMarker {
  time: string
  position: "aboveBar" | "belowBar"
  color: string
  shape: "arrowUp" | "arrowDown"
  text: string
}

export function TradingChart({ symbol = "RELIANCE" }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const sma50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
  const sma200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Generate mock historical data
  const generateMockData = () => {
    const data: CandlestickData[] = []
    const sma50Data: LineData[] = []
    const sma200Data: LineData[] = []
    let basePrice = 2800
    const prices: number[] = []

    for (let i = 0; i < 200; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (200 - i))
      const time = date.toISOString().split("T")[0] as any

      // Generate realistic price movement
      const change = (Math.random() - 0.5) * 40
      basePrice = Math.max(2500, Math.min(3200, basePrice + change))

      const open = basePrice
      const volatility = 20
      const high = open + Math.random() * volatility
      const low = open - Math.random() * volatility
      const close = low + Math.random() * (high - low)

      prices.push(close)

      data.push({
        time,
        open,
        high,
        low,
        close,
      })

      // Calculate SMAs
      if (i >= 49) {
        const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / 50
        sma50Data.push({ time, value: sma50 })
      }

      if (i >= 199) {
        const sma200 = prices.slice(-200).reduce((a, b) => a + b, 0) / 200
        sma200Data.push({ time, value: sma200 })
      }

      basePrice = close
    }

    return { candlestickData: data, sma50Data, sma200Data }
  }

  const initializeChart = () => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#485563",
      },
      timeScale: {
        borderColor: "#485563",
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    })

    candlestickSeriesRef.current = candlestickSeries

    // Add SMA lines
    const sma50Series = chart.addLineSeries({
      color: "#3b82f6",
      lineWidth: 2,
      title: "SMA 50",
    })

    const sma200Series = chart.addLineSeries({
      color: "#f59e0b",
      lineWidth: 2,
      title: "SMA 200",
    })

    sma50SeriesRef.current = sma50Series
    sma200SeriesRef.current = sma200Series

    // Load initial data
    loadChartData()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }

  const loadChartData = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { candlestickData, sma50Data, sma200Data } = generateMockData()

      // Set data to series
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(candlestickData)

        // Add buy/sell signal markers
        const markers = [
          {
            time: candlestickData[candlestickData.length - 10].time,
            position: "belowBar" as const,
            color: "#22c55e",
            shape: "arrowUp" as const,
            text: "BUY",
          },
          {
            time: candlestickData[candlestickData.length - 5].time,
            position: "aboveBar" as const,
            color: "#ef4444",
            shape: "arrowDown" as const,
            text: "SELL",
          },
        ]

        candlestickSeriesRef.current.setMarkers(markers)
      }

      if (sma50SeriesRef.current) {
        sma50SeriesRef.current.setData(sma50Data)
      }

      if (sma200SeriesRef.current) {
        sma200SeriesRef.current.setData(sma200Data)
      }
    } catch (error) {
      console.error("Error loading chart data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cleanup = initializeChart()
    return cleanup
  }, [])

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          {symbol} - Candlestick Chart
        </CardTitle>
        <Button onClick={loadChartData} disabled={isLoading} size="sm" variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full h-[400px] bg-background rounded-lg" />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span>SMA 50</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-amber-500"></div>
            <span>SMA 200</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span>Buy Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Sell Signal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
