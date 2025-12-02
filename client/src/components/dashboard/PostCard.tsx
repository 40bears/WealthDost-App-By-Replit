import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, UserPlus, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLikePost, useUnlikePost } from '@/hooks/graphql';

interface PostCardProps {
  id: number;
  author: {
    name: string;
    username: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isFollowing?: boolean;
  image?: string;
  isLikedByMe?: boolean;
}

export function PostCard({
  id,
  author,
  content,
  tags,
  likes,
  comments,
  timestamp,
  isFollowing = false,
  image,
  isLikedByMe = false,
}: PostCardProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [likePost] = useLikePost();
  const [unlikePost] = useUnlikePost();

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleLike = async () => {
    try {
      const postId = parseInt(String(id), 10);
      console.log('PostCard - Toggling like for post:', postId, 'isLikedByMe:', isLikedByMe);

      if (isLikedByMe) {
        await unlikePost({ variables: { postId } });
      } else {
        await likePost({ variables: { postId } });
      }
    } catch (error) {
      console.error('PostCard - Error toggling like:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{author.name}</span>
              <span className="text-gray-500 text-sm">{author.username}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{timestamp}</span>
            </div>
          </div>
        </div>
        
        {!following ? (
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
              <DropdownMenuItem>Mute</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{content}</p>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Post content"
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-600">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-500 transition-colors"
        >
          <Heart className={`h-4 w-4 ${isLikedByMe ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-sm">{likes}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{comments}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
}