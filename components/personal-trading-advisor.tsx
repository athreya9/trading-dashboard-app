import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

// Define the structure of a single advisor data entry from Firestore
interface AdvisorEntry {
  recommendation: string; // e.g., "BUY NIFTY (CALL)"
  confidence: string;    // e.g., "85%"
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  reasons: string;
  timestamp: string;
}

interface PersonalTradingAdvisorProps {
  advisorData: AdvisorEntry[];
}

export function PersonalTradingAdvisor({ advisorData }: PersonalTradingAdvisorProps) {
  const getSignalClass = (recommendation: string) => {
    if (recommendation.includes('BUY')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    } else if (recommendation.includes('SELL')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  // Helper to extract symbol from recommendation string
  const getSymbol = (recommendation: string) => {
    const match = recommendation.match(/BUY\s(.*?)\s/);
    return match ? match[1] : 'N/A';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Trading Advisor</CardTitle>
      </CardHeader>
      <CardContent>
        {advisorData && advisorData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead> {/* Changed from Signal */}
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Entry Price</TableHead>
                <TableHead className="text-right">Take Profit</TableHead> {/* Changed from Target */}
                <TableHead className="text-right">Stop Loss</TableHead>
                <TableHead>Reasons</TableHead> {/* Changed from Rationale */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {advisorData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell><Badge variant="outline" className={getSignalClass(entry.recommendation)}>{entry.recommendation.split(' ')[0]}</Badge></TableCell> {/* Extract BUY/SELL */}
                  <TableCell className="font-medium">{getSymbol(entry.recommendation)}</TableCell> {/* Extract Symbol */}
                  <TableCell className="text-right">{entry.entry_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-green-400">{entry.take_profit.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-red-400">{entry.stop_loss.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{entry.reasons}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <AlertCircle className="w-10 h-10 mb-4" />
            <p className="font-semibold">No trading advice available at the moment.</p>
            <p className="text-sm">The advisor will provide signals when market conditions are met.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}