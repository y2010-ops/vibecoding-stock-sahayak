
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StockTicker() {
  const stocks = [
    { 
      symbol: "AAPL", 
      name: "Apple Inc.", 
      price: "428.10", 
      change: "+1.26%", 
      changeValue: "+5.35",
      trend: "up",
      chartData: [20, 25, 22, 30, 28, 35, 40]
    },
    { 
      symbol: "MSFT", 
      name: "Microsoft Corp.", 
      price: "342.85", 
      change: "-0.58%", 
      changeValue: "-2.01",
      trend: "down",
      chartData: [35, 32, 28, 25, 22, 20, 18]
    },
    { 
      symbol: "TSLA", 
      name: "Tesla Inc.", 
      price: "245.20", 
      change: "+2.34%", 
      changeValue: "+5.62",
      trend: "up",
      chartData: [15, 18, 22, 25, 30, 35, 38]
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Real-Time Stock Ticker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{stock.symbol}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stock.name}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold text-slate-900 dark:text-white">${stock.price}</div>
                <div className={`text-sm flex items-center ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stock.change} ({stock.changeValue})
                </div>
              </div>
              
              <div className="w-20 h-10">
                <svg viewBox="0 0 80 40" className="w-full h-full">
                  <polyline
                    points={stock.chartData.map((value, index) => `${index * 12},${40 - value}`).join(' ')}
                    fill="none"
                    stroke={stock.trend === 'up' ? '#16a34a' : '#dc2626'}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
