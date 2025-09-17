"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"

export default function PersonalTradingAdvisorPage() {
  const [advisorData, setAdvisorData] = useState<any[]>([]);

  useEffect(() => {
    const refreshData = async () => {
      try {
        const advisorResponse = await fetch("https://datradingplatform-884404713353.asia-south1.run.app/api/advisor-output");
        const advisorResult = await advisorResponse.json();
        if (Array.isArray(advisorResult)) {
          setAdvisorData(advisorResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Trading Advisor</h1>
      <PersonalTradingAdvisor advisorData={advisorData} />
    </div>
  )
}