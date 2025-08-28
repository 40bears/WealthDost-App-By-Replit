import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@shared/schema";
import { timeAgo } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useInteraction } from "@/lib/interactionContext";
import { Heart, MessageCircle, Share, UserPlus, UserCheck } from "lucide-react";
import { CommentModal } from "@/components/ui/comment-modal";

interface ContentFeedProps {
  posts?: Post[];
  isLoading?: boolean;
}

const ContentFeed = ({ posts, isLoading = false }: ContentFeedProps) => {
  const { 
    toggleLike, 
    toggleFollow, 
    sharePost, 
    addComment, 
    isLiked, 
    isFollowing, 
    getShareCount, 
    getCommentCount 
  } = useInteraction();

  if (isLoading) {
    return (
      <div className="mx-4 my-4 space-y-4">
        <LoadingFeedCard />
        <LoadingFeedCard />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="mx-4 my-4 text-center py-8">
        <p className="text-gray-500">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="mx-4 my-4 space-y-4 pb-16">
      {posts.map((post: any) => {
        const liked = isLiked(post.id);
        const following = isFollowing(post.userId);
        const shareCount = getShareCount(post.id);
        const commentCount = getCommentCount(post.id);
        
        return (
          <div key={post.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl transition-all duration-300 active:scale-[0.98]">
            <div className="p-4">
              <div className="flex items-start mb-3">
                <div className="h-10 w-10 bg-purple-100/70 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">
                    {post.userId === 1 ? "U" : "A"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {post.userId === 1 ? "You" : `User ${post.userId}`}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {post.userId !== 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-xs px-3 py-1 border-2 transition-all duration-300 active:scale-95 ${
                          following 
                            ? 'bg-purple-100/70 backdrop-blur-sm text-purple-600 border-purple-200' 
                            : 'bg-white/70 backdrop-blur-sm border-gray-200'
                        }`}
                        onClick={() => toggleFollow(post.userId)}
                      >
                        {following ? (
                          <>
                            <UserCheck size={12} className="mr-1" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} className="mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{post.content}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs bg-gray-100/70 backdrop-blur-sm text-gray-600 px-2 py-1 rounded-lg border-2 border-gray-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t-2 border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-1 text-xs border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-red-50/70 hover:backdrop-blur-sm ${
                    liked ? 'text-red-600 bg-red-50/70 backdrop-blur-sm border-red-200' : 'text-gray-500'
                  }`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart size={14} className={`transition-all duration-300 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{(post.likes || 0) + (liked ? 1 : 0)}</span>
                </Button>
                
                <CommentModal postId={post.id} onAddComment={addComment}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-blue-50/70 hover:backdrop-blur-sm hover:text-blue-600"
                  >
                    <MessageCircle size={14} className="transition-all duration-300" />
                    <span className="font-medium">{(post.comments || 0) + commentCount}</span>
                  </Button>
                </CommentModal>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-gray-50/70 hover:backdrop-blur-sm hover:text-gray-600"
                  onClick={() => sharePost(post.id)}
                >
                  <Share size={14} className="transition-all duration-300" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LoadingFeedCard = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-3">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-32 w-full rounded-lg mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
);

const ExpertPostCard = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center mb-3">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="bg-gray-200">
            <span className="material-icons text-gray-500">person</span>
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center">
            <h4 className="font-medium">Rahul Sharma</h4>
            <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 border-0 flex items-center text-xs">
              <span className="material-icons text-xs mr-0.5">verified</span>
              Expert
            </Badge>
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            @ValueInvestor • 2h ago
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto text-gray-400">
          <span className="material-icons">more_horiz</span>
        </Button>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">My analysis on the IT sector post Q4 results</h3>
        <p className="text-gray-600 text-sm mb-3">After reviewing the recent earnings reports from major IT companies, I've identified 3 key trends that could impact the sector's performance in the coming quarters...</p>
        {/* A chart placeholder */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <span className="material-icons text-gray-400 text-4xl">insert_chart</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto">
            <span className="material-icons text-sm mr-1">thumb_up</span>
            152
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto">
            <span className="material-icons text-sm mr-1">chat_bubble_outline</span>
            24
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto">
            <span className="material-icons text-sm mr-1">bookmark_border</span>
            Save
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center ml-auto p-0 h-auto">
            <span className="material-icons text-sm mr-1">share</span>
            Share
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DebateCard = () => (
  <Card>
    <CardHeader className="bg-gray-50 p-3 border-b border-gray-200">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2">forum</span>
        <h3 className="font-semibold">Hot Debate</h3>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <h3 className="font-semibold mb-3">Is AI overvalued in the current market?</h3>
      
      <div className="flex mb-4">
        <div className="flex-1 pr-2">
          <div className="bg-green-100 p-3 rounded-lg">
            <h4 className="text-green-800 font-medium text-sm mb-1">Bull Case</h4>
            <p className="text-gray-700 text-sm">AI is transforming every industry and we're just at the beginning of its potential.</p>
          </div>
        </div>
        <div className="flex-1 pl-2">
          <div className="bg-red-100 p-3 rounded-lg">
            <h4 className="text-red-800 font-medium text-sm mb-1">Bear Case</h4>
            <p className="text-gray-700 text-sm">Current valuations are based on hype rather than proven business models.</p>
          </div>
        </div>
      </div>
      
      <div className="h-2 bg-gray-100 rounded-lg mb-3 overflow-hidden flex">
        <div className="bg-primary rounded-l-lg transition-all" style={{width: "63%"}}></div>
        <div className="bg-gray-300 rounded-r-lg transition-all" style={{width: "37%"}}></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <div>63% Bull</div>
        <div>37% Bear</div>
      </div>
      
      <div className="flex space-x-2">
        <Button className="flex-1">Vote Bull</Button>
        <Button variant="secondary" className="flex-1">Vote Bear</Button>
      </div>
    </CardContent>
  </Card>
);

const QuizCard = () => (
  <Card>
    <CardHeader className="bg-gray-50 p-3 border-b border-gray-200">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2">quiz</span>
        <h3 className="font-semibold">Daily Quiz</h3>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <h3 className="font-semibold mb-3">Test your knowledge!</h3>
      <p className="text-gray-700 text-sm mb-4">Complete today's quiz to earn XP and climb the leaderboard.</p>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h4 className="font-medium text-sm mb-2">What is the primary goal of value investing?</h4>
        <RadioGroup defaultValue="">
          <div className="space-y-2">
            <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
              <RadioGroupItem value="short-term" id="short-term" className="mr-3" />
              <Label htmlFor="short-term" className="cursor-pointer text-sm">Quick short-term profits</Label>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
              <RadioGroupItem value="undervalued" id="undervalued" className="mr-3" />
              <Label htmlFor="undervalued" className="cursor-pointer text-sm">Finding undervalued stocks with long-term potential</Label>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
              <RadioGroupItem value="timing" id="timing" className="mr-3" />
              <Label htmlFor="timing" className="cursor-pointer text-sm">Timing market movements precisely</Label>
            </div>
            <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
              <RadioGroupItem value="diversifying" id="diversifying" className="mr-3" />
              <Label htmlFor="diversifying" className="cursor-pointer text-sm">Diversifying across all sectors equally</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <Button className="w-full">Submit Answer</Button>
    </CardContent>
  </Card>
);

const NewsCard = () => (
  <Card>
    <CardHeader className="bg-gray-50 p-3 border-b border-gray-200">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2">feed</span>
        <h3 className="font-semibold">News Pulse</h3>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex items-center mb-2">
        <Badge variant="outline" className="bg-green-100 text-green-800 border-0 flex items-center">
          <span className="material-icons text-xs mr-0.5">trending_up</span>
          Bullish
        </Badge>
        <span className="text-xs text-gray-500 ml-2">10 min ago</span>
      </div>
      
      <h3 className="font-semibold mb-2">RBI keeps repo rate unchanged at 6.5% for seventh consecutive time</h3>
      
      <div className="space-y-2 mb-4">
        <div className="bg-gray-50 p-2 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700">What happened?</h4>
          <p className="text-sm">The RBI's Monetary Policy Committee voted to maintain status quo on interest rates while focusing on inflation control.</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700">Why it matters?</h4>
          <p className="text-sm">This decision signals confidence in economic growth while maintaining vigilance on inflation, creating stability for markets.</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700">Investor Angle</h4>
          <p className="text-sm">Positive for rate-sensitive sectors like banking, real estate, and auto. Consider exposure to these sectors.</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs flex items-center bg-gray-100 border-0">
          <span className="material-icons text-xs mr-1">bookmark_border</span>
          Add to Watchlist
        </Button>
        <Button variant="outline" size="sm" className="text-xs flex items-center bg-gray-100 border-0">
          <span className="material-icons text-xs mr-1">forum</span>
          Start Debate
        </Button>
        <Button variant="outline" size="sm" className="text-xs flex items-center bg-gray-100 border-0">
          <span className="material-icons text-xs mr-1">groups</span>
          Share to Tribe
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ContentFeed;
