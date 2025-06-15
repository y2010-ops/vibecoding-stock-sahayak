
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, BarChart3, Newspaper, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative text-center space-y-8 py-16">
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-gradient-to-br from-green-400/30 to-blue-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Next-Generation AI Analytics</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Stock Analysis
          </span>
          <br />
          <span className="text-slate-800 dark:text-slate-200">for Indian Markets</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
          Analyze NSE & BSE stocks with{" "}
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Technical + Fundamental + Sentiment Analysis
          </span>
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
          <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Technical Analysis</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Fundamental Analysis</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
          <Newspaper className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">Sentiment Analysis</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">AI Recommendations</span>
        </div>
      </div>

      <div className="pt-8 space-y-4">
        <Button 
          size="lg" 
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white text-lg px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          Start Analyzing Stocks
        </Button>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/ai-chat')}
            className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Try AI Chat
          </Button>
        </div>
      </div>
    </section>
  );
};
