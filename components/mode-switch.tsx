"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Settings, AlertTriangle } from "lucide-react"

interface SystemMode {
  mode: 'emergency' | 'full'
  description: string
  features: string[]
}

interface ModeSwitchProps {
  botControl: any[]; // Expecting botControl data from dashboard API
}

export function ModeSwitch({ botControl }: ModeSwitchProps) {
  const [isLoading, setIsLoading] = useState(false) // Keep isLoading for button state

  // Ensure botControl is an array before attempting to find
  const safeBotControl = Array.isArray(botControl) ? botControl : [];

  // Extract values from botControl prop
  const getBotControlValue = (param: string) => {
    const control = safeBotControl.find(item => item.Parameter === param);
    return control ? control.Value : 'N/A';
  };

  const mode = getBotControlValue('mode') as 'emergency' | 'full'; // Assuming 'mode' is a parameter in botControl
  const lastChanged = getBotControlValue('last_updated'); // Assuming 'last_updated' is a parameter in botControl

  const switchMode = async (newMode: 'emergency' | 'full') => {
    if (newMode === mode) return // Don't switch if already in that mode

    setIsLoading(true)
    try {
      const response = await fetch('/api/switch-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Changed from 'application'
        },
        body: JSON.stringify({ mode: newMode })
      })

      const result = await response.json()

      if (result.success) {
        // Mode will be updated by parent component's refreshData
        toast.success(`System mode switched to ${newMode.toUpperCase()}`, {
          description: `The bot is now operating in ${newMode} mode.`,
        })
      } else {
        console.error('Failed to switch mode:', result.error)
        toast.error("Failed to switch mode", { description: result.error })
      }
    } catch (error) {
      console.error('Error switching mode:', error)
      toast.error("Error switching mode", { description: (error as Error).message })
    } finally {
      setIsLoading(false)
    }
  }

  const getModeConfig = (modeType: 'emergency' | 'full'): SystemMode => {
    if (modeType === 'emergency') {
      return {
        mode: 'emergency',
        description: 'Basic analysis only - capital preservation focus',
        features: [
          'Conservative risk management',
          'Basic technical indicators only',
          'Lower position sizes',
          'Strict stop-losses',
          'No high-risk trades'
        ]
      }
    } else {
      return {
        mode: 'full',
        description: 'Full analysis with sentiment & advanced signals',
        features: [
          'Advanced technical analysis',
          'Sentiment analysis integration',
          'Higher position sizes allowed',
          'Complex trading strategies',
          'All signal types enabled'
        ]
      }
    }
  }

  const currentConfig = getModeConfig(mode)
  const emergencyConfig = getModeConfig('emergency')
  const fullConfig = getModeConfig('full')

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-yellow-400 flex items-center justify-center gap-2">
          <Settings className="h-5 w-5" />
          SYSTEM MODE CONTROL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Mode Status */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-yellow-400">Current Mode</h3>
            <Badge className={`${mode === 'emergency' ? 'bg-yellow-600' : 'bg-green-600'} text-white px-3 py-1 text-sm font-bold`}>
              {mode === 'emergency' ? (
                <>
                  <Shield className="h-4 w-4 mr-1" />
                  🟡 EMERGENCY MODE
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  🟢 FULL MODE
                </>
              )}
            </Badge>
          </div>

          <p className="text-gray-300 mb-3">{currentConfig.description}</p>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Active Features:</h4>
            {currentConfig.features.map((feature, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                {feature}
              </div>
            ))}
          </div>

          {lastChanged && (
            <div className="mt-3 text-xs text-gray-500">
              Last changed: {lastChanged}
            </div>
          )}
        </div>

        {/* Mode Switch Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emergency Mode Button */}
          <Button
            onClick={() => switchMode('emergency')}
            disabled={isLoading || mode === 'emergency'}
            className={`h-auto p-4 flex flex-col items-start gap-2 transition-all ${
              mode === 'emergency'
                ? 'bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400'
                : 'bg-yellow-700 hover:bg-yellow-600 border border-yellow-600'
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <Shield className="h-5 w-5" />
              <span className="font-bold">🟡 EMERGENCY MODE</span>
            </div>
            <p className="text-xs text-left opacity-90">
              {emergencyConfig.description}
            </p>
            {mode === 'emergency' && (
              <Badge className="bg-white text-yellow-800 text-xs">
                ACTIVE
              </Badge>
            )}
          </Button>

          {/* Full Mode Button */}
          <Button
            onClick={() => switchMode('full')}
            disabled={isLoading || mode === 'full'}
            className={`h-auto p-4 flex flex-col items-start gap-2 transition-all ${
              mode === 'full'
                ? 'bg-green-600 hover:bg-green-700 border-2 border-green-400'
                : 'bg-green-700 hover:bg-green-600 border border-green-600'
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <Zap className="h-5 w-5" />
              <span className="font-bold">🟢 FULL MODE</span>
            </div>
            <p className="text-xs text-left opacity-90">
              {fullConfig.description}
            </p>
            {mode === 'full' && (
              <Badge className="bg-white text-green-800 text-xs">
                ACTIVE
              </Badge>
            )}
          </Button>
        </div>

        {/* Warning for Full Mode */}
        {mode === 'full' && (
          <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">Advanced Mode Active</span>
            </div>
            <p className="text-orange-200 text-xs mt-1">
              Full mode enables advanced trading strategies with higher risk potential. Monitor positions closely.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-2">
            <div className="text-blue-400 text-sm">Switching mode...</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}