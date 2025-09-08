// Utility functions for Indian Standard Time (IST) handling

/**
 * Get current time in IST
 */
export function getISTTime(): Date {
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000 // IST is UTC + 5:30
  return new Date(now.getTime() + istOffset)
}

/**
 * Format date/time in IST
 * Assumes input timestamps from Google Sheets are already in IST
 */
export function formatISTTime(date?: Date | string): string {
  if (date) {
    // Parse the date assuming it's already in IST format from Google Sheets
    const inputDate = new Date(date)
    
    // Format directly without adding offset (data is already in IST)
    return inputDate.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }
  
  // For current time, get IST time
  const istTime = getISTTime()
  return istTime.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

/**
 * Format time only in IST
 */
export function formatISTTimeOnly(date?: Date | string): string {
  const targetDate = date ? new Date(date) : getISTTime()
  
  return targetDate.toLocaleTimeString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

/**
 * Format date only in IST
 */
export function formatISTDateOnly(date?: Date | string): string {
  const targetDate = date ? new Date(date) : getISTTime()
  
  return targetDate.toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/**
 * Check if current IST time is within market hours
 */
export function isISTMarketHours(): boolean {
  const istTime = getISTTime()
  const day = istTime.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = istTime.getHours()
  const minutes = istTime.getMinutes()
  const currentTime = hours * 60 + minutes
  
  // Indian Market hours: Monday-Friday, 9:15 AM - 3:30 PM IST
  const marketOpen = 9 * 60 + 15 // 9:15 AM IST
  const marketClose = 15 * 60 + 30 // 3:30 PM IST
  
  return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose
}

/**
 * Get IST timestamp for API responses
 */
export function getISTTimestamp(): string {
  return getISTTime().toISOString()
}

/**
 * Convert UTC timestamp to IST display format
 */
export function convertUTCToIST(utcTimestamp: string): string {
  const utcDate = new Date(utcTimestamp)
  const istOffset = 5.5 * 60 * 60 * 1000
  const istDate = new Date(utcDate.getTime() + istOffset)
  
  return istDate.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

/**
 * Format Google Sheets timestamp (already in IST) for display
 */
export function formatGoogleSheetsTimestamp(timestamp: string): string {
  // Google Sheets timestamps are already in IST format like "2025-09-05 15:15:00"
  const date = new Date(timestamp)
  
  return date.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}