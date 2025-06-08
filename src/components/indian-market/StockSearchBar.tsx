
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const StockSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  
  const popularStocks = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ITC", "SBIN", "BHARTIARTL", "LT"
  ];
  
  const sectors = [
    "IT Services", "Banking", "FMCG", "Pharmaceuticals", "Auto", "Oil & Gas", "Telecom"
  ];

  const handleStockClick = (stock: string) => {
    setSearchQuery(stock);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder="Search stocks by name, symbol, or ISIN (e.g., RELIANCE, TCS, HDFCBANK)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-20 py-4 text-lg bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500"
        />
        <Button
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
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

      {searchQuery && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-300">
            Searching for: <span className="text-orange-500 font-semibold">{searchQuery}</span>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            AI analysis will be displayed here with technical, fundamental, and sentiment insights.
          </p>
        </div>
      )}
    </div>
  );
};
