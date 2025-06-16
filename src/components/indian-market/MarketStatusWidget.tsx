
import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

export const MarketStatusWidget = () => {
  const { data: marketStatus } = useQuery({
    queryKey: ['market-status'],
    queryFn: () => {
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);
      
      const [hours, minutes] = istTime.split(':').map(Number);
      const currentTimeMinutes = hours * 60 + minutes;
      const preMarketStart = 9 * 60; // 9:00 AM
      const marketOpen = 9 * 60 + 15; // 9:15 AM
      const marketClose = 15 * 60 + 30; // 3:30 PM
      const postMarketEnd = 16 * 60; // 4:00 PM
      
      let status = 'CLOSED';
      let nextEvent = 'Market opens at 9:15 AM IST';
      
      if (currentTimeMinutes >= preMarketStart && currentTimeMinutes < marketOpen) {
        status = 'PRE_MARKET';
        nextEvent = 'Market opens in ' + (marketOpen - currentTimeMinutes) + ' minutes';
      } else if (currentTimeMinutes >= marketOpen && currentTimeMinutes < marketClose) {
        status = 'OPEN';
        nextEvent = 'Market closes in ' + Math.floor((marketClose - currentTimeMinutes) / 60) + 'h ' + ((marketClose - currentTimeMinutes) % 60) + 'm';
      } else if (currentTimeMinutes >= marketClose && currentTimeMinutes < postMarketEnd) {
        status = 'POST_MARKET';
        nextEvent = 'Post-market ends in ' + (postMarketEnd - currentTimeMinutes) + ' minutes';
      }
      
      return {
        status,
        nextEvent,
        istTime,
        indices: {
          nifty: { value: 21750.10, change: +127.45, changePercent: +0.59 },
          sensex: { value: 72240.26, change: +453.32, changePercent: +0.63 }
        }
      };
    },
    refetchInterval: 60000, // Update every minute
  });

  if (!marketStatus) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-green-500';
      case 'PRE_MARKET': return 'text-amber-500';
      case 'POST_MARKET': return 'text-blue-500';
      default: return 'text-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'MARKET OPEN';
      case 'PRE_MARKET': return 'PRE-MARKET';
      case 'POST_MARKET': return 'POST-MARKET';
      default: return 'MARKET CLOSED';
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-card/50 px-4 py-2 rounded-lg border border-border backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{marketStatus.istTime} IST</span>
      </div>
      
      <div className={`text-sm font-semibold ${getStatusColor(marketStatus.status)}`}>
        {getStatusText(marketStatus.status)}
      </div>
      
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">NIFTY</span>
          <span className="text-foreground font-medium">₹{marketStatus.indices.nifty.value.toLocaleString('en-IN')}</span>
          <div className={`flex items-center ${marketStatus.indices.nifty.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {marketStatus.indices.nifty.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="ml-1">
              {marketStatus.indices.nifty.change >= 0 ? '+' : ''}
              {marketStatus.indices.nifty.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">SENSEX</span>
          <span className="text-foreground font-medium">₹{marketStatus.indices.sensex.value.toLocaleString('en-IN')}</span>
          <div className={`flex items-center ${marketStatus.indices.sensex.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {marketStatus.indices.sensex.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="ml-1">
              {marketStatus.indices.sensex.change >= 0 ? '+' : ''}
              {marketStatus.indices.sensex.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
