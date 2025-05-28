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
      financial: "bg-blue-100 text-blue-800",
      technology: "bg-purple-100 text-purple-800",
      energy: "bg-orange-100 text-orange-800",
      healthcare: "bg-green-100 text-green-800",
      industrials: "bg-gray-100 text-gray-800",
      consumer: "bg-pink-100 text-pink-800"
    };
    return colors[sector] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mr-3 p-1">
                <span className="material-icons">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Financial Experts</h1>
          </div>
          
          {/* Filters */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Sector Guru</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Expert Type</label>
                <Select value={selectedExpertType} onValueChange={setSelectedExpertType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select type" />
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
            
            <div className="text-xs text-gray-500">
              Showing {filteredExperts.length} experts
            </div>
          </div>
        </div>
      </div>

      {/* Experts List */}
      <div className="max-w-md mx-auto p-4 space-y-3">
        {filteredExperts.map((expert, index) => (
          <Card key={expert.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Rank Number */}
                <div className="flex-shrink-0 w-6 text-center">
                  <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                </div>

                {/* Avatar and Basic Info */}
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">
                      {expert.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-center mt-1">
                    {renderStars(expert.rating)}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm truncate">{expert.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{expert.researchFirm}</p>
                      <Badge className={`text-xs mt-1 ${getSectorColor(expert.sector)}`}>
                        {expert.sector.charAt(0).toUpperCase() + expert.sector.slice(1)}
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={expert.isFollowing ? "secondary" : "default"}
                      className="text-xs px-3 py-1 bg-purple-600 text-white"
                    >
                      {expert.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>

                  {/* Distribution Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Buy {expert.distribution.buy}%</span>
                      <span>Hold {expert.distribution.hold}%</span>
                      <span>Sell {expert.distribution.sell}%</span>
                    </div>
                    {renderDistributionBar(expert.distribution)}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-semibold text-green-600">{expert.successRate}%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-600">{expert.avgReturn}</div>
                      <div className="text-xs text-gray-500">Avg Return</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-700">{expert.followers.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  </div>

                  {/* View Profile Link */}
                  <Link href={`/expert/${expert.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExperts.length === 0 && (
          <div className="text-center py-8">
            <span className="material-icons text-4xl text-gray-400 mb-2">search_off</span>
            <p className="text-gray-600">No experts found for the selected filters</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => {
                setSelectedSector("all");
                setSelectedExpertType("all");
              }}
            >
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

export default ExpertsList;