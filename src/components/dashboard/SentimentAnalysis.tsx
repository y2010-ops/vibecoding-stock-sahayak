
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentAnalysis() {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${70 * 2.51} ${100 * 2.51}`}
                className="text-blue-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">+0.7</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">SCORE</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">• Moderate</span>
              <span className="text-slate-900 dark:text-white">Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
