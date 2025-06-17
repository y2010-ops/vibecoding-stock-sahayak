
import { Button } from "@/components/ui/button";

export function DashboardHero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-3">
          Smarter Stock Decisions with Real-Time AI Insights
        </h1>
        <p className="text-blue-100 mb-6 text-lg">
          Ask questions, analyze trends, and track sentiment—all in one place.
        </p>
        <div className="flex space-x-4">
          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 font-semibold">
            Try Demo
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-2 font-semibold">
            Subscribe
          </Button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <path d="M0,100 Q50,80 100,60 T200,40" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="25" cy="90" r="2" fill="white" />
          <circle cx="75" cy="70" r="2" fill="white" />
          <circle cx="125" cy="50" r="2" fill="white" />
          <circle cx="175" cy="45" r="2" fill="white" />
        </svg>
      </div>
    </div>
  );
}
