
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationProps {
  stockSymbol: string;
  exchange: string;
  companyName: string;
  currentPrice?: number;
}

export const AIRecommendationCard = ({ stockSymbol, exchange, companyName, currentPrice }: AIRecommendationProps) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendation = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-stock-analysis', {
        body: {
          stockSymbol,
          exchange,
          analysisType: 'ai_recommendation'
        }
      });

      if (error) throw error;

      // Parse the recommendation from the AI response
      const analysisText = data.analysis;
      
      // Simple parsing - in a real app, you'd want more sophisticated parsing
      let action = 'HOLD';
      let confidence = 'Medium';
      let riskLevel = 'Moderate';
      
      if (analysisText.toLowerCase().includes('buy') && analysisText.toLowerCase().includes('strong')) {
        action = 'BUY';
        confidence = 'High';
      } else if (analysisText.toLowerCase().includes('sell')) {
        action = 'SELL';
        confidence = 'Medium';
        riskLevel = 'High';
      } else if (analysisText.toLowerCase().includes('buy')) {
        action = 'BUY';
      }

      setRecommendation({
        action,
        confidence,
        riskLevel,
        analysis: analysisText,
        timestamp: data.timestamp
      });

      toast({
        title: "Recommendation Generated",
        description: `AI recommendation for ${stockSymbol} is ready`,
      });

    } catch (error: any) {
      console.error('Recommendation error:', error);
      toast({
        title: "Recommendation Failed",
        description: error.message || "Failed to generate recommendation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-600 text-white';
      case 'SELL': return 'bg-red-600 text-white';
      default: return 'bg-amber-600 text-white';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return TrendingUp;
      case 'SELL': return TrendingDown;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="w-6 h-6 text-orange-500" />
          <span>AI Investment Recommendation</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
            {stockSymbol} ({exchange})
          </Badge>
          {currentPrice && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              ₹{currentPrice.toLocaleString('en-IN')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!recommendation ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              Get AI-powered investment recommendation for {companyName}
            </p>
            <Button
              onClick={generateRecommendation}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate AI Recommendation'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const ActionIcon = getActionIcon(recommendation.action);
                  return (
                    <>
                      <Badge className={getActionColor(recommendation.action)}>
                        <ActionIcon className="w-4 h-4 mr-1" />
                        {recommendation.action}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {recommendation.confidence} Confidence
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${
                          recommendation.riskLevel === 'High' ? 'text-red-400 border-red-400' :
                          recommendation.riskLevel === 'Low' ? 'text-green-400 border-green-400' :
                          'text-amber-400 border-amber-400'
                        }`}
                      >
                        {recommendation.riskLevel} Risk
                      </Badge>
                    </>
                  );
                })()}
              </div>
              <Button
                onClick={generateRecommendation}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Refresh
              </Button>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">AI Analysis Summary</h4>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">
                  {recommendation.analysis}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center">
              Generated on {new Date(recommendation.timestamp).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata'
              })} IST
            </div>

            <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-3">
              <p className="text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Investment Disclaimer: This is AI-generated analysis for educational purposes only. 
                Please consult a financial advisor before making investment decisions. 
                Investments are subject to market risks.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
