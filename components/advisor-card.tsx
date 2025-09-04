"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdvisorCard() {
  const [advice, setAdvice] = useState("Loading advice...")

  const fetchTradingAdvice = async () => {
    try {
      // This calls your own secure API endpoint, not Google directly
      const response = await fetch("/api/advice")
      const data = await response.json()

      // data.advice now contains the string from cell A1
      setAdvice(data.advice)
    } catch (error) {
      // Fallback to mock data for demonstration
      const mockAdvice = [
        "STRONG BUY: Reliance Industries - Target ₹2,850 (Current: ₹2,650)",
        "HOLD: TCS - Consolidation expected around ₹3,200-3,400 range",
        "SELL: HDFC Bank - Profit booking recommended above ₹1,650",
        "BUY: Infosys - Good entry point below ₹1,450, Target ₹1,600",
      ]
      setAdvice(mockAdvice[Math.floor(Math.random() * mockAdvice.length)])
    }
  }

  useEffect(() => {
    fetchTradingAdvice()

    // Refresh advice every 30 seconds
    const interval = setInterval(fetchTradingAdvice, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white dark:bg-card rounded-xl shadow-lg border-t-4 border-green-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-card-foreground">Trading Advisor</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-muted-foreground text-lg leading-relaxed">{advice}</p>
      </CardContent>
    </Card>
  )
}
