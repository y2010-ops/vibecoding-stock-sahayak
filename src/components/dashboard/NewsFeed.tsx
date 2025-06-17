
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function NewsFeed() {
  const news = [
    {
      title: "AStocks Sanurail leadines firm slates expay pril trade",
      source: "Bloomberg",
      sentiment: "Positive",
    },
    {
      title: "News to loinding, Stock Sas on Securities",
      source: "CMBC",
      sentiment: "Negative",
    },
    {
      title: "Sumpec-stocks De latiin olution dieaneads",
      source: "Reuters",
      sentiment: "Neutral",
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Negative": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">News Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h3>
              <Badge className={getSentimentColor(item.sentiment)}>
                {item.sentiment}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.source}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
