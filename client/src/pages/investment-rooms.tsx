import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TribeCard from "@/components/dashboard/TribeCard";
import { useNavigate } from "@tanstack/react-router";

const InvestmentRooms = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all"); // all, free, premium, sponsored
  const navigate = useNavigate();

  // Mock data - would be fetched from API
  const rooms = [
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
    console.log("Join clicked for room:", roomId);
    // Add join logic here
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Dropdown Filters */}
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

      {/* Rooms List */}
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

      {/* Bottom padding for safe area */}
      <div className="h-20"></div>
    </div>
  );
};

export default InvestmentRooms;