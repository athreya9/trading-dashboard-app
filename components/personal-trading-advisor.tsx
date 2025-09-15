import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

                      <td className="p-3 text-right text-green-400">
// Define the structure of a single advisor data entry from your Google Sheet
interface AdvisorEntry {
  Timestamp: string;
  Signal: 'BUY' | 'SELL' | 'HOLD';
  Symbol: string;
  'Entry Price': string; // The sheet has a space in the name
  Target: string;
  'Stop Loss': string; // The sheet has a space in the name
  Rationale: string;
}

interface PersonalTradingAdvisorProps {
  advisorData: AdvisorEntry[];
}

export function PersonalTradingAdvisor({ advisorData }: PersonalTradingAdvisorProps) {
  const getSignalClass = (signal: AdvisorEntry['Signal']) => {
    switch (signal) {
      case 'BUY':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SELL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
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
                <TableHead>Signal</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Entry Price</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Stop Loss</TableHead>
                <TableHead>Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advisorData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell><Badge variant="outline" className={getSignalClass(entry.Signal)}>{entry.Signal}</Badge></TableCell>
                  <TableCell className="font-medium">{entry.Symbol}</TableCell>
                  <TableCell className="text-right">{entry['Entry Price']}</TableCell>
                  <TableCell className="text-right text-green-400">{entry.Target}</TableCell>
                  <TableCell className="text-right text-red-400">{entry['Stop Loss']}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{entry.Rationale}</TableCell>
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