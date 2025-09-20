"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"

export default function PersonalTradingAdvisorPage() {
  const [dashboardData, setDashboardData] = useState<any>({ // Change to any to hold the full object
    advisorOutput: [],
    signals: [],
    botControl: [],
    priceData: [],
    tradeLog: [],
  });
  const [lastSignalTimestamp, setLastSignalTimestamp] = useState<string | null>(null);

  useEffect(() => {
    const refreshData = async () => {
      if (typeof window !== 'undefined') { // Ensure this runs only in the browser
        try {
          const advisorResponse = await fetch("https://trading-backend-390383470275.asia-south1.run.app/api/dashboard");
          const advisorResult = await advisorResponse.json();
          console.log("Dashboard data:", advisorResult); // Log the full result for debugging

          // Check if advisorResult is an object and contains advisorOutput
          if (typeof advisorResult === 'object' && advisorResult !== null && Array.isArray(advisorResult.advisorOutput)) {
            setDashboardData(advisorResult); // Set the entire dashboard data object

            // Check for a new, valid signal to show a notification
            const currentAdvisorOutput = advisorResult.advisorOutput;
            if (currentAdvisorOutput.length > 0 && currentAdvisorOutput[0].recommendation !== "No high-confidence signals found.") {
              const newTimestamp = currentAdvisorOutput[0].timestamp; // Use 'timestamp' from the new structure
              if (newTimestamp && newTimestamp !== lastSignalTimestamp) {
                toast.success("New trading advice received!", {
                  description: currentAdvisorOutput[0].recommendation,
                });
                setLastSignalTimestamp(newTimestamp);
              }
            }
          } else {
            console.warn("Received unexpected data structure from /api/dashboard:", advisorResult);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
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
      {/* Pass the relevant part of the dashboardData to the component */}
      <PersonalTradingAdvisor advisorData={dashboardData.advisorOutput} />
    </div>
  )
}