import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, BarChart3 } from "lucide-react";

interface TribeCardProps {
  name: string;
  createdDate: string;
  description: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar?: string;
  memberCount: number;
  tipsHits: number;
  weeklyFeeds: number;
  badges: string[];
  isPremium: boolean;
  premiumPrice?: string;
  coverImage?: string;
  onJoinClick?: () => void;
  onCardClick?: () => void;
}

export default function TribeCard({
  name,
  createdDate,
  description,
  creatorName,
  creatorUsername,
  creatorAvatar,
  memberCount,
  tipsHits,
  weeklyFeeds,
  badges,
  isPremium,
  premiumPrice,
  coverImage,
  onJoinClick,
  onCardClick
}: TribeCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return num.toString();
  };

  return (
    <Card
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onCardClick}
    >
      {/* Cover Image */}
      <div className="relative">
        {coverImage && (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={coverImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Avatar - Overlapping (20% on cover, 80% on white area) */}
        <div className="absolute -bottom-12 left-5">
          <Avatar className="h-16 w-16 flex-shrink-0 border-4 border-white shadow-md">
            {creatorAvatar ? (
              <AvatarImage src={creatorAvatar} alt={creatorName} />
            ) : null}
            <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">
              {getInitials(creatorName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="p-5 pt-2">
        {/* Header Section with Avatar space, Name and Price */}
        <div className="flex items-start gap-3 mb-4">
          {/* Space for overlapping avatar */}
          <div className="w-16 flex-shrink-0"></div>

          {/* Title and Date */}
          <div className="flex-1 min-w-0 -mt-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-0.5">
                  {name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created in {createdDate}
                </p>
              </div>

              {/* Price */}
              {isPremium && premiumPrice && (
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-purple-600">₹{premiumPrice}</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              )}
              {!isPremium && (
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-purple-600">₹0</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {description}
        </p>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6 flex-shrink-0">
            {creatorAvatar ? (
              <AvatarImage src={creatorAvatar} alt={creatorName} />
            ) : null}
            <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-xs">
              {getInitials(creatorName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Created by {creatorName} (@{creatorUsername})
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{formatNumber(memberCount)} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>{tipsHits} hits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>{weeklyFeeds} feeds weekly</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-3 py-1 border-gray-300 bg-white font-medium"
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Join Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onJoinClick?.();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200"
        >
          {isPremium ? "Join now for Free" : "Join now for Free"}
        </Button>
      </div>
    </Card>
  );
}
