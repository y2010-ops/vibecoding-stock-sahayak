
// Redesigned AI Chat Page Layout

import { AIChatAssistant } from "@/components/ai/AIChatAssistant";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tips = [
  "Ask about Nifty, Sensex, or a stock (e.g., ‘TCS outlook?’)",
  "Try portfolio advice: ‘How to diversify in IT sector?’",
  "Type ‘latest market news’ for AI summaries.",
  "Ask for sector comparisons: ‘IT vs Banking sector’",
  "Request investment strategies or explainers.",
];

const AIChat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-orange-800/60">
      {/* Sidebar / Hero */}
      <aside className="w-full md:w-[350px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900/80 p-6 flex flex-col gap-8 justify-between border-b md:border-b-0 md:border-r border-slate-700">
        <div>
          {/* Branding */}
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-10 h-10 text-orange-500" />
            <span className="text-3xl font-bold text-white tracking-wider">StockMind</span>
          </div>
          <h2 className="text-lg font-medium text-slate-200 mb-2 flex items-center gap-1">
            <MessageCircle className="w-5 h-5 text-orange-400" /> AI Chat Assistant
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Your AI-powered Indian stock market guide. Chat for instant analysis, insights, news, and investment tips—all tailored for NSE/BSE.
          </p>
          {/* Tips */}
          <div className="mb-8">
            <div className="font-semibold text-slate-300 mb-2 tracking-wide flex items-center gap-1">
              <Search className="w-4 h-4 text-orange-400" /> Quick Tips
            </div>
            <ul className="list-disc ml-5 space-y-2 text-slate-400 text-sm">
              {tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="w-full text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </aside>
      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto mt-4 md:mt-10 animate-fade-in">
          <AIChatAssistant />
        </div>
      </main>
    </div>
  );
};

export default AIChat;

