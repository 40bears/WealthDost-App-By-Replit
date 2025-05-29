import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

const InvestmentRooms = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all"); // all, free, premium, sponsored

  // Mock data - would be fetched from API
  const rooms = [
    {
      id: 1,
      name: "Value Investing Masters",
      description: "Deep dive into fundamental analysis and long-term value investing strategies",
      creator: "Rajesh Kumar",
      creatorAvatar: "RK",
      category: "Value Investing",
      memberCount: 1250,
      isPremium: true,
      premiumPrice: "299",
      isSponsored: false,
      sponsorName: null,
      xpReward: 50,
      badges: ["Expert Verified", "High Activity"]
    },
    {
      id: 2,
      name: "Tech Stock Analysis Hub",
      description: "Analyze tech giants and emerging technology companies",
      creator: "Priya Sharma",
      creatorAvatar: "PS",
      category: "Technology",
      memberCount: 890,
      isPremium: false,
      premiumPrice: null,
      isSponsored: true,
      sponsorName: "TechVest Pro",
      xpReward: 30,
      badges: ["Trending", "Active Community"]
    },
    {
      id: 3,
      name: "Banking Sector Deep Dive",
      description: "Comprehensive analysis of banking and financial services",
      creator: "Vikram Patel",
      creatorAvatar: "VP",
      category: "Banking",
      memberCount: 650,
      isPremium: true,
      premiumPrice: "199",
      isSponsored: false,
      sponsorName: null,
      xpReward: 40,
      badges: ["Expert Led"]
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
      (filterType === "free" && !room.isPremium && !room.isSponsored) ||
      (filterType === "premium" && room.isPremium) ||
      (filterType === "sponsored" && room.isSponsored);
    return categoryMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <span className="material-icons text-lg">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Investment Rooms</h1>
            <Button variant="ghost" size="sm" className="p-1 text-purple-600">
              <span className="material-icons text-lg">add</span>
            </Button>
          </div>
          
          {/* Filters */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-xs whitespace-nowrap"
                  onClick={() => setFilterCategory(category)}
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {filterTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={filterType === type.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => setFilterType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Room Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{room.name}</h3>
                    {room.isSponsored && (
                      <Badge className="text-xs bg-orange-100 text-orange-700">
                        Sponsored by {room.sponsorName}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{room.description}</p>
                  
                  {/* Creator Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                        {room.creatorAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">by {room.creator}</span>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className="material-icons text-sm mr-1">group</span>
                      {room.memberCount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <span className="material-icons text-sm mr-1">stars</span>
                      +{room.xpReward} XP
                    </span>
                  </div>
                </div>
                
                {/* Premium Price */}
                {room.isPremium && (
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-purple-600">₹{room.premiumPrice}</div>
                    <div className="text-xs text-gray-500">/month</div>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {room.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              {/* Action Button */}
              <Link href={`/room/${room.id}`}>
                <Button 
                  className={`w-full text-sm ${room.isPremium ? 'bg-purple-600 text-white' : 'bg-gray-900 text-white'}`}
                  size="sm"
                >
                  {room.isPremium ? `Subscribe for ₹${room.premiumPrice}/mo` : "Join Room"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-300 mb-2">meeting_room</span>
            <p className="text-gray-600">No rooms found for selected filters</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => {
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