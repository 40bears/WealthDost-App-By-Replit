import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ExpertCardProps {
  rank: number;
  name: string;
  researchFirm: string;
  sector: string;
  rating: number;
  avgReturn: string;
  successRate: number;
  followers: number;
  avatar?: string;
  onViewClick?: () => void;
}

export default function ExpertCard({
  rank,
  name,
  researchFirm,
  sector,
  rating,
  avgReturn,
  successRate,
  followers,
  avatar,
  onViewClick
}: ExpertCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      financial: "bg-blue-100 text-blue-800 border-blue-200",
      technology: "bg-purple-100 text-purple-800 border-purple-200",
      energy: "bg-orange-100 text-orange-800 border-orange-200",
      healthcare: "bg-green-100 text-green-800 border-green-200",
      industrials: "bg-gray-100 text-gray-800 border-gray-200",
      consumer: "bg-pink-100 text-pink-800 border-pink-200"
    };
    return colors[sector.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(3).replace(/\.?0+$/, '')}`;
    }
    return count.toString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-6 text-center">
          <span className="text-sm font-medium text-gray-500">{rank}</span>
        </div>

        {/* Avatar */}
        <Avatar className="h-12 w-12 border-2 border-purple-100 flex-shrink-0">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : null}
          <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-sm">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Main Content - Full Width */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              {/* Name and Stars */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {name}
                </h3>
                {renderStars(rating)}
              </div>

              {/* Research Firm */}
              <p className="text-sm text-gray-600 mb-2 truncate">
                {researchFirm}
              </p>

              {/* Sector and Returns */}
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 border ${getSectorColor(sector)}`}
                >
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </Badge>
                <span className="text-sm text-purple-600 font-semibold">
                  {avgReturn} returns
                </span>
              </div>
            </div>

            {/* View Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onViewClick}
              className="h-8 px-4 text-sm font-medium text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex-shrink-0"
            >
              View
            </Button>
          </div>

          {/* Success Rate and Followers - Full Width */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Success Rate: {successRate}%</span>
              <span>{formatFollowers(followers)} followers</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}