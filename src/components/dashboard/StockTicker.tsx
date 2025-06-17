
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StockTicker() {
  const stocks = [
    { symbol: "AAPL", price: "428.1", change: "+1.26%", trend: "up" },
    { symbol: "MSFT", price: "425.8", change: "-0.58%", trend: "down" },
    { symbol: "TSLA", price: "45.2n", change: "+2.34%", trend: "up" },
  ];

  const timeframes = ["1D", "5D", "1M", "6M", "1Y", "Max"];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-white">Real-Time Stock Ticker</CardTitle>
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                className={`text-xs ${tf === "Max" ? "text-blue-600" : "text-slate-500"}`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{stock.symbol}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stock.price}</div>
            </div>
            <div className={`flex items-center space-x-1 ${
              stock.trend === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {stock.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{stock.change}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
