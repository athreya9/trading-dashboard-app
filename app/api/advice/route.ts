import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, this would fetch from Google Sheets API
    // For now, returning mock data
    const mockAdvice = [
      "STRONG BUY: Reliance Industries - Target ₹2,850 (Current: ₹2,650)",
      "HOLD: TCS - Consolidation expected around ₹3,200-3,400 range",
      "SELL: HDFC Bank - Profit booking recommended above ₹1,650",
      "BUY: Infosys - Good entry point below ₹1,450, Target ₹1,600",
      "STRONG BUY: ICICI Bank - Breakout above ₹1,200, Target ₹1,350",
    ]

    const randomAdvice = mockAdvice[Math.floor(Math.random() * mockAdvice.length)]

    return NextResponse.json({ advice: randomAdvice })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trading advice" }, { status: 500 })
  }
}
