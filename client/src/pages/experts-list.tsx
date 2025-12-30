import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExpertCard from "@/components/dashboard/ExpertCard";
import { useNavigate } from "@tanstack/react-router";
import { useExperts } from "@/hooks/graphql";
import { Loader2 } from "lucide-react";
import { PullToRefresh } from "@/components/common/PullToRefresh";

const expertSpecializations = [
  { value: "all", label: "All" },
  { value: "Stock Market & Equity Research", label: "Stock Market & Equity Research" },
  { value: "Crypto & Web3", label: "Crypto & Web3" },
  { value: "Private Equity & Venture Capital", label: "Private Equity & Venture Capital" },
  { value: "Macroeconomics & Global Markets", label: "Macroeconomics & Global Markets" },
  { value: "Wealth Planning & Financial Advisory", label: "Wealth Planning & Financial Advisory" },
  { value: "Real Estate & Alternative Investments", label: "Real Estate & Alternative Investments" },
];

const ExpertsList = () => {
  const [selectedSector, setSelectedSector] = useState("all");

  const { data, loading, error, refetch } = useExperts(selectedSector);
  const experts = data?.experts || [];

  const navigate = useNavigate();

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100 flex flex-col">
      {/* Filter Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="px-4 py-3">
          <div className="flex gap-2">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="h-8 text-xs bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {expertSpecializations.map((specialization) => (
                  <SelectItem key={specialization.value} value={specialization.value}>
                    {specialization.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content with Pull to Refresh */}
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1 min-h-0"
      >
        <div>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-4 pt-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl text-center py-12">
                <span className="material-icons text-3xl text-red-300 mb-2">error_outline</span>
                <p className="text-red-600 text-sm">Failed to load experts</p>
                <p className="text-red-500 text-xs mt-1">{error.message}</p>
              </div>
            </div>
          )}

          {/* Experts List */}
          {!loading && !error && (
            <div className="px-4 pt-4 space-y-3 pb-20">
          {experts.map((expert) => {
            // Parse industry sectors from comma-separated string
            const industrySectors = expert.profile?.industrySectors
              ? expert.profile.industrySectors.split(',').map(s => s.trim()).filter(Boolean)
              : [];

            return (
              <ExpertCard
                key={expert.id}
                name={`${expert.firstName} ${expert.lastName}`}
                username={`@${expert.username}`}
                avgReturn=""
                categories={industrySectors}
                bio={expert.profile?.profileBio || ''}
                userUuid={expert.id} // Assuming id is the uuid, adjust if needed
                onCardClick={() => navigate({ to: `/user/${expert.id}` })}
                specializations={expert.profile?.specializations || []}
                achievements={expert.profile?.achievements || []}
              />
            );
          })}

          {experts.length === 0 && (
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
              <span className="material-icons text-3xl text-gray-300 mb-2">person_search</span>
              <p className="text-gray-500 text-sm">No experts found</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs border-2 border-transparent hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-lg"
                onClick={() => setSelectedSector("all")}
              >
                Clear filters
              </Button>
            </div>
          )}
            </div>
          )}

          {/* Bottom padding for safe area */}
          <div className="h-20"></div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default ExpertsList;
