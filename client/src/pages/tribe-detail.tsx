import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TribeDetail = () => {
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  
  const handlePinPost = (postId: number) => {
    console.log(`Pinning post ${postId}`);
    // Handle pin functionality here
  };
  
  const handleReportPost = (postId: number) => {
    console.log(`Reporting post ${postId}`);
    // Handle report functionality here
  };
  
  // Mock data - would be fetched from API based on tribe ID
  const tribe = {
    id: Number(id),
    name: "Value Investing Masters",
    description: "Deep dive into fundamental analysis and long-term value investing strategies. Learn from experienced investors and share your insights.",
    creator: "Rajesh Kumar",
    creatorAvatar: "RK",
    creatorUsername: "rajeshkumar",
    category: "Value Investing",
    memberCount: 1250,
    isPremium: true,
    premiumPrice: "299",
    isSponsored: false,
    tipsHits: 1250,
    weeklyEngagement: 89,
    badges: ["Expert Verified", "High Activity"],
    createdDate: "March 2024",
    coverImage: null, // Would be a URL in real implementation
    rules: [
      "Keep discussions relevant to value investing",
      "No spam or promotional content",
      "Respect all members and their opinions",
      "Share quality research and insights"
    ]
  };

  // Only creator posts since only the creator will be posting
  const posts = [
    {
      id: 1,
      author: tribe.creator,
      authorAvatar: tribe.creatorAvatar,
      authorUsername: tribe.creatorUsername,
      timestamp: "2h",
      content: "Just analyzed Tata Steel's latest quarterly results. The debt-to-equity ratio is improving significantly. What are your thoughts on their expansion plans?",
      likes: 24,
      comments: 8,
      isPinned: true
    },
    {
      id: 2,
      author: tribe.creator,
      authorAvatar: tribe.creatorAvatar,
      authorUsername: tribe.creatorUsername,
      timestamp: "5h",
      content: "Warren Buffett's latest letter mentions the importance of patience in value investing. How do you maintain discipline during market volatility?",
      likes: 18,
      comments: 12,
      isPinned: false
    },
    {
      id: 3,
      author: tribe.creator,
      authorAvatar: tribe.creatorAvatar,
      authorUsername: tribe.creatorUsername,
      timestamp: "1d",
      content: "Found an interesting undervalued stock in the pharmaceutical sector. ROE consistently above 15% for the past 5 years. DM me for details (Premium members only).",
      likes: 31,
      comments: 15,
      isPinned: false
    }
  ];


  const handleJoinSubscribe = () => {
    if (tribe.isPremium && !isJoined) {
      // Handle premium subscription logic
      console.log(`Subscribing to ${tribe.name} for ₹${tribe.premiumPrice}/month`);
    }
    setIsJoined(!isJoined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/investment-rooms">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600 border-2 border-transparent hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl">
                <span className="material-icons text-lg">arrow_back</span>
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold truncate">{tribe.name}</h1>
              <p className="text-xs text-gray-500">{tribe.memberCount.toLocaleString()} members</p>
            </div>
            <Button variant="ghost" size="sm" className="p-1 text-gray-600 border-2 border-transparent hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl">
              <span className="material-icons text-lg">more_vert</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tribe Banner */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg rounded-2xl relative overflow-hidden">
          {/* Cover Image Area */}
          <div className="h-32 bg-gradient-to-r from-purple-400 to-purple-600 relative">
            {tribe.isSponsored && (
              <div className="absolute top-3 right-3">
                <Badge className="text-xs bg-blue-100/70 backdrop-blur-sm text-blue-700 border-2 border-blue-200">
                  Sponsored
                </Badge>
              </div>
            )}
          </div>
          
          {/* Tribe Info */}
          <div className="p-4 -mt-8 relative">
            <div className="flex items-end space-x-3 mb-3">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-bold">
                  {tribe.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{tribe.name}</h2>
                <p className="text-sm text-gray-600">Created in {tribe.createdDate}</p>
              </div>
              {tribe.isPremium && (
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">₹{tribe.premiumPrice}</div>
                  <div className="text-xs text-gray-500">/month</div>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{tribe.description}</p>
            
            {/* Creator Info */}
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-6 w-6 border-2 border-purple-200">
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                  {tribe.creatorAvatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">Created by {tribe.creator}</span>
              <Badge variant="secondary" className="text-xs">
                {tribe.category}
              </Badge>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">group</span>
                {tribe.memberCount.toLocaleString()} members
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                {tribe.tipsHits} hits
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">bar_chart</span>
                {tribe.weeklyEngagement}% weekly
              </span>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              {tribe.badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="text-xs border-2 hover:border-gray-300">
                  {badge}
                </Badge>
              ))}
            </div>
            
            {/* Join/Subscribe Button */}
            <Button 
              onClick={handleJoinSubscribe}
              className={`w-full text-sm border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                tribe.isPremium && !isJoined 
                  ? 'bg-purple-600/90 backdrop-blur-sm text-white border-purple-400 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/30' 
                  : isJoined 
                    ? 'bg-green-600/90 backdrop-blur-sm text-white border-green-400 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/30'
                    : 'bg-purple-100/70 backdrop-blur-sm text-purple-700 border-purple-200 hover:border-purple-300 hover:bg-purple-200/70'
              }`}
              data-testid={tribe.isPremium ? "button-subscribe" : "button-join"}
            >
              {isJoined 
                ? "Joined ✓" 
                : tribe.isPremium 
                  ? `Subscribe for ₹${tribe.premiumPrice}/mo` 
                  : "Join Tribe"
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-md border-2 border-gray-200">
            <TabsTrigger value="posts" className="text-sm">Posts</TabsTrigger>
            <TabsTrigger value="about" className="text-sm">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4 mt-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl relative">
                {/* Context Menu - Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto w-auto hover:bg-gray-100 rounded-full"
                        data-testid={`button-context-menu-${post.id}`}
                      >
                        <span className="material-icons text-sm text-gray-500">more_vert</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => handlePinPost(post.id)}
                        className="flex items-center space-x-2"
                        data-testid={`menu-pin-${post.id}`}
                      >
                        <span className="material-icons text-sm">push_pin</span>
                        <span>{post.isPinned ? 'Unpin Post' : 'Pin Post'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleReportPost(post.id)}
                        className="flex items-center space-x-2 text-red-600"
                        data-testid={`menu-report-${post.id}`}
                      >
                        <span className="material-icons text-sm">flag</span>
                        <span>Report Post</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Pinned Badge */}
                {post.isPinned && (
                  <div className="absolute top-3 left-3">
                    <Badge className="text-xs bg-yellow-100/70 text-yellow-700 border-2 border-yellow-200">
                      <span className="material-icons text-xs mr-1">push_pin</span>
                      Pinned
                    </Badge>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-purple-200">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                        {post.authorAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-2">
                        <h4 className="font-semibold text-sm">{post.author}</h4>
                        <span className="text-gray-500 text-sm">@{post.authorUsername}</span>
                        <span className="text-gray-400 text-sm">·</span>
                        <span className="text-gray-500 text-sm">{post.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{post.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-red-50 hover:text-red-600">
                      <span className="material-icons text-sm mr-1">favorite_border</span>
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-blue-50 hover:text-blue-600">
                      <span className="material-icons text-sm mr-1">chat_bubble_outline</span>
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-green-50 hover:text-green-600">
                      <span className="material-icons text-sm">share</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          
          <TabsContent value="about" className="space-y-4 mt-4">
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3">Tribe Rules</h3>
                <ul className="space-y-2">
                  {tribe.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-purple-600 mr-2">{index + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3">Tribe Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Members</p>
                    <p className="font-semibold">{tribe.memberCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tips Hits</p>
                    <p className="font-semibold">{tribe.tipsHits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-semibold">{tribe.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Weekly Engagement</p>
                    <p className="font-semibold">{tribe.weeklyEngagement}%</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TribeDetail;