
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, MessageCircle, Send, Globe, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    webDataUsed?: string[];
    stockSymbol?: string;
  };
}

export const AIChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm StockMind AI with real-time market data access. I can help you with live stock prices, latest news, financial reports, and market analysis for NSE/BSE stocks. Ask me about any stock or market topic!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-enhanced', {
        body: {
          message: userMessage.content,
          context: 'Indian stock market chat with live data'
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          webDataUsed: data.webDataUsed,
          stockSymbol: data.stockSymbol
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show toast if live data was used
      if (data.webDataUsed && data.webDataUsed.length > 0) {
        toast({
          title: "Live Data Used",
          description: `Fetched real-time ${data.webDataUsed.join(', ')} for accurate analysis`,
        });
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I encountered an error while fetching live market data. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative animate-fade-in">
      <div className="bg-card/70 backdrop-blur-sm rounded-3xl shadow-xl border border-border overflow-hidden flex flex-col min-h-[520px] max-h-[75vh]">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border bg-gradient-to-r from-card/80 via-card/90 to-primary/5">
          <TrendingUp className="w-7 h-7 text-primary drop-shadow" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent tracking-wide">
            StockMind AI Assistant
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Globe className="w-3 h-3" />
            <span>Live Data</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 w-full h-full px-4 sm:px-6 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/60"
            style={{ background: "transparent", maxHeight: "55vh" }}
          >
            <div className="space-y-4 pb-6">
              {messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`flex items-end ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {/* AVATAR */}
                  <div className={`flex flex-col items-center gap-1 ${message.type === 'user' ? 'order-2 ml-2' : 'order-1 mr-2'}`}>
                    <div className={`rounded-full flex items-center justify-center border-2 ${message.type === 'user' ? 'bg-gradient-to-br from-primary to-primary/80 border-primary' : 'bg-gradient-to-br from-blue-600 to-primary/70 border-blue-400'} w-9 h-9`}>
                      {message.type === 'user' ? (
                        <MessageCircle className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className={`max-w-[75vw] md:max-w-[60vw] break-words`}>
                    <div className={`p-3 rounded-2xl shadow text-sm md:text-base font-medium 
                      ${message.type === 'user'
                        ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-br-md'
                        : 'bg-muted/95 text-foreground rounded-bl-md'
                      }`}>
                      <span className="whitespace-pre-wrap">{message.content}</span>
                      
                      {/* Show metadata for assistant messages */}
                      {message.type === 'assistant' && message.metadata?.webDataUsed && message.metadata.webDataUsed.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="w-3 h-3 text-green-600 dark:text-green-400" />
                            <span>Live data: {message.metadata.webDataUsed.join(', ')}</span>
                            {message.metadata.stockSymbol && (
                              <span className="bg-secondary px-2 py-1 rounded text-primary">
                                {message.metadata.stockSymbol}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString('en-IN', { 
                        hour: "2-digit", 
                        minute: "2-digit", 
                        timeZone: "Asia/Kolkata" 
                      })} IST
                    </div>
                  </div>
                  
                  {/* If last item, set ref for scroll-to-bottom */}
                  {idx === messages.length - 1 && (
                    <div ref={bottomRef} />
                  )}
                </div>
              ))}
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-end justify-start group gap-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-600 to-primary/70 border-2 border-blue-400 w-9 h-9 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-muted/90 p-3 rounded-2xl rounded-bl-md animate-pulse shadow text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600 dark:text-green-400 animate-spin" />
                    Fetching live market data...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Chat Input */}
          <form
            className="w-full border-t border-border bg-gradient-to-r from-card/80 to-primary/5 px-4 py-5 flex items-center gap-3"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              type="text"
              value={input}
              autoFocus
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about live stock prices, latest news, or financial analysis..."
              className="flex-1 bg-muted/90 border border-border focus:border-primary rounded-full px-5 py-3 text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/40"
              disabled={isLoading}
              onKeyPress={handleKeyPress}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 rounded-full p-0 w-12 h-12 transition duration-200 shadow-lg flex items-center justify-center"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
