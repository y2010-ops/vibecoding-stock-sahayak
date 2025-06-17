
import { Button } from "@/components/ui/button";

export function DashboardHero() {
  return (
    <div className="relative bg-gradient-to-r from-orange-100 via-purple-100 to-blue-200 dark:from-orange-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-xl p-8 mb-6 overflow-hidden">
      {/* Background chart illustration */}
      <div className="absolute right-8 top-4 w-80 h-40 opacity-60">
        <svg viewBox="0 0 320 160" className="w-full h-full">
          <path
            d="M0,120 Q80,100 160,80 T320,40"
            stroke="#6366f1"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          <circle cx="40" cy="110" r="2" fill="#6366f1" opacity="0.6" />
          <circle cx="120" cy="90" r="2" fill="#6366f1" opacity="0.6" />
          <circle cx="200" cy="70" r="2" fill="#6366f1" opacity="0.6" />
          <circle cx="280" cy="50" r="2" fill="#6366f1" opacity="0.6" />
          
          {/* Grid lines */}
          <line x1="0" y1="140" x2="320" y2="140" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="120" x2="320" y2="120" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="100" x2="320" y2="100" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="80" x2="320" y2="80" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="60" x2="320" y2="60" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.5" />
          
          {/* Axis labels */}
          <text x="40" y="155" fontSize="10" fill="#64748b" textAnchor="middle">5</text>
          <text x="120" y="155" fontSize="10" fill="#64748b" textAnchor="middle">7</text>
          <text x="200" y="155" fontSize="10" fill="#64748b" textAnchor="middle">9</text>
          <text x="280" y="155" fontSize="10" fill="#64748b" textAnchor="middle">11</text>
          <text x="300" y="155" fontSize="10" fill="#64748b" textAnchor="middle">13</text>
          <text x="320" y="155" fontSize="10" fill="#64748b" textAnchor="middle">23</text>
        </svg>
      </div>
      
      <div className="relative z-10 max-w-md">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Smarter Stock Decisions with Real-Time AI Insight
        </h1>
        <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
          <span className="font-semibold">Ask</span> questions, analyze trends, and track sentiment—all in one place.
        </p>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Try Demo
          </Button>
          <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 px-6 py-2 rounded-lg">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
