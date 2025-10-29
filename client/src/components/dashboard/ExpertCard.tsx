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
  onCardClick
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

        {/* Name, Username, and Returns */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-gray-900 mb-0.5">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
            <span className="whitespace-nowrap">{username}</span>
            <span className="text-green-600 font-medium whitespace-nowrap">({avgReturn})</span>
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

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((category, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-sm px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {bio}
      </p>
    </Card>
  );
}