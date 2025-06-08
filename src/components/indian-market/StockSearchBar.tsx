
import { useState } from "react";
import { Search, Filter, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIStockAnalysis } from "@/components/ai/AIStockAnalysis";
import { AIRecommendationCard } from "@/components/ai/AIRecommendationCard";

export const StockSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  
  const popularStocks = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC", "SBIN", "BHARTIARTL", "LT"
  ];
  
  const sectors = [
    "IT Services", "Banking", "FMCG", "Pharmaceuticals", "Auto", "Oil & Gas", "Telecom"
  ];

  const handleStockClick = (stock: string) => {
    setSearchQuery(stock);
    setShowAIAnalysis(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowAIAnalysis(true);
    }
  };

  // Mock stock data - in real app, this would come from an API
  const getStockData = (symbol: string) => {
    const stockData = {
      'RELIANCE': { name: 'Reliance Industries Ltd', price: 2485.50, exchange: 'NSE' },
      'TCS': { name: 'Tata Consultancy Services', price: 3567.20, exchange: 'NSE' },
      'HDFCBANK': { name: 'HDFC Bank Ltd', price: 1634.75, exchange: 'NSE' },
      'INFY': { name: 'Infosys Ltd', price: 1456.30, exchange: 'NSE' },
      'ITC': { name: 'ITC Ltd', price: 456.80, exchange: 'NSE' },
    };
    return stockData[symbol as keyof typeof stockData] || { 
      name: `${symbol} Company`, 
      price: 1000, 
      exchange: 'NSE' 
    };
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Search stocks by name, symbol, or ISIN (e.g., RELIANCE, TCS, HDFCBANK)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-12 pr-32 py-4 text-lg bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button
            size="sm"
            onClick={handleSearch}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Analyze
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Popular Stocks</h3>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <Badge
                key={stock}
                variant="secondary"
                className="cursor-pointer hover:bg-orange-600 hover:text-white transition-colors bg-slate-700 text-slate-300"
                onClick={() => handleStockClick(stock)}
              >
                {stock}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Sectors</h3>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <Badge
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                onClick={() => setSelectedSector(selectedSector === sector ? "" : sector)}
              >
                {sector}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {showAIAnalysis && searchQuery && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  AI Analysis for: <span className="text-orange-500">{searchQuery}</span>
                </h3>
                <p className="text-sm text-slate-400">
                  Comprehensive AI-powered stock analysis with technical, fundamental, and sentiment insights
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIAnalysis(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIStockAnalysis
                stockSymbol={searchQuery}
                exchange={getStockData(searchQuery).exchange}
                companyName={getStockData(searchQuery).name}
              />
            </div>
            <div>
              <AIRecommendationCard
                stockSymbol={searchQuery}
                exchange={getStockData(searchQuery).exchange}
                companyName={getStockData(searchQuery).name}
                currentPrice={getStockData(searchQuery).price}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
