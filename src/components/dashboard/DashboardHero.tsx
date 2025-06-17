
import { Button } from "@/components/ui/button";

export function DashboardHero() {
  return (
    <div className="relative bg-gradient-to-r from-orange-200 via-purple-200 to-blue-300 dark:from-orange-900/50 dark:via-purple-900/50 dark:to-blue-900/50 rounded-xl p-8 mb-8 overflow-hidden">
      {/* Background chart illustration */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <path
            d="M0,150 Q100,120 200,80 T400,60"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-blue-600"
          />
        </svg>
      </div>
      
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Smarter Stock Decisions with Real-Time AI Insight
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
          <strong>Ask</strong> questions, analyze trends, and track sentiment—all in one place.
        </p>
        <div className="flex space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
            Try Demo
          </Button>
          <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
