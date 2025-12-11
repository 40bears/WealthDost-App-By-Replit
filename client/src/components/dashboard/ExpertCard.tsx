import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface ExpertCardProps {
  name: string;
  username: string;
  avgReturn: string;
  categories: string[];
  bio: string;
  avatar?: string;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  onCardClick?: () => void;
  specializations?: string[];
  achievements?: string[];
}

export default function ExpertCard({
  name,
  username,
  avgReturn,
  categories,
  bio,
  avatar,
  isFollowing = false,
  onFollowClick,
  onCardClick,
  specializations = [],
  achievements = []
}: ExpertCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onCardClick}
    >
      {/* Header Section */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <Avatar className="h-14 w-14 flex-shrink-0">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : null}
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-base">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Name and Username */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-gray-900 mb-0.5">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
            <span className="whitespace-nowrap">{username}</span>
          </div>
        </div>

        {/* Follow Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onFollowClick?.();
          }}
          className="h-9 px-4 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-all duration-200 flex-shrink-0 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        {bio}
      </p>

      {/* Specializations - Show max 3 chips with +x more */}
      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {specializations.slice(0, 3).map((specialization, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium capitalize"
            >
              {specialization}
            </Badge>
          ))}
          {specializations.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-medium"
            >
              +{specializations.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-700">Achievements</p>
          <div className="flex flex-wrap gap-1.5">
            {achievements.map((achievement, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200 font-medium capitalize"
              >
                {achievement}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}