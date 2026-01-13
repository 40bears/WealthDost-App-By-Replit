import { MarketNews } from "@/components/dashboard/MarketNews";
import StockPerformance from "@/components/dashboard/StockPerformance";
import { TrendingFeed } from "@/components/dashboard/TrendingFeed";
import { PullToRefresh } from "@/components/common/PullToRefresh";
import { useRef } from "react";
import { getUsername } from "@/lib/user-utils";

const Dashboard = () => {
  const username = getUsername();
  const stockPerformanceRefetch = useRef<(() => void) | null>(null);
  const marketNewsRefetch = useRef<(() => void) | null>(null);
  const trendingFeedRefetch = useRef<(() => void) | null>(null);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

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
    <div className="flex flex-col bg-white min-h-screen relative max-w-md mx-auto">
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div>
          {/* Greeting Section */}
          <div className="px-4 pt-2 pb-0.5 bg-white">
            <h1 className="text-[28px] font-semibold text-gray-900 leading-tight" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {getGreeting()}, {username}
            </h1>
            <p className="text-[15px] text-gray-600 mt-0.5" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Build wealth with clarity, not noise.
            </p>
          </div>

          {/* Market News */}
          <div className="px-4 pt-2 pb-3">
            <MarketNews refetchRef={marketNewsRefetch} />
          </div>

          {/* Stock Performance Ticker */}
          <div className="sticky top-0 z-10">
            <StockPerformance refetchRef={stockPerformanceRefetch} />
          </div>

          {/* Trending Feed */}
          <div className="px-4 pt-3 pb-24">
            <TrendingFeed refetchRef={trendingFeedRefetch} />
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default Dashboard;
