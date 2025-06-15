
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm StockMind AI, your Indian stock market assistant. I can help you with stock analysis, market insights, investment strategies, and answer questions about NSE/BSE stocks. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Ref for last message div
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to last message in chat when messages update
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
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message: userMessage.content,
          context: 'Indian stock market chat'
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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
        content: "Sorry, I encountered an error. Please try again.",
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
      <div className="bg-slate-900/70 rounded-3xl shadow-xl border border-slate-700 overflow-hidden flex flex-col min-h-[520px] max-h-[75vh]">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-slate-900/80 via-slate-800/90 to-orange-900/20">
          <TrendingUp className="w-7 h-7 text-orange-500 drop-shadow" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-700 bg-clip-text text-transparent tracking-wide">
            StockMind AI Assistant
          </span>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 w-full h-full px-4 sm:px-6 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/60"
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
                    <div className={`rounded-full flex items-center justify-center border-2 ${message.type === 'user' ? 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-500' : 'bg-gradient-to-br from-blue-600 to-slate-700 border-blue-400'} w-9 h-9`}>
                      {message.type === 'user' ? (
                        <MessageCircle className="w-5 h-5 text-white" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-orange-300" />
                      )}
                    </div>
                  </div>
                  {/* Message */}
                  <div className={`max-w-[75vw] md:max-w-[60vw] break-words`}>
                    <div className={`p-3 rounded-2xl shadow text-sm md:text-base font-medium 
                      ${message.type === 'user'
                        ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white rounded-br-md'
                        : 'bg-slate-800/95 text-orange-100 rounded-bl-md'
                      }`}>
                      <span className="whitespace-pre-wrap"
                      >{message.content}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{message.timestamp.toLocaleTimeString('en-IN', { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })} IST</div>
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
                  <div className="rounded-full bg-gradient-to-br from-blue-600 to-slate-700 border-2 border-blue-400 w-9 h-9 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-300 animate-pulse" />
                  </div>
                  <div className="bg-slate-800/90 p-3 rounded-2xl rounded-bl-md animate-pulse shadow text-orange-100">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          {/* Chat Input */}
          <form
            className="w-full border-t border-slate-700 bg-gradient-to-r from-slate-900/80 to-orange-950/30 px-4 py-5 flex items-center gap-3"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              type="text"
              value={input}
              autoFocus
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question about Indian stocks, news or strategies…"
              className="flex-1 bg-slate-800/90 border border-slate-700 focus:border-orange-400 rounded-full px-5 py-3 text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-orange-500/40"
              disabled={isLoading}
              onKeyPress={handleKeyPress}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 hover:bg-orange-700 rounded-full p-0 w-12 h-12 transition duration-200 shadow-lg flex items-center justify-center"
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
