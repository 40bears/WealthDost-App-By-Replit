import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, UserPlus, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLikeStockTip, useUnlikeStockTip } from '@/hooks/graphql';
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@/hooks/graphql/useFollow';
import { useToast } from '@/hooks/use-toast';
import { CommentsBottomSheet } from '@/components/comments/CommentsBottomSheet';

interface TipCardProps {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    initials: string;
    uuid: string;
  };
  stock: {
    name: string;
    symbol: string;
    logo?: string;
    change: string;
  };
  entryPrice: string;
  targetPrice: string;
  buyDate: string;
  sellDate?: string;
  reasoning: string;
  chartImage?: string;
  likes: number;
  comments: number;
  isLikedByMe?: boolean;
  tribe?: {
    id: number;
    name: string;
  };
}

export function TipCard({
  id,
  author,
  stock,
  entryPrice,
  targetPrice,
  buyDate,
  sellDate,
  reasoning,
  chartImage,
  likes,
  comments,
  isLikedByMe = false,
  tribe,
}: TipCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showChart, setShowChart] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likeStockTip] = useLikeStockTip();
  const [unlikeStockTip] = useUnlikeStockTip();
  const { data: isFollowingData } = useIsFollowing(author.id);
  const [followUser] = useFollowUser();
  const [unfollowUser] = useUnfollowUser();

  const isFollowing = author.id ? (isFollowingData?.isFollowing || false) : false;

  const handleFollow = async () => {
    if (!author.id) {
      console.error('Author UUID is missing:', author);
      toast({
        title: "Error",
        description: "Unable to follow: User information incomplete.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser({ variables: { input: { userUuid: author.id } } });
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${author.name}`,
          duration: 2000
        });
      } else {
        await followUser({ variables: { input: { userUuid: author.id } } });
        toast({
          title: "Following",
          description: `You are now following ${author.name}`,
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

  const handleUserClick = () => {
    navigate({ to: '/user/$userId', params: { userId: author.id } });
  };

  const handleTipClick = () => {
    navigate({ to: '/stock-tips/$tipId', params: { tipId: id } });
  };

  const handleLike = async () => {
    try {
      console.log('TipCard - Toggling like for stock tip:', id, 'isLikedByMe:', isLikedByMe);

      if (isLikedByMe) {
        await unlikeStockTip({ variables: { stockTipId: id } });
      } else {
        await likeStockTip({ variables: { stockTipId: id } });
      }
    } catch (error) {
      console.error('TipCard - Error toggling like:', error);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/stock-tips/${id}`;
      if (navigator.share) {
        await navigator.share({
          title: `Stock Tip: ${stock.symbol}`,
          text: reasoning || `Check out this stock tip for ${stock.name} (${stock.symbol})`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Copied!",
          description: "Stock tip link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      const shareUrl = `${window.location.origin}/stock-tips/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Stock tip link copied to clipboard.",
      });
    }
  };

  const toggleChart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChart(!showChart);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* Stock Header */}
      <div className="flex items-center justify-between mb-5 cursor-pointer" onClick={handleTipClick}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {stock.logo ? (
              <img src={stock.logo} alt={stock.name} className="h-8 w-8" />
            ) : (
              <span className="text-blue-600 font-bold text-sm">
                {stock.symbol.slice(0, 2)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{stock.name}</h3>
            <p className="text-sm text-gray-500">{stock.symbol}</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {stock.change}
        </div>
      </div>

      {/* Price Info */}
      <div className="grid grid-cols-3 gap-4 mb-5 cursor-pointer" onClick={handleTipClick}>
        <div>
          <p className="text-xs text-gray-500 mb-1">Entry Price</p>
          <p className="font-semibold text-gray-900">{entryPrice}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Target Price</p>
          <p className="font-semibold text-gray-900">{targetPrice}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Buy/Sell Date</p>
          <p className="font-semibold text-gray-900 text-sm">{buyDate} {sellDate ? `- ${sellDate}` : ''}</p>
        </div>
      </div>

      {/* Reasoning - Only show if reasoning or chartImage exists */}
      {(reasoning || chartImage) && (
        <div className="relative bg-[#BFDBFE]/30 rounded-lg p-3 pt-5 mb-5 cursor-pointer" onClick={handleTipClick}>
          <span className="absolute -top-2.5 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            REASONING
          </span>
          {reasoning && (
            <p className="text-sm text-gray-700 leading-relaxed mb-2">{reasoning}</p>
          )}

          {chartImage && (
            <button
              onClick={toggleChart}
              className="w-full text-center flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {showChart ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Chart
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Chart
                </>
              )}
            </button>
          )}

          {/* Chart Image */}
          {showChart && chartImage && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img
                src={chartImage}
                alt="Stock chart"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      )}

      {/* Author Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={handleUserClick}>
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 cursor-pointer hover:underline" onClick={handleUserClick}>{author.name}</span>
              <span className="text-gray-500 text-xs cursor-pointer hover:underline" onClick={handleUserClick}>{author.username}</span>
            </div>
            {tribe && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs">🔒</span>
                <span className="text-xs text-purple-600 font-medium">{tribe.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {!isFollowing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-gray-100 hover:bg-gray-200"
            onClick={handleFollow}
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
              <DropdownMenuItem onClick={handleFollow}>Unfollow</DropdownMenuItem>
              {/* <DropdownMenuItem>Mute</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-600 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isLikedByMe ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-sm">{likes}</span>
        </button>
        <button
          onClick={() => setCommentsOpen(true)}
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{comments}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Comments Bottom Sheet */}
      <CommentsBottomSheet
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        entityId={id}
        entityType="STOCK_TIP"
      />
    </div>
  );
}