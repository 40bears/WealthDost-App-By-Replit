import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MarketOverview from "@/components/dashboard/MarketOverview";
import FeatureNavigation from "@/components/dashboard/FeatureNavigation";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ContentFeed from "@/components/dashboard/ContentFeed";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Fetch feed posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
  });

  return (
    <div className="flex flex-col h-full relative">
      {/* Top App Bar */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">WealthDost</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <span className="material-icons">notifications_none</span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200">
              <span className="material-icons text-gray-500">person</span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-auto pb-16">
        {/* Quick Nav Tabs */}
        <FeatureNavigation />

        {/* Welcome Card */}
        <WelcomeCard />

        {/* Markets Overview */}
        <MarketOverview data={marketData} isLoading={isLoadingMarketData} />

        {/* Content Feed */}
        <ContentFeed posts={posts} isLoading={isLoadingPosts} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;
