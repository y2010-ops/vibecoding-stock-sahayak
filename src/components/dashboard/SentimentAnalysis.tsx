
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SentimentAnalysis() {
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Word cloud effect */}
        <div className="relative h-32 mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 300 120" className="w-full h-full">
              {/* Word cloud elements */}
              <text x="150" y="60" fontSize="24" fill="#8b5cf6" textAnchor="middle" fontWeight="bold">word</text>
              <text x="80" y="40" fontSize="18" fill="#a855f7" textAnchor="middle" opacity="0.7">Public</text>
              <text x="220" y="85" fontSize="16" fill="#c084fc" textAnchor="middle" opacity="0.6">Interest</text>
              <text x="250" y="45" fontSize="14" fill="#ddd6fe" textAnchor="middle" opacity="0.5">TTx</text>
              <text x="50" y="90" fontSize="12" fill="#e9d5ff" textAnchor="middle" opacity="0.4">-</text>
              <text x="120" y="20" fontSize="10" fill="#f3e8ff" textAnchor="middle" opacity="0.3">-</text>
            </svg>
          </div>
        </div>

        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${70 * 2.2} ${100 * 2.2}`}
                className="text-blue-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white">+0.7</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">SCORE</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Moderate</span>
            <span className="text-sm text-slate-900 dark:text-white">Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
