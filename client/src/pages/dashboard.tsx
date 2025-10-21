import { MarketNews } from "@/components/dashboard/MarketNews";
import StockPerformance from "@/components/dashboard/StockPerformance";
import { TrendingFeed } from "@/components/dashboard/TrendingFeed";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {

  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Fetch feed posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
  });

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

      {/* Floating Action Button */}
      <div className="fixed bottom-[130px] right-0 left-0 max-w-md mx-auto pointer-events-none z-40">
        <Button
          className="absolute right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 pointer-events-auto"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
