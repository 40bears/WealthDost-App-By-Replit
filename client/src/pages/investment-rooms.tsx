import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TribeCard from "@/components/dashboard/TribeCard";
import { useNavigate } from "@tanstack/react-router";
import { useTribes } from "@/hooks/graphql/useTribes";
import type { Tribe } from "@/types";

const InvestmentRooms = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();
  const { data, loading: isLoading, error } = useTribes();
  const tribes = (data as { tribes: Tribe[] })?.tribes || [];

  const mockRooms = [
    {
      id: 1,
      name: "Value Investing Masters",
      createdDate: "March 2024",
      description: "Deep dive into fundamental analysis and long-term value investing strategies. Learn from experienced investors and share your insights.",
      creator: "Rajesh Kumar",
      creatorAvatar: "",
      creatorUsername: "rajesh.kumar",
      category: "Value Investing",
      memberCount: 1250,
      isPremium: false,
      premiumPrice: "0",
      tipsHits: 1250,
      weeklyFeeds: 15,
      badges: ["Expert Verified", "High Activity"],
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Tech Stock Analysis Hub",
      createdDate: "February 2024",
      description: "Analyze tech giants and emerging technology companies. Stay updated with the latest trends in technology investing.",
      creator: "Priya Sharma",
      creatorAvatar: "",
      creatorUsername: "priya.sharma",
      category: "Technology",
      memberCount: 890,
      isPremium: true,
      premiumPrice: "299",
      tipsHits: 890,
      weeklyFeeds: 12,
      badges: ["Trending", "Active Community"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Banking Sector Deep Dive",
      createdDate: "January 2024",
      description: "Comprehensive analysis of banking and financial services sector with expert insights and market analysis.",
      creator: "Vikram Patel",
      creatorAvatar: "",
      creatorUsername: "vikram.patel",
      category: "Banking",
      memberCount: 650,
      isPremium: true,
      premiumPrice: "199",
      tipsHits: 650,
      weeklyFeeds: 10,
      badges: ["Expert Led"],
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop"
    }
  ];

  const fixMinioUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.replace('http://minio:', 'http://localhost:');
  };
  const rooms = tribes.map((tribe) => {
    const creatorName = tribe.user ? `${tribe.user.firstName} ${tribe.user.lastName}`.trim() : "Expert User";
    const creatorUsername = tribe.user?.username || `user${tribe.userId}`;

    return {
      id: tribe.id,
      name: tribe.name,
      createdDate: new Date(tribe.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      description: tribe.description,
      creator: creatorName || "Expert User",
      creatorAvatar: "",
      creatorUsername: creatorUsername,
      category: tribe.category,
      memberCount: tribe.memberCount || 0,
      isPremium: tribe.isPremium,
      premiumPrice: tribe.price || "0",
      tipsHits: tribe.tipsHits || 0,
      weeklyFeeds: tribe.weeklyFeeds || 0,
      badges: tribe.badges || [],
      coverImage: fixMinioUrl(tribe.coverImage?.publicUrl) || mockRooms.find(m => m.category === tribe.category)?.coverImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop"
    };
  });

  const categories = ["all", "Value Investing", "Technology", "Banking", "Healthcare", "Energy"];
  const filterTypes = [
    { value: "all", label: "All Rooms" },
    { value: "free", label: "Free" },
    { value: "premium", label: "Premium" },
    { value: "sponsored", label: "Sponsored" }
  ];

  const filteredRooms = rooms.filter(room => {
    const categoryMatch = filterCategory === "all" || room.category === filterCategory;
    const typeMatch = filterType === "all" ||
      (filterType === "free" && !room.isPremium) ||
      (filterType === "premium" && room.isPremium);
    return categoryMatch && typeMatch;
  });

  const handleJoinClick = (roomId: number) => {
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tribes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tribes</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 text-sm bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 rounded-xl">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="sponsored">Sponsored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9 text-sm bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Value Investing">Value Investing</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-4">
        {filteredRooms.map((room) => (
          <TribeCard
            key={room.id}
            name={room.name}
            createdDate={room.createdDate}
            description={room.description}
            creatorName={room.creator}
            creatorUsername={room.creatorUsername}
            creatorAvatar={room.creatorAvatar}
            memberCount={room.memberCount}
            tipsHits={room.tipsHits}
            weeklyFeeds={room.weeklyFeeds}
            badges={room.badges}
            isPremium={room.isPremium}
            premiumPrice={room.premiumPrice}
            coverImage={room.coverImage}
            onJoinClick={() => handleJoinClick(room.id)}
            onCardClick={() => navigate({ to: `/tribe/${room.id}` })}
          />
        ))}
        
        {filteredRooms.length === 0 && (
          <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-8">
            <span className="material-icons text-4xl text-gray-300 mb-2">meeting_room</span>
            <p className="text-gray-600">No rooms found for selected filters</p>
            <Button variant="outline" size="sm" className="mt-3 border-2 hover:border-gray-300 hover:shadow-md hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 active:scale-95" onClick={() => {
              setFilterCategory("all");
              setFilterType("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default InvestmentRooms;