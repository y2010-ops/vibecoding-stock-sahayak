
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StockTicker() {
  const stocks = [
    { symbol: "AAPL", price: "428.1", change: "+1.26%", trend: "up", chartColor: "#10b981" },
    { symbol: "MSFT", price: "", change: "-0.58%", trend: "down", chartColor: "#6366f1" },
    { symbol: "TSLA", price: "45.2n", change: "+2.34%", trend: "up", chartColor: "#ef4444" },
  ];

  const timeframes = ["1D", "5D", "1M", "6M", "1Y", "Max"];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Real-Time Stock Ticker</CardTitle>
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                className={`text-xs px-2 py-1 h-auto ${tf === "Max" ? "text-blue-600" : "text-slate-500 dark:text-slate-400"}`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* AAPL */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">AAPL</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">428.1</div>
            <div className="text-green-500 text-sm font-medium mb-3">+1.26%</div>
            <div className="h-12">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <path
                  d="M0,30 Q25,25 50,20 T100,15"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* MSFT */}
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">MSFT</div>
            <div className="text-red-500 text-sm font-medium mb-3">-0.58%</div>
            <div className="h-20">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <path
                  d="M0,20 Q20,25 40,30 T80,40 T100,35"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Time labels */}
                <text x="5" y="55" fontSize="6" fill="#64748b">5h</text>
                <text x="25" y="55" fontSize="6" fill="#64748b">Feb</text>
                <text x="45" y="55" fontSize="6" fill="#64748b">A pn</text>
                <text x="65" y="55" fontSize="6" fill="#64748b">Jun</text>
                <text x="85" y="55" fontSize="6" fill="#64748b">25 rr</text>
              </svg>
            </div>
          </div>
        </div>

        {/* TSLA */}
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">TSLA</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">45.2n</div>
          <div className="text-red-500 text-sm font-medium mb-3">+2.34%</div>
          <div className="h-12">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path
                d="M0,35 Q20,30 40,25 T80,15 T100,20"
                stroke="#ef4444"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
