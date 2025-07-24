import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX, MoreVertical, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Loop {
  _id: string;
  userId: {
    _id: string;
    username: string;
    fullName?: string;
    profileImageUrl?: string;
  };
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  tags?: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

interface LoopComment {
  _id: string;
  userId: {
    username: string;
    fullName?: string;
    profileImageUrl?: string;
  };
  content: string;
  createdAt: string;
}

export default function Loops() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likedLoops, setLikedLoops] = useState<Set<string>>(new Set());
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [touchStart, setTouchStart] = useState({ y: 0, time: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user for demo purposes - in real app this would come from auth context
  const currentUser = { _id: "user123", username: "demo_user" };

  const { data: loops, isLoading } = useQuery({
    queryKey: ["/api/loops"],
  });

  const { data: comments } = useQuery({
    queryKey: ["/api/loops", loops?.[currentIndex]?._id, "comments"],
    enabled: showComments && loops?.[currentIndex]?._id,
  });

  const likeMutation = useMutation({
    mutationFn: async (loopId: string) => {
      return apiRequest("POST", `/api/loops/${loopId}/like`, {
        userId: currentUser._id
      });
    },
    onSuccess: (data, loopId) => {
      // Update local state
      if (data.liked) {
        setLikedLoops(prev => new Set([...prev, loopId]));
      } else {
        setLikedLoops(prev => {
          const newSet = new Set(prev);
          newSet.delete(loopId);
          return newSet;
        });
      }
      // Invalidate loops to refresh like count
      queryClient.invalidateQueries({ queryKey: ["/api/loops"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  });

  const commentMutation = useMutation({
    mutationFn: async ({ loopId, content }: { loopId: string; content: string }) => {
      return apiRequest("POST", `/api/loops/${loopId}/comments`, {
        userId: currentUser._id,
        content
      });
    },
    onSuccess: () => {
      setNewComment("");
      // Refresh comments and update comment count
      queryClient.invalidateQueries({ queryKey: ["/api/loops", loops?.[currentIndex]?._id, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loops"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  });

  // Handle scroll navigation with single video transitions
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!loops || loops.length === 0 || isScrolling) return;
      
      setIsScrolling(true);
      
      // Debounce scrolling to prevent rapid transitions
      setTimeout(() => setIsScrolling(false), 300);
      
      if (e.deltaY > 50) {
        // Scroll down - go to next video (with infinite loop)
        setCurrentIndex(prev => (prev + 1) % loops.length);
      } else if (e.deltaY < -50) {
        // Scroll up - go to previous video (with infinite loop)
        setCurrentIndex(prev => prev === 0 ? loops.length - 1 : prev - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [loops?.length, isScrolling]);

  // Handle touch events for mobile swiping
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchStart({
        y: touch.clientY,
        time: Date.now()
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!loops || loops.length === 0 || isScrolling) return;
      
      const touch = e.changedTouches[0];
      const deltaY = touchStart.y - touch.clientY;
      const deltaTime = Date.now() - touchStart.time;
      
      // Only trigger if swipe is fast enough and far enough
      if (Math.abs(deltaY) > 50 && deltaTime < 300) {
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 300);
        
        if (deltaY > 0) {
          // Swipe up - go to next video
          setCurrentIndex(prev => (prev + 1) % loops.length);
        } else {
          // Swipe down - go to previous video
          setCurrentIndex(prev => prev === 0 ? loops.length - 1 : prev - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [loops?.length, touchStart, isScrolling]);

  // Handle content playback simulation
  useEffect(() => {
    // Since we're using placeholder content, we just simulate playback state
    // In a real app, this would handle actual video playback
  }, [currentIndex, isPlaying, isMuted]);

  // Handle keyboard controls with debouncing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!loops || loops.length === 0) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isScrolling) {
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 300);
            setCurrentIndex(prev => prev === 0 ? loops.length - 1 : prev - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isScrolling) {
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 300);
            setCurrentIndex(prev => (prev + 1) % loops.length);
          }
          break;
        case 'KeyM':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loops?.length, isScrolling]);

  const handleLike = (loopId: string) => {
    likeMutation.mutate(loopId);
  };

  const handleComment = () => {
    if (newComment.trim() && loops?.[currentIndex]) {
      commentMutation.mutate({
        loopId: loops[currentIndex]._id,
        content: newComment.trim()
      });
    }
  };



  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!loops || loops.length === 0) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">No Loops Yet</h2>
          <p className="text-gray-400 mb-6">Be the first to create a financial insights loop!</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Create Your First Loop
          </Button>
        </div>
      </div>
    );
  }

  const currentLoop = loops[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative h-screen bg-black overflow-hidden"
      style={{ 
        touchAction: 'pan-x pinch-zoom',
        userSelect: 'none'
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-white font-semibold text-lg">Loops</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Video Container */}
      <div className="relative w-full h-full">
        {loops.map((loop: Loop, index: number) => (
          <div
            key={loop._id}
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              index === currentIndex ? 'translate-y-0 opacity-100 scale-100' : 
              index < currentIndex ? '-translate-y-full opacity-0 scale-95' : 'translate-y-full opacity-0 scale-95'
            }`}
            style={{
              transform: isScrolling && index === currentIndex ? 'scale(0.98)' : undefined
            }}
          >
            {/* Loop Content Card */}
            <div 
              className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-600 flex flex-col items-center justify-center relative"
              onClick={() => setIsPlaying(prev => !prev)}
            >
              {/* Content */}
              <div className="text-center p-8 z-10">
                <div className="mb-6">
                  <Play className="w-16 h-16 text-white/90 mx-auto mb-4" />
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block mb-4">
                    <span className="text-white text-sm font-medium">{formatDuration(loop.duration)}</span>
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold mb-3 leading-tight">{loop.title}</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed max-w-xs mx-auto">{loop.description}</p>
                <div className="flex items-center justify-center space-x-4 text-white/70 text-xs">
                  <span>{formatCount(loop.views)} views</span>
                  <span>•</span>
                  <span>{formatCount(loop.likes)} likes</span>
                </div>
              </div>
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/3 right-20 w-12 h-12 border border-white/20 rounded-full"></div>
              </div>
              
              {/* Play indicator when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-20 h-20 text-white opacity-80" />
                </div>
              )}
            </div>

            {/* Video Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  {/* User Info */}
                  <div className="flex items-center mb-3">
                    <Avatar className="w-8 h-8 mr-3">
                      <AvatarImage src={loop.userId.profileImageUrl} />
                      <AvatarFallback className="bg-purple-600">
                        {loop.userId.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        @{loop.userId.username}
                      </h3>
                      <p className="text-gray-300 text-xs">
                        {formatDuration(loop.duration)} • {formatCount(loop.views)} views
                      </p>
                    </div>
                  </div>

                  {/* Loop Content */}
                  <h2 className="text-white font-semibold mb-2">{loop.title}</h2>
                  {loop.description && (
                    <p className="text-gray-200 text-sm mb-2 line-clamp-2">
                      {loop.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {loop.tags && loop.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {loop.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-purple-300 text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center space-y-4">
                  {/* Like Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center text-white hover:bg-white/20 p-2"
                    onClick={() => handleLike(loop._id)}
                    disabled={likeMutation.isPending}
                  >
                    <Heart 
                      className={`w-6 h-6 mb-1 ${
                        likedLoops.has(loop._id) ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                    <span className="text-xs">{formatCount(loop.likes)}</span>
                  </Button>

                  {/* Comment Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center text-white hover:bg-white/20 p-2"
                    onClick={() => setShowComments(true)}
                  >
                    <MessageCircle className="w-6 h-6 mb-1" />
                    <span className="text-xs">{formatCount(loop.comments)}</span>
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center text-white hover:bg-white/20 p-2"
                  >
                    <Share2 className="w-6 h-6 mb-1" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            </div>



            {/* Video Controls */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 mb-2"
                onClick={() => setIsMuted(prev => !prev)}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        ))}
      </div>



      {/* Comments Sidebar */}
      {showComments && (
        <div className="absolute inset-y-0 right-0 w-80 bg-black/90 backdrop-blur-sm p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Comments</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowComments(false)}
            >
              ×
            </Button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto mb-4 max-h-96">
            {comments && comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment: LoopComment) => (
                  <div key={comment._id} className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.userId.profileImageUrl} />
                      <AvatarFallback className="bg-purple-600 text-xs">
                        {comment.userId.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold mr-2">@{comment.userId.username}</span>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="flex space-x-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleComment}
              disabled={!newComment.trim() || commentMutation.isPending}
            >
              Post
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-20 left-4 text-gray-400 text-xs bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
        <p>Swipe up/down or use ↑↓ arrows • Space to play/pause • M to mute</p>
      </div>
    </div>
  );
}