import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

const ExpertsList = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedExpertType, setSelectedExpertType] = useState("all");

  const sectors = [
    { value: "all", label: "All Sectors" },
    { value: "financial", label: "Financial" },
    { value: "technology", label: "Technology" },
    { value: "energy", label: "Energy" },
    { value: "healthcare", label: "Healthcare" },
    { value: "industrials", label: "Industrials" },
    { value: "consumer", label: "Consumer Goods" },
    { value: "materials", label: "Materials" },
    { value: "utilities", label: "Utilities" }
  ];

  const expertTypes = [
    { value: "all", label: "All Types" },
    { value: "individual", label: "Individual" },
    { value: "broker", label: "Broker Firms" },
    { value: "corporate", label: "Corporate Insider" }
  ];

  const expertsData = [
    {
      id: 1,
      name: "Rajesh Kumar",
      researchFirm: "Berenberg Bank",
      sector: "financial",
      expertType: "broker",
      rating: 5,
      distribution: { buy: 60, hold: 30, sell: 10 },
      successRate: 86,
      avgReturn: "+20.20%",
      followers: 9692,
      isFollowing: false
    },
    {
      id: 2,
      name: "Priya Sharma",
      researchFirm: "Raymond James",
      sector: "energy",
      expertType: "individual",
      rating: 5,
      distribution: { buy: 55, hold: 35, sell: 10 },
      successRate: 82,
      avgReturn: "+40.30%",
      followers: 14627,
      isFollowing: false
    },
    {
      id: 3,
      name: "Vikram Patel",
      researchFirm: "Truist Financial",
      sector: "financial",
      expertType: "broker",
      rating: 4,
      distribution: { buy: 72, hold: 23, sell: 5 },
      successRate: 78,
      avgReturn: "+21.00%",
      followers: 10968,
      isFollowing: true
    },
    {
      id: 4,
      name: "Anita Desai",
      researchFirm: "Tech Insider",
      sector: "technology",
      expertType: "corporate",
      rating: 5,
      distribution: { buy: 48, hold: 42, sell: 10 },
      successRate: 74,
      avgReturn: "+29.20%",
      followers: 11498,
      isFollowing: false
    },
    {
      id: 5,
      name: "Arjun Singh",
      researchFirm: "UBS",
      sector: "technology",
      expertType: "broker",
      rating: 5,
      distribution: { buy: 59, hold: 31, sell: 10 },
      successRate: 79,
      avgReturn: "+31.00%",
      followers: 23972,
      isFollowing: false
    },
    {
      id: 6,
      name: "Meera Jain",
      researchFirm: "Citizens JMP",
      sector: "financial",
      expertType: "individual",
      rating: 4,
      distribution: { buy: 70, hold: 25, sell: 5 },
      successRate: 69,
      avgReturn: "+29.20%",
      followers: 4603,
      isFollowing: false
    },
    {
      id: 7,
      name: "Rohit Gupta",
      researchFirm: "Citi",
      sector: "industrials",
      expertType: "broker",
      rating: 4,
      distribution: { buy: 74, hold: 20, sell: 6 },
      successRate: 71,
      avgReturn: "+25.60%",
      followers: 2048,
      isFollowing: false
    },
    {
      id: 8,
      name: "Kavya Reddy",
      researchFirm: "Oppenheimer",
      sector: "financial",
      expertType: "individual",
      rating: 4,
      distribution: { buy: 61, hold: 33, sell: 6 },
      successRate: 71,
      avgReturn: "+24.50%",
      followers: 8005,
      isFollowing: false
    }
  ];

  const filteredExperts = expertsData.filter(expert => {
    const sectorMatch = selectedSector === "all" || expert.sector === selectedSector;
    const typeMatch = selectedExpertType === "all" || expert.expertType === selectedExpertType;
    return sectorMatch && typeMatch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`material-icons text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        star
      </span>
    ));
  };

  const renderDistributionBar = (distribution: { buy: number; hold: number; sell: number }) => {
    return (
      <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-100">
        <div 
          className="bg-green-500" 
          style={{ width: `${distribution.buy}%` }}
        ></div>
        <div 
          className="bg-gray-400" 
          style={{ width: `${distribution.hold}%` }}
        ></div>
        <div 
          className="bg-red-500" 
          style={{ width: `${distribution.sell}%` }}
        ></div>
      </div>
    );
  };

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      financial: "bg-blue-100/70 text-blue-800 border-blue-200 hover:border-blue-300 hover:shadow-blue-500/20",
      technology: "bg-purple-100/70 text-purple-800 border-purple-200 hover:border-purple-300 hover:shadow-purple-500/20",
      energy: "bg-orange-100/70 text-orange-800 border-orange-200 hover:border-orange-300 hover:shadow-orange-500/20",
      healthcare: "bg-green-100/70 text-green-800 border-green-200 hover:border-green-300 hover:shadow-green-500/20",
      industrials: "bg-gray-100/70 text-gray-800 border-gray-200 hover:border-gray-300 hover:shadow-gray-500/20",
      consumer: "bg-pink-100/70 text-pink-800 border-pink-200 hover:border-pink-300 hover:shadow-pink-500/20"
    };
    return colors[sector] || "bg-gray-100/70 text-gray-800 border-gray-200 hover:border-gray-300 hover:shadow-gray-500/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600 border-2 border-transparent hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl">
                <span className="material-icons text-lg">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-base font-medium">Experts ({filteredExperts.length})</h1>
            <div></div>
          </div>
          
          {/* Simplified Filters */}
          <div className="flex gap-2">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="h-8 text-xs bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedExpertType} onValueChange={setSelectedExpertType}>
              <SelectTrigger className="h-8 text-xs bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {expertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Experts List */}
      <div className="max-w-md mx-auto">
        {filteredExperts.map((expert, index) => (
          <div key={expert.id} className="mx-4 mb-3 bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-3">
              {/* Rank and Avatar */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 w-4">{index + 1}</span>
                <Avatar className="h-8 w-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                  <AvatarFallback className="bg-purple-100/70 backdrop-blur-sm text-purple-600 text-xs font-medium">
                    {expert.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm truncate">{expert.name}</h3>
                      <div className="flex">
                        {renderStars(expert.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{expert.researchFirm}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge className={`text-xs px-1.5 py-0.5 border-2 hover:shadow-sm transition-all duration-300 ${getSectorColor(expert.sector)}`}>
                        {expert.sector.charAt(0).toUpperCase() + expert.sector.slice(1)}
                      </Badge>
                      <span className="text-xs text-purple-600 font-medium">
                        {expert.avgReturn} returns
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/expert/${expert.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-6 border-2 border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50/70 hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg backdrop-blur-sm"
                    >
                      View
                    </Button>
                  </Link>
                </div>

                {/* Success Rate Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Success Rate: {expert.successRate}%</span>
                    <span>{expert.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-gray-100/70 backdrop-blur-sm border border-gray-200">
                    <div 
                      className="bg-green-500/90 backdrop-blur-sm shadow-sm" 
                      style={{ width: `${expert.successRate}%` }}
                      title={`Success Rate: ${expert.successRate}%`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredExperts.length === 0 && (
          <div className="mx-4 bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
            <span className="material-icons text-3xl text-gray-300 mb-2">person_search</span>
            <p className="text-gray-500 text-sm">No experts found</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-xs border-2 border-transparent hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg"
              onClick={() => {
                setSelectedSector("all");
                setSelectedExpertType("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-20"></div>
    </div>
  );
};

export default ExpertsList;