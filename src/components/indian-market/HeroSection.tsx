
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, BarChart3, Newspaper } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          AI-Powered Stock Analysis for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            Indian Markets
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
          Analyze NSE & BSE stocks with Technical + Fundamental + Sentiment Analysis
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <BarChart3 className="w-5 h-5 text-green-500" />
          <span className="text-slate-300">Technical Analysis</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-slate-300">Fundamental Analysis</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <Newspaper className="w-5 h-5 text-purple-500" />
          <span className="text-slate-300">Sentiment Analysis</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <Brain className="w-5 h-5 text-orange-500" />
          <span className="text-slate-300">AI Recommendations</span>
        </div>
      </div>

      <div className="pt-8">
        <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg px-8 py-3">
          Start Analyzing Stocks
        </Button>
      </div>
    </section>
  );
};
