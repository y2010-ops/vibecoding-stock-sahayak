
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
import { Button } from "@/components/ui/button";
import { UserCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">StockMind</h1>
              <span className="text-orange-500 text-sm font-medium">AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <MarketStatusWidget />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-300">Welcome, {user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
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
      <main className="container mx-auto px-4 py-8 space-y-12">
        <HeroSection />
        
        <div className="max-w-4xl mx-auto">
          <StockSearchBar />
        </div>

        <PopularStocksCarousel />
        
        <FeatureCards />
        
        <NewsSection />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Investment in securities market are subject to market risks, read all the scheme related documents carefully before investing.
            </p>
            <p className="text-slate-500 text-xs">
              SEBI Registration Number: Example/2023 | BSE: INE/2023 | NSE: INE/2023
            </p>
            <p className="text-slate-600 text-xs">
              © 2024 StockMind AI. All rights reserved. | Made in India 🇮🇳
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;
