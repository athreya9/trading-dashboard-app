"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"

export default function PersonalTradingAdvisorPage() {
  const [advisorData, setAdvisorData] = useState<any[]>([]);
  const [lastSignalTimestamp, setLastSignalTimestamp] = useState<string | null>(null);

  useEffect(() => {
    const refreshData = async () => {
      if (typeof window !== 'undefined') { // Ensure this runs only in the browser
        try {
          const advisorResponse = await fetch("https://trading-backend-390383470275.asia-south1.run.app/api/dashboard");
          const advisorResult = await advisorResponse.json();
          if (Array.isArray(advisorResult)) {
            setAdvisorData(advisorResult);

            // Check for a new, valid signal to show a notification
            if (advisorResult.length > 0 && advisorResult[0].Recommendation !== "No high-confidence signals found.") {
              const newTimestamp = advisorResult[0].Timestamp;
              if (newTimestamp && newTimestamp !== lastSignalTimestamp) {
                toast.success("New trading advice received!", {
                  description: advisorResult[0].Recommendation,
                });
                setLastSignalTimestamp(newTimestamp);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to fetch trading advice.");
        }
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 30000);

    return () => clearInterval(interval);
  }, [lastSignalTimestamp]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Personal Trading Advisor</h1>
        <Link href="/">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Home</button>
        </Link>
      </div>
      <PersonalTradingAdvisor advisorData={advisorData} />
    </div>
  )
}