import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/hooks/graphql/useFollow";
import { useToast } from "@/hooks/use-toast";

interface ExpertCardProps {
  name: string;
  username: string;
  avgReturn: string;
  categories: string[];
  bio: string;
  avatar?: string;
  userUuid: string;
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
  userUuid,
  onCardClick,
  specializations = [],
  achievements = []
}: ExpertCardProps) {
  const { toast } = useToast();
  const { data: isFollowingData } = useIsFollowing(userUuid);
  const [followUser] = useFollowUser();
  const [unfollowUser] = useUnfollowUser();

  const isFollowing = isFollowingData?.isFollowing || false;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFollowing) {
        await unfollowUser({ variables: { input: { userUuid } } });
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${name}`,
          duration: 2000
        });
      } else {
        await followUser({ variables: { input: { userUuid } } });
        toast({
          title: "Following",
          description: `You are now following ${name}`,
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
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
        {!isFollowing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-gray-100 hover:bg-gray-200 flex-shrink-0"
            onClick={handleFollowClick}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFollowClick}>Unfollow</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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