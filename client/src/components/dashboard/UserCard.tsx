import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, UserCheck } from "lucide-react";

interface UserCardProps {
  name: string;
  username: string;
  avatar?: string;
  expertise: string;
  followers: number;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

export default function UserCard({
  name,
  username,
  avatar,
  expertise,
  followers,
  isFollowing = false,
  onFollowToggle
}: UserCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side: Avatar and Info */}
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-12 w-12 border-2 border-gray-100">
            {avatar ? (
              <AvatarImage src={avatar} alt={name} />
            ) : null}
            <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-sm">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate">
              {name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {username}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {expertise}
            </p>
          </div>
        </div>

        {/* Right side: Follow button and followers */}
        <div className="flex flex-col items-end gap-1 ml-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onFollowToggle}
            className={`h-8 px-3 text-sm font-medium transition-all duration-200 ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-3.5 w-3.5 mr-1" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Follow
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 whitespace-nowrap">
            {formatFollowers(followers)} followers
          </p>
        </div>
      </div>
    </Card>
  );
}