
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function NewsFeed() {
  const news = [
    {
      title: "Apple Stock Surges on Strong iPhone Sales Forecast",
      source: "Bloomberg",
      time: "2 hours ago",
      sentiment: "Positive",
    },
    {
      title: "Tesla Reports Record Q4 Deliveries Despite Market Challenges",
      source: "Reuters",
      time: "4 hours ago",
      sentiment: "Positive",
    },
    {
      title: "Microsoft Cloud Revenue Growth Slows in Latest Quarter",
      source: "CNBC",
      time: "6 hours ago",
      sentiment: "Negative",
    },
    {
      title: "Fed Officials Signal Potential Rate Cuts in 2024",
      source: "Wall Street Journal",
      time: "8 hours ago",
      sentiment: "Neutral",
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Negative": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Latest News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white leading-tight flex-1">
                {item.title}
              </h3>
              <Badge className={`text-xs px-2 py-1 ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{item.source}</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
