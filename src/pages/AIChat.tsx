
import { AIChatAssistant } from "@/components/ai/AIChatAssistant";
import { NewsAPISettings } from "@/components/ai/NewsAPISettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, ArrowLeft, MessageCircle, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tips = [
  "Ask about Nifty, Sensex, or a stock (e.g., 'TCS news and analysis')",
  "Try 'latest market news' for comprehensive coverage.",
  "Request specific company news: 'LIC recent headlines'",
  "Ask for sector news: 'Banking sector latest updates'",
  "Try sentiment analysis: 'What's the market mood today?'",
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
          
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                APIs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="mt-4 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-slate-200 mb-2 flex items-center gap-1">
                  <MessageCircle className="w-5 h-5 text-orange-400" /> AI Chat Assistant
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Enhanced with multiple news APIs for comprehensive market coverage.
                </p>
                
                <div className="mb-6">
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
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-slate-200 mb-2">News API Setup</h2>
                <p className="text-slate-400 text-sm">
                  Configure news sources for better coverage.
                </p>
              </div>
            </TabsContent>
          </Tabs>
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
          <Tabs defaultValue="chat" className="w-full">
            <TabsContent value="chat">
              <AIChatAssistant />
            </TabsContent>
            <TabsContent value="settings">
              <NewsAPISettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIChat;
