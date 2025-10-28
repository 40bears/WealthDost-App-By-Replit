import { useState } from "react";
import { Button } from "@/components/ui/button";
import ExpertCard from "@/components/dashboard/ExpertCard";
import ExpertFilters from "@/components/dashboard/ExpertFilters";
import { useNavigate } from "@tanstack/react-router";

const ExpertsList = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedExpertType, setSelectedExpertType] = useState("all");
  const [followedExperts, setFollowedExperts] = useState<number[]>([3]); // Initialize with expert id 3 as followed

  const expertsData = [
    {
      id: 1,
      name: "Rajesh Kumar",
      username: "@rajesh_k",
      sector: "financial",
      expertType: "broker",
      avgReturn: "+20% returns",
      categories: ["Finance", "Banking"],
      bio: "Tech Analyst | Sebi registered | Tech Analyst | Sebi registered | Tech Analyst | Sebi registered"
    },
    {
      id: 2,
      name: "Priya Sharma",
      username: "@priya_s",
      sector: "energy",
      expertType: "individual",
      avgReturn: "+40% returns",
      categories: ["Energy", "Renewables"],
      bio: "Energy sector expert with 10+ years experience in renewable energy investments and market analysis"
    },
    {
      id: 3,
      name: "Vikram Patel",
      username: "@vikram_p",
      sector: "financial",
      expertType: "broker",
      avgReturn: "+21% returns",
      categories: ["Finance", "Stocks"],
      bio: "SEBI registered investment advisor specializing in equity research and portfolio management"
    },
    {
      id: 4,
      name: "Anita Desai",
      username: "@anita_tech",
      sector: "technology",
      expertType: "corporate",
      avgReturn: "+29% returns",
      categories: ["Technology", "AI"],
      bio: "Corporate insider and technology analyst focusing on AI, cloud computing, and semiconductor sectors"
    },
    {
      id: 5,
      name: "Arjun Singh",
      username: "@arjun_trades",
      sector: "technology",
      expertType: "broker",
      avgReturn: "+31% returns",
      categories: ["Technology", "Growth Stocks"],
      bio: "Growth stock specialist with expertise in technology sector analysis and momentum trading strategies"
    },
    {
      id: 6,
      name: "Meera Jain",
      username: "@meera_invest",
      sector: "financial",
      expertType: "individual",
      avgReturn: "+29% returns",
      categories: ["Finance", "Value Investing"],
      bio: "Value investor following Warren Buffett's principles with focus on undervalued financial sector stocks"
    },
    {
      id: 7,
      name: "Rohit Gupta",
      username: "@rohit_industrial",
      sector: "industrials",
      expertType: "broker",
      avgReturn: "+25% returns",
      categories: ["Industrials", "Manufacturing"],
      bio: "Industrial sector analyst covering manufacturing, infrastructure, and capital goods companies"
    },
    {
      id: 8,
      name: "Kavya Reddy",
      username: "@kavya_finance",
      sector: "financial",
      expertType: "individual",
      avgReturn: "+24% returns",
      categories: ["Finance", "Banking"],
      bio: "Banking and financial services analyst with focus on PSU banks and NBFC sector opportunities"
    }
  ];

  const filteredExperts = expertsData.filter(expert => {
    const sectorMatch = selectedSector === "all" || expert.sector === selectedSector;
    const typeMatch = selectedExpertType === "all" || expert.expertType === selectedExpertType;
    return sectorMatch && typeMatch;
  });

  const navigate = useNavigate();

  const handleFollowClick = (expertId: number) => {
    setFollowedExperts(prev => {
      if (prev.includes(expertId)) {
        // Unfollow: remove from array
        return prev.filter(id => id !== expertId);
      } else {
        // Follow: add to array
        return [...prev, expertId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      {/* Filters */}
      <ExpertFilters
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        selectedExpertType={selectedExpertType}
        onExpertTypeChange={setSelectedExpertType}
      />

      {/* Experts List */}
      <div className="px-4 pt-4 space-y-3 pb-20">
        {filteredExperts.map((expert) => (
          <ExpertCard
            key={expert.id}
            name={expert.name}
            username={expert.username}
            avgReturn={expert.avgReturn}
            categories={expert.categories}
            bio={expert.bio}
            isFollowing={followedExperts.includes(expert.id)}
            onFollowClick={() => handleFollowClick(expert.id)}
            onCardClick={() => navigate({ to: `/expert/${expert.id}` })}
          />
        ))}

        {filteredExperts.length === 0 && (
          <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
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