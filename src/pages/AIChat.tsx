
import { AIChatAssistant } from "@/components/ai/AIChatAssistant";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIChat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">StockMind</h1>
                <span className="text-orange-500 text-sm font-medium">AI Chat</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Chat with StockMind AI
            </h2>
            <p className="text-slate-400">
              Get instant answers about Indian stocks, market insights, and investment strategies
            </p>
          </div>
          
          <AIChatAssistant />
        </div>
      </main>
    </div>
  );
};

export default AIChat;
