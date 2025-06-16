
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/indian-market/HeroSection";
import { MarketStatusWidget } from "@/components/indian-market/MarketStatusWidget";
import { StockSearchBar } from "@/components/indian-market/StockSearchBar";
import { PopularStocksCarousel } from "@/components/indian-market/PopularStocksCarousel";
import { FeatureCards } from "@/components/indian-market/FeatureCards";
import { NewsSection } from "@/components/indian-market/NewsSection";
import { AuthModal } from "@/components/auth/AuthModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserCircle, TrendingUp, MessageCircle, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      return data.session;
    },
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                StockMind
              </h1>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <MarketStatusWidget />
              
              {/* Theme Toggle - Made more prominent */}
              <div className="flex items-center">
                <ThemeToggle />
              </div>
              
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                onClick={() => navigate('/ai-chat')}
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Welcome, {user.email}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8 space-y-12">
        <HeroSection />
        
        <div className="max-w-4xl mx-auto">
          <StockSearchBar />
        </div>

        <PopularStocksCarousel />
        
        <FeatureCards />
        
        <NewsSection />
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Investment in securities market are subject to market risks, read all the scheme related documents carefully before investing.
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs">
              SEBI Registration Number: Example/2023 | BSE: INE/2023 | NSE: INE/2023
            </p>
            <p className="text-slate-400 dark:text-slate-600 text-xs">
              © 2024 StockMind AI. All rights reserved. | Made in India 🇮🇳 | Powered by Gemini AI
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;
