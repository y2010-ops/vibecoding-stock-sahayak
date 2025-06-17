
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentAnalysis() {
  const sentimentScore = 0.72;
  const circumference = 2 * Math.PI * 35;
  const strokeDasharray = `${sentimentScore * circumference} ${circumference}`;

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              className="text-green-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {Math.round(sentimentScore * 100)}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">POSITIVE</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Bullish</span>
            <span className="text-green-600 font-medium">72%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Bearish</span>
            <span className="text-red-600 font-medium">18%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Neutral</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">10%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
