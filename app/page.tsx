"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Target, Activity } from "lucide-react"
import { PersonalTradingAdvisor } from "@/components/personal-trading-advisor"
import { TradingChart } from "@/components/trading-chart"
import { DailyTopTrades } from "@/components/daily-top-trades"
import { TradingBotControl } from "@/components/trading-bot-control"
import { TradingAdviceBanner } from "@/components/trading-advice-banner"
import { MarketStatus } from "@/components/market-status"
import { ModeSwitch } from "@/components/mode-switch"
import { EnhancedSignalsDashboard } from "@/components/enhanced-signals-dashboard"
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface DashboardData {
  advisorOutput: any[];
  signals: any[];
  botControl: any[];
  priceData: any[];
  tradeLog: any[];
  lastRefreshed: string;
}

interface NiftyData {
  currentPrice: number;
  todaysHigh: number;
  todaysLow: number;
  openingPrice: number;
  previousClose: number;
}

export default function NiftyQuantumPlatform() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [niftyData, setNiftyData] = useState<NiftyData | null>(null); // Initialize as null

  useEffect(() => {
    const refreshData = async () => {
      try {
        const fetchData = async (collectionName: string) => {
          const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => doc.data());
        };

        const [advisorOutput, signals, botControl, priceData, tradeLog] = await Promise.all([
          fetchData('advisor_output'),
          fetchData('signals'),
          fetchData('bot_control'),
          fetchData('price_data'),
          fetchData('trade_log'),
        ]);

        const newDashboardData: DashboardData = {
          advisorOutput,
          signals,
          botControl,
          priceData,
          tradeLog,
          lastRefreshed: new Date().toISOString(),
        };

        setDashboardData(newDashboardData);
        console.log("Dashboard data:", newDashboardData);
        toast.success("Data refreshed successfully!");

        // Update niftyData state separately
        if (priceData.length > 0) {
          const latestNiftyData = priceData[0];
          setNiftyData({
            currentPrice: latestNiftyData.close,
            todaysHigh: latestNiftyData.high,
            todaysLow: latestNiftyData.low,
            openingPrice: latestNiftyData.open,
            previousClose: latestNiftyData.close, // This might not be correct, depends on the data
          });
        } else {
          setNiftyData(null); // Reset if no data
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error connecting to backend.", { description: (error as Error).message });
      }
    };

    refreshData();
    const interval = setInterval(refreshData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Render loading state if data is not yet available
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  // Extract data for display
  const advisorOutput = dashboardData && dashboardData.advisorOutput ? dashboardData.advisorOutput : [];
  const botControl = dashboardData && dashboardData.botControl ? dashboardData.botControl : [];
  const signals = dashboardData && dashboardData.signals ? dashboardData.signals : [];

  // Find specific bot control values
  const getBotControlValue = (param: string) => {
    const control = botControl.find(item => item.Parameter === param);
    return control ? control.Value : 'N/A';
  };

  const botStatus = getBotControlValue('status');
  const marketHours = getBotControlValue('marketHours'); // Assuming this is also in botControl

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src="/da-logo.svg"
                alt="DA Logo"
                width={80}
                height={80}
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Trading Dashboard
                </h1>
                <Link href="/personal-trading-advisor">
                  <Button variant="outline">Personal Trading Advisor</Button>
                </Link>
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium mb-2">
                Algorithmic Trading Intelligence Platform
              </p>
              {/* MarketStatus component might need to be updated to use dashboardData.botControl */}
              <MarketStatus botControl={botControl} />
            </div>
          </div>

          {niftyData && ( // Conditional rendering for Nifty data cards
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">₹{niftyData.currentPrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">₹{niftyData.todaysHigh.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Today's High</div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">₹{niftyData.todaysLow.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Today's Low</div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">₹{niftyData.openingPrice.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Opening Price</div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-semibold text-foreground">₹{niftyData.previousClose.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Previous Close</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <TradingAdviceBanner /> {/* This component needs to be updated to use advisorOutput */}

        <ModeSwitch /> {/* This component needs to be updated to use botControl */}

        <TradingBotControl botControl={botControl} /> {/* Pass botControl data */}

        <EnhancedSignalsDashboard signals={signals} /> {/* Pass signals data */}

        <PersonalTradingAdvisor advisorData={advisorOutput} /> {/* Pass advisorOutput data */}

        <DailyTopTrades /> {/* This component needs to be updated to use tradeLog */}

        <TradingChart symbol="NIFTY 50" />

      </div>
    </div>
  )
}