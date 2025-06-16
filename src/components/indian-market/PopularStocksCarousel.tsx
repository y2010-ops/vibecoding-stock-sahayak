
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const PopularStocksCarousel = () => {
  const { data: stocks } = useQuery({
    queryKey: ['popular-stocks'],
    queryFn: () => {
      // Mock data for popular Indian stocks
      return [
        {
          symbol: "RELIANCE",
          name: "Reliance Industries",
          price: 2485.50,
          change: 45.20,
          changePercent: 1.85,
          marketCap: "16.78 L Cr",
          volume: "1.24 Cr",
          sector: "Oil & Gas"
        },
        {
          symbol: "TCS",
          name: "Tata Consultancy Services",
          price: 3567.80,
          change: -23.15,
          changePercent: -0.64,
          marketCap: "13.45 L Cr",
          volume: "0.89 Cr",
          sector: "IT Services"
        },
        {
          symbol: "HDFCBANK",
          name: "HDFC Bank",
          price: 1634.25,
          change: 12.85,
          changePercent: 0.79,
          marketCap: "12.56 L Cr",
          volume: "2.14 Cr",
          sector: "Banking"
        },
        {
          symbol: "INFY",
          name: "Infosys",
          price: 1456.70,
          change: -8.30,
          changePercent: -0.57,
          marketCap: "6.12 L Cr",
          volume: "1.67 Cr",
          sector: "IT Services"
        },
        {
          symbol: "ITC",
          name: "ITC Limited",
          price: 412.90,
          change: 3.45,
          changePercent: 0.84,
          marketCap: "5.23 L Cr",
          volume: "3.45 Cr",
          sector: "FMCG"
        }
      ];
    },
  });

  const formatIndianPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!stocks) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Popular Indian Stocks</h2>
        <p className="text-muted-foreground">Live prices from NSE & BSE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stocks.map((stock) => (
          <Card key={stock.symbol} className="bg-card/50 border-border hover:border-orange-500 transition-colors cursor-pointer backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {stock.sector}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-foreground">
                  {formatIndianPrice(stock.price)}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>
                    {stock.change >= 0 ? '+' : ''}
                    {formatIndianPrice(stock.change)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Market Cap:</span>
                  <span>{stock.marketCap}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span>{stock.volume}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
