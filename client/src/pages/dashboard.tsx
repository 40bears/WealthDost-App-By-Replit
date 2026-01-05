import { MarketNews } from "@/components/dashboard/MarketNews";
import StockPerformance from "@/components/dashboard/StockPerformance";
import { TrendingFeed } from "@/components/dashboard/TrendingFeed";
import { PullToRefresh } from "@/components/common/PullToRefresh";
import { useRef } from "react";

const Dashboard = () => {
  const stockPerformanceRefetch = useRef<(() => void) | null>(null);
  const marketNewsRefetch = useRef<(() => void) | null>(null);
  const trendingFeedRefetch = useRef<(() => void) | null>(null);

  const handleRefresh = async () => {
    // Trigger refetch for all components
    const promises: Promise<any>[] = [];

    if (stockPerformanceRefetch.current) {
      promises.push(Promise.resolve(stockPerformanceRefetch.current()));
    }
    if (marketNewsRefetch.current) {
      promises.push(Promise.resolve(marketNewsRefetch.current()));
    }
    if (trendingFeedRefetch.current) {
      promises.push(Promise.resolve(trendingFeedRefetch.current()));
    }

    await Promise.all(promises);
    // Add a small delay to ensure refresh completes
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  return (
    <div className="flex flex-col bg-[#F9FAFB] min-h-screen relative max-w-md mx-auto">
      {/* Stock Performance Ticker - Fixed at top */}
      <div className="sticky top-0 z-10">
        <StockPerformance refetchRef={stockPerformanceRefetch} />
      </div>

      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div>
          {/* Market News */}
          <div className="px-4 py-6">
            <MarketNews refetchRef={marketNewsRefetch} />
          </div>

          {/* Trending Feed */}
          <div className="px-4 py-6 pb-24">
            <TrendingFeed refetchRef={trendingFeedRefetch} />
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default Dashboard;
