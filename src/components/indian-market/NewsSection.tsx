
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const NewsSection = () => {
  const { data: news } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_sentiment')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-500';
    if (score < -0.3) return 'text-red-500';
    return 'text-amber-500';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return TrendingUp;
    if (score < -0.3) return TrendingDown;
    return Clock;
  };

  if (!news || news.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Latest Market News</h2>
        <p className="text-slate-400">AI-powered sentiment analysis from trusted Indian financial sources</p>
      </div>

      <div className="space-y-4">
        {news.map((item) => {
          const SentimentIcon = getSentimentIcon(item.sentiment_score || 0);
          
          return (
            <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-white leading-tight">
                        {item.news_headline}
                      </h3>
                      <Badge variant="secondary" className="ml-4 bg-slate-700 text-slate-300">
                        {item.stock_symbol}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span className="font-medium">{item.news_source}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(item.published_at), { addSuffix: true })}</span>
                    </div>
                    
                    {item.sentiment_score && (
                      <div className="flex items-center space-x-2">
                        <SentimentIcon className={`w-4 h-4 ${getSentimentColor(item.sentiment_score)}`} />
                        <span className={`text-sm font-medium ${getSentimentColor(item.sentiment_score)}`}>
                          {getSentimentLabel(item.sentiment_score)} Sentiment
                        </span>
                        <span className="text-xs text-slate-500">
                          ({item.sentiment_score.toFixed(2)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
