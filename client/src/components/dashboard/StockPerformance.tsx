import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useEffect, MutableRefObject } from "react";

interface StockPerformanceProps {
  refetchRef?: MutableRefObject<(() => void) | null>;
}

const StockPerformance = ({ refetchRef }: StockPerformanceProps) => {
  // Fetch trending stocks from API
  const { data: trendingData, isLoading, refetch } = useQuery({
    queryKey: ['trending-stocks'],
    queryFn: async () => {
      const response = await apiClient.market.stocks.trending.$get();
      return response;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Expose refetch function to parent
  useEffect(() => {
    if (refetchRef) {
      refetchRef.current = refetch;
    }
  }, [refetch, refetchRef]);

  // Fallback stocks for loading or error states
  const fallbackStocks = [
    { name: "Tata Power", price: 310, change: 11 },
    { name: "Reliance", price: 2845, change: 2.3 },
    { name: "HDFC Bank", price: 1650, change: -0.8 },
    { name: "Infosys", price: 1420, change: 3.5 },
  ];

  // Map API data to display format
  const stocks = trendingData?.stocks?.map(stock => ({
    name: stock.name,
    price: stock.currentPrice,
    change: stock.changePercent,
  })) || fallbackStocks;

  if (isLoading) {
    return (
      <div className="w-full h-[30px] bg-[#E7E5E4] flex items-center justify-center">
        <span className="text-sm text-gray-600">Loading market data...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[30px] bg-[#E7E5E4] overflow-hidden relative">
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {/* Duplicate the stocks array for seamless loop */}
        {[...stocks, ...stocks].map((stock, index) => (
          <div key={index} className="inline-flex items-center mx-6">
            <span className="text-sm text-gray-800">{stock.name}</span>
            <span className="text-sm font-semibold text-gray-900 mx-2">₹{stock.price.toFixed(2)}</span>
            <span
              className="text-sm font-medium"
              style={{ color: stock.change >= 0 ? '#16803C' : '#DC2626' }}
            >
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default StockPerformance;
