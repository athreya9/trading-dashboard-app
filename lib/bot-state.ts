// Shared bot state across all API endpoints
interface BotState {
  status: 'running' | 'stopped' | 'error' | 'loading'
  lastStarted: string | null
  lastStopped: string | null
  uptime: string | null
  tradesExecuted: number
  marketHours: boolean
}

// Global bot state (in production, this would be in a database)
let globalBotState: BotState = {
  status: 'stopped',
  lastStarted: null,
  lastStopped: null,
  uptime: null,
  tradesExecuted: 0,
  marketHours: false
}

export function getBotState(): BotState {
  return { ...globalBotState }
}

export function updateBotState(updates: Partial<BotState>): BotState {
  globalBotState = { ...globalBotState, ...updates }
  return { ...globalBotState }
}

export function isMarketHours(): boolean {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes
  
  // Market hours: Monday-Friday, 9:15 AM - 3:30 PM IST
  const marketOpen = 9 * 60 + 15 // 9:15 AM
  const marketClose = 15 * 60 + 30 // 3:30 PM
  
  return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose
}