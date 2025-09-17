"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"

export default function PersonalTradingAdvisorPage() {
  const [advisorData, setAdvisorData] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const advisorResponse = await fetch("https://datradingplatform-884404713353.asia-south1.run.app/api/advisor-output")
      if (advisorResponse.ok) {
        const advisorResult = await advisorResponse.json()
        if (Array.isArray(advisorResult)) {
          setAdvisorData(advisorResult)
          console.log("📊 Google Sheets Advisor_Output:", advisorResult)
        }
      } else {
        const errorResult = await advisorResponse
          .json()
          .catch(() => ({ details: "Could not parse error response." }))
        console.error("❌ Failed to fetch advisor data:", errorResult.error)
        toast.warning("Could not fetch advisor data.", {
          description:
            errorResult.details ||
            `The server responded with status ${advisorResponse.status}.`,
        })
      }
    } catch (error) {
      console.error("Error in refreshData:", error)
      toast.error("An unexpected error occurred while refreshing data.", {
        description: (error as Error).message,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 30000) // Auto-refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Trading Advisor</h1>
      <PersonalTradingAdvisor advisorData={advisorData} />
    </div>
  )
}
