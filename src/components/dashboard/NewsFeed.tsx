
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

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Negative": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">News Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm text-slate-900 dark:text-white leading-tight flex-1">
                {item.title}
              </h3>
              <Badge className={`text-xs px-2 py-1 ${getSentimentStyle(item.sentiment)}`}>
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
