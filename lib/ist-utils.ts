// Utility functions for Indian Standard Time (IST) handling

/**
 * Get current time in IST.
 * NOTE: This creates a Date object whose UTC time represents the wall-clock time in IST.
 * Use getUTCFoo() methods to extract values.
 */
function getISTDate(date: Date = new Date()): Date {
  const istOffset = 330 * 60 * 1000; // 5.5 hours in milliseconds
  return new Date(date.getTime() + istOffset);
}

/**
 * Check if current IST time is within Indian market hours (9:15 AM - 3:30 PM).
 * This function is server-agnostic and works correctly on UTC environments like Vercel.
 */
export function isMarketHours(): boolean {
  const istDate = getISTDate();

  // Use getUTC* methods because the date object's time is shifted to represent IST
  const day = istDate.getUTCDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();

  // Indian Market hours: Monday-Friday
  if (day < 1 || day > 5) {
    return false;
  }

  // 9:15 AM to 3:30 PM IST
  const currentTimeInMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;   // 555
  const marketClose = 15 * 60 + 30; // 930

  return currentTimeInMinutes >= marketOpen && currentTimeInMinutes <= marketClose;
}

/**
 * Format time only in IST
 */
export function formatISTTimeOnly(date?: Date | string): string {
  // Use toLocaleTimeString which is reliable for formatting
  const targetDate = date ? new Date(date) : new Date();
  return targetDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Get IST timestamp for API responses
 */
export function getISTTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');
}

/**
 * Format Google Sheets timestamp (already in IST) for display
 */
export function formatGoogleSheetsTimestamp(timestamp: string): string {
  if (!timestamp || !timestamp.includes(' ')) return "Invalid Date";
  // Google Sheets timestamps are already in IST format like "2025-09-05 15:15:00"
  // Parse the timestamp components directly to avoid timezone conversion
  const [datePart, timePart] = timestamp.split(' ')
  const [year, month, day] = datePart.split('-')
  const [hour, minute, second] = timePart.split(':')
  
  // Convert to 12-hour format
  const hour24 = parseInt(hour, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  // Format as DD/MM/YYYY, HH:MM:SS AM/PM
  return `${day}/${month}/${year}, ${hour12.toString().padStart(2, '0')}:${minute}:${second} ${ampm}`;
}