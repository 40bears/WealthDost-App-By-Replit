import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsFollowing, useFollowerCount, useFollowUser, useUnfollowUser } from "@/hooks/graphql/useFollow";
import { useToast } from "@/hooks/use-toast";

interface UserCardProps {
  name: string;
  username: string;
  avatar?: string;
  expertise: string;
  userUuid: string;
}

export default function UserCard({
  name,
  username,
  avatar,
  expertise,
  userUuid
}: UserCardProps) {
  const { toast } = useToast();
  const { data: isFollowingData } = useIsFollowing(userUuid);
  const { data: followerCountData } = useFollowerCount(userUuid);
  const [followUser] = useFollowUser();
  const [unfollowUser] = useUnfollowUser();

  const isFollowing = isFollowingData?.isFollowing || false;
  const followers = followerCountData?.followerCount || 0;

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

  const handleFollowToggle = async () => {
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
          {!isFollowing ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
              onClick={handleFollowToggle}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-100 hover:bg-gray-200">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleFollowToggle}>Unfollow</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <p className="text-xs text-gray-500 whitespace-nowrap">
            {formatFollowers(followers)} followers
          </p>
        </div>
      </div>
    </Card>
  );
}