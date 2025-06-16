
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Newspaper, Brain, PieChart, Calendar } from "lucide-react";

export const FeatureCards = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Technical Analysis",
      description: "Advanced charting with Indian market indicators, support/resistance levels, and volume analysis",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Fundamental Analysis",
      description: "Quarterly results, annual reports, P/E ratios, and comparison with sector averages",
      color: "text-blue-500"
    },
    {
      icon: Newspaper,
      title: "News Sentiment",
      description: "Real-time sentiment analysis from Economic Times, Moneycontrol, and other trusted sources",
      color: "text-purple-500"
    },
    {
      icon: Brain,
      title: "AI Recommendations",
      description: "Smart investment suggestions based on technical, fundamental, and sentiment analysis",
      color: "text-orange-500"
    },
    {
      icon: PieChart,
      title: "Sectoral Analysis",
      description: "Deep dive into IT, Banking, Pharma, FMCG, Auto, and other key Indian sectors",
      color: "text-amber-500"
    },
    {
      icon: Calendar,
      title: "Corporate Actions",
      description: "Track dividends, bonus issues, stock splits, and other corporate announcements",
      color: "text-cyan-500"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Comprehensive Market Analysis</h2>
        <p className="text-muted-foreground">Everything you need to make informed investment decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card/50 border-border hover:border-primary/50 transition-colors backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
