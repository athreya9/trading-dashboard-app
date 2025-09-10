"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RefreshCw, Bot, Clock, Calendar } from "lucide-react"

interface BotStatus {
  status: 'running' | 'stopped' | 'error' | 'loading'
  lastStarted?: string
  lastStopped?: string
  uptime?: string
  tradesExecuted?: number
  marketHours: boolean
}

export function TradingBotControl() {
  const [botStatus, setBotStatus] = useState<BotStatus>({
    status: 'loading',
    marketHours: false,
    tradesExecuted: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  const checkBotStatus = async () => {
    try {
      console.log('🔍 Checking bot status...')
      const response = await fetch('/api/bot-status')
      const result = await response.json()
      
      console.log('Bot status response:', result)
      
      if (result.success) {
        setBotStatus(result.status)
        console.log('✅ Bot status updated:', result.status)
      } else {
        console.error('❌ Failed to get bot status:', result.error)
      }
    } catch (error) {
      console.error('❌ Error checking bot status:', error)
      setBotStatus(prev => ({ ...prev, status: 'error' }))
    }
  }

  const startBot = async () => {
    setIsLoading(true)
    try {
      console.log('▶️ Attempting to start bot...')
      const response = await fetch('/api/start-bot', { method: 'POST' })
      const result = await response.json()
      
      console.log('Start bot response:', result)
      
      if (result.success) {
        console.log('✅ Bot started successfully');
        toast.success("Trading bot has been started successfully.");
        setBotStatus(result.status); // Use the state returned from the API
      } else {
        console.error('❌ Failed to start bot:', result.error);
        toast.error("Failed to start bot", { description: result.error });
      }
    } catch (error) {
      console.error('❌ Error starting bot:', error)
      toast.error("Error starting bot", { description: (error as Error).message });
      setBotStatus(prev => ({ ...prev, status: 'error' }))
    } finally {
      setIsLoading(false)
    }
  }

  const stopBot = async () => {
    setIsLoading(true)
    try {
      console.log('🛑 Attempting to stop bot...')
      const response = await fetch('/api/stop-bot', { method: 'POST' })
      const result = await response.json()
      
      console.log('Stop bot response:', result)
      
      if (result.success) {
        console.log('✅ Bot stopped successfully');
        toast.success("Trading bot has been stopped successfully.");
        setBotStatus(result.status); // Use the state returned from the API
      } else {
        console.error('❌ Failed to stop bot:', result.error);
        toast.error("Failed to stop bot", { description: result.error });
      }
    } catch (error) {
      console.error('❌ Error stopping bot:', error)
      toast.error("Error stopping bot", { description: (error as Error).message });
      setBotStatus(prev => ({ ...prev, status: 'error' }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkBotStatus()
    const interval = setInterval(checkBotStatus, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500 text-white'
      case 'stopped':
        return 'bg-gray-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'loading':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4" />
      case 'stopped':
        return <Square className="h-4 w-4" />
      case 'error':
        return <RefreshCw className="h-4 w-4" />
      case 'loading':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <Square className="h-4 w-4" />
    }
  }

  if (botStatus.status === 'loading') {
    return (
      <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
            <Bot className="h-6 w-6" />
            🤖 TRADING BOT CONTROLS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skeleton for Bot Status */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400">Bot Status</h3>
              <Skeleton className="h-7 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-300">Market Hours:</span><Skeleton className="h-5 w-16" /></div>
              <div className="flex justify-between"><span className="text-gray-300">Trades Today:</span><Skeleton className="h-5 w-8" /></div>
              <div className="flex justify-between"><span className="text-gray-300">Bot Activity:</span><Skeleton className="h-5 w-24" /></div>
              <div className="flex justify-between"><span className="text-gray-300">Last Started:</span><Skeleton className="h-5 w-20" /></div>
            </div>
          </div>

          {/* Skeleton for Control Buttons */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Manual Controls</h3>
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Skeleton for Schedule */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
            <Skeleton className="h-7 w-48 mb-3" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
          <Bot className="h-6 w-6" />
          🤖 TRADING BOT CONTROLS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bot Status */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-yellow-400">Bot Status</h3>
            <Badge className={`${getStatusColor(botStatus.status)} flex items-center gap-2 px-3 py-1`}>
              {getStatusIcon(botStatus.status)}
              {botStatus.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Market Hours:</span>
              <span className={`font-medium ${botStatus.marketHours ? 'text-green-400' : 'text-red-400'}`}>
                {botStatus.marketHours ? '🟢 OPEN' : '🔴 CLOSED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Trades Today:</span>
              <span className="text-white font-medium">{botStatus.tradesExecuted || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Bot Activity:</span>
              <span className="text-green-400 font-medium">
                {botStatus.status === 'running' ? '🟢 Monitoring Markets' : '🔴 Inactive'}
              </span>
            </div>
            {botStatus.lastStarted && (
              <div className="flex justify-between">
                <span className="text-gray-300">Last Started:</span>
                <span className="text-white font-mono text-xs">{botStatus.lastStarted}</span>
              </div>
            )}
            {botStatus.lastStopped && (
              <div className="flex justify-between">
                <span className="text-gray-300">Last Stopped:</span>
                <span className="text-white font-mono text-xs">{botStatus.lastStopped}</span>
              </div>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Manual Controls</h3>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={startBot}
              disabled={botStatus.status === 'running' || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isLoading && botStatus.status !== 'running' ? 'Starting...' : 'START Bot'}
            </Button>
            
            <Button
              onClick={stopBot}
              disabled={botStatus.status === 'stopped' || isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-3 flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              {isLoading && botStatus.status !== 'stopped' ? 'Stopping...' : 'STOP Bot'}
            </Button>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Trading Schedule
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Active Hours:</span>
              <span className="text-white font-medium">Monday - Friday, 9:15 AM - 3:30 PM IST</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              ⚠️ Bot automatically stops outside market hours for safety
            </div>
          </div>
        </div>

        {/* Bot Activity Status */}
        {botStatus.status === 'running' && botStatus.marketHours && (
          <div className="bg-green-900/30 border border-green-600 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-400">
              <Bot className="h-4 w-4" />
              <span className="font-medium">Bot is Active & Monitoring</span>
            </div>
            <p className="text-green-200 text-sm mt-1">
              ✅ Analyzing real-time market data every 15 minutes
            </p>
            <p className="text-green-200 text-sm">
              ✅ Waiting for high-confidence trading opportunities
            </p>
          </div>
        )}

        {/* Warning */}
        {!botStatus.marketHours && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Indian Market Closed</span>
            </div>
            <p className="text-yellow-200 text-sm mt-1">
              Trading bot is inactive outside Indian market hours (Mon-Fri 9:15 AM - 3:30 PM IST)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}