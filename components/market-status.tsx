"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarketStatusProps {
  botControl: any[]; // Expecting botControl data from dashboard API
}

export function MarketStatus({ botControl }: MarketStatusProps) {
  // Ensure botControl is an array before attempting to find
  const safeBotControl = Array.isArray(botControl) ? botControl : [];

  // Extract values from botControl prop
  const getBotControlValue = (param: string) => {
    const control = safeBotControl.find(item => item.Parameter === param);
    return control ? control.Value : 'N/A';
  };

  const marketMood = getBotControlValue('marketMood'); // Assuming 'marketMood' is a parameter in botControl
  const totalSignals = getBotControlValue('totalSignals'); // Assuming 'totalSignals' is a parameter in botControl
  const lastUpdate = getBotControlValue('last_updated'); // Assuming 'last_updated' is a parameter in botControl

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