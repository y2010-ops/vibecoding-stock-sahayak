
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, BarChart3, Newspaper, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisProps {
  stockSymbol: string;
  exchange: string;
  companyName: string;
}

export const AIStockAnalysis = ({ stockSymbol, exchange, companyName }: AIAnalysisProps) => {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>({});
  const { toast } = useToast();

  const runAnalysis = async (analysisType: string) => {
    setActiveAnalysis(analysisType);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-stock-analysis', {
        body: {
          stockSymbol,
          exchange,
          analysisType
        }
      });

      if (error) throw error;

      setAnalysisData(prev => ({
        ...prev,
        [analysisType]: data
      }));

      toast({
        title: "Analysis Complete",
        description: `${analysisType} analysis generated successfully`,
      });

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate analysis",
        variant: "destructive",
      });
    } finally {
      setActiveAnalysis(null);
    }
  };

  const analysisTypes = [
    {
      key: 'technical',
      title: 'Technical Analysis',
      description: 'Charts, indicators, and price patterns',
      icon: BarChart3,
      color: 'text-green-500'
    },
    {
      key: 'fundamental',
      title: 'Fundamental Analysis',
      description: 'Financial health and valuation',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      key: 'sentiment',
      title: 'Sentiment Analysis',
      description: 'Market sentiment and news impact',
      icon: Newspaper,
      color: 'text-purple-500'
    },
    {
      key: 'ai_recommendation',
      title: 'AI Recommendation',
      description: 'Complete investment recommendation',
      icon: Brain,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="w-6 h-6 text-orange-500" />
            <span>AI Analysis for {companyName}</span>
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              {stockSymbol} ({exchange})
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {analysisTypes.map((analysis) => {
              const Icon = analysis.icon;
              const isLoading = activeAnalysis === analysis.key;
              const hasData = analysisData[analysis.key];
              
              return (
                <Card key={analysis.key} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${analysis.color}`} />
                        <h3 className="font-medium text-white">{analysis.title}</h3>
                      </div>
                      {hasData && (
                        <Badge variant="default" className="bg-green-600 text-white">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{analysis.description}</p>
                    <Button
                      onClick={() => runAnalysis(analysis.key)}
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        hasData ? 'Refresh Analysis' : 'Run Analysis'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {Object.keys(analysisData).length > 0 && (
            <Tabs defaultValue={Object.keys(analysisData)[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-700">
                {Object.keys(analysisData).map((key) => {
                  const analysis = analysisTypes.find(a => a.key === key);
                  return (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {analysis?.title.split(' ')[0]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {Object.entries(analysisData).map(([key, data]: [string, any]) => (
                <TabsContent key={key} value={key}>
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-6">
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">
                          {data.analysis}
                        </pre>
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        Generated on {new Date(data.timestamp).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata'
                        })} IST
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
