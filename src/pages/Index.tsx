
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { AISearchBox } from "@/components/dashboard/AISearchBox";
import { StockTicker } from "@/components/dashboard/StockTicker";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
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
    <MainLayout>
      <div className="space-y-6">
        <DashboardHero />
        <AISearchBox />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockTicker />
          <div className="space-y-6">
            <SentimentAnalysis />
            <NewsFeed />
          </div>
        </div>
        
        <div className="fixed bottom-6 right-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 shadow-lg">
            Ask AI Anything
          </Button>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </MainLayout>
  );
};

export default Index;
