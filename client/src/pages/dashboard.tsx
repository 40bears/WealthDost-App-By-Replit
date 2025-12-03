import { MarketNews } from "@/components/dashboard/MarketNews";
import StockPerformance from "@/components/dashboard/StockPerformance";
import { TrendingFeed } from "@/components/dashboard/TrendingFeed";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { usePosts } from "@/hooks/graphql";
import { useEffect } from "react";

const Dashboard = () => {
  const auth = useAuth();

  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Fetch feed posts
  const { data: postsData, loading: isLoadingPosts } = usePosts();
  const posts = (postsData as { posts: any[] })?.posts || [];

  return (
    <div className="flex flex-col bg-[#F9FAFB] min-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative max-w-md mx-auto">
      {/* Stock Performance Ticker */}
      <StockPerformance />
      
      {/* Market News */}
      <div className="px-4 py-6">
        <MarketNews />
      </div>
      
      {/* Trending Feed */}
      <div className="px-4 py-6 pb-24">
        <TrendingFeed />
      </div>

    </div>
  );
};

export default Dashboard;
