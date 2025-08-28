import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share, ArrowLeft, BarChart3, Eye, Calendar } from "lucide-react";
import { useInteraction } from "@/lib/interactionContext";
import { CommentModal } from "@/components/ui/comment-modal";

interface AnalyticsData {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowers: number;
  totalFollowing: number;
  weeklyGrowth: number;
  topPerformingPosts: Array<{
    id: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    postType: string;
    createdAt: string;
  }>;
  engagementByDay: Array<{
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "engagement">("overview");
  
  const { 
    toggleLike, 
    sharePost, 
    addComment, 
    isLiked, 
    getCommentCount 
  } = useInteraction();

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalPosts: 127,
    totalLikes: 3248,
    totalComments: 892,
    totalShares: 445,
    totalFollowers: 1567,
    totalFollowing: 234,
    weeklyGrowth: 12.5,
    topPerformingPosts: [
      {
        id: "1",
        content: "Just shared my analysis on RELIANCE breakout pattern. The stock is showing strong momentum with volume confirmation. Target: ₹2650",
        likes: 234,
        comments: 45,
        shares: 23,
        postType: "analysis",
        createdAt: "2024-01-15"
      },
      {
        id: "2", 
        content: "Bitcoin breaking above $43K resistance! This could be the start of the next leg up. Here's my technical analysis 📈",
        likes: 189,
        comments: 67,
        shares: 34,
        postType: "tweet",
        createdAt: "2024-01-14"
      },
      {
        id: "3",
        content: "Market outlook for this week: Banking stocks looking bullish, tech showing consolidation. What's your take?",
        likes: 156,
        comments: 89,
        shares: 12,
        postType: "discussion",
        createdAt: "2024-01-13"
      }
    ],
    engagementByDay: [
      { date: "Mon", likes: 45, comments: 12, shares: 8 },
      { date: "Tue", likes: 67, comments: 23, shares: 15 },
      { date: "Wed", likes: 89, comments: 34, shares: 22 },
      { date: "Thu", likes: 123, comments: 45, shares: 31 },
      { date: "Fri", likes: 98, comments: 29, shares: 18 },
      { date: "Sat", likes: 76, comments: 18, shares: 12 },
      { date: "Sun", likes: 54, comments: 15, shares: 9 }
    ]
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "analysis": return "bg-blue-100/70 text-blue-700 border-blue-200";
      case "tweet": return "bg-green-100/70 text-green-700 border-green-200";
      case "discussion": return "bg-purple-100/70 text-purple-700 border-purple-200";
      default: return "bg-gray-100/70 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600 border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Analytics</h1>
            <div className="w-8"></div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100/70 backdrop-blur-sm rounded-xl p-1 border-2 border-gray-200">
            <button
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 active:scale-95 ${
                activeTab === "overview" 
                  ? "bg-white/80 backdrop-blur-sm text-purple-600 shadow-lg border-2 border-purple-200" 
                  : "text-gray-600 border-2 border-transparent"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 active:scale-95 ${
                activeTab === "posts" 
                  ? "bg-white/80 backdrop-blur-sm text-purple-600 shadow-lg border-2 border-purple-200" 
                  : "text-gray-600 border-2 border-transparent"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Top Posts
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 active:scale-95 ${
                activeTab === "engagement" 
                  ? "bg-white/80 backdrop-blur-sm text-purple-600 shadow-lg border-2 border-purple-200" 
                  : "text-gray-600 border-2 border-transparent"
              }`}
              onClick={() => setActiveTab("engagement")}
            >
              Engagement
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4 transition-all duration-300 active:scale-[0.98]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-purple-100/70 backdrop-blur-sm p-2 rounded-xl">
                    <BarChart3 size={16} className="text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Total Posts</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{analyticsData.totalPosts}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+{analyticsData.weeklyGrowth}%</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4 transition-all duration-300 active:scale-[0.98]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-red-100/70 backdrop-blur-sm p-2 rounded-xl">
                    <Heart size={16} className="text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Total Likes</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{analyticsData.totalLikes.toLocaleString()}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+15.2%</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4 transition-all duration-300 active:scale-[0.98]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-100/70 backdrop-blur-sm p-2 rounded-xl">
                    <MessageCircle size={16} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Comments</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{analyticsData.totalComments}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4 transition-all duration-300 active:scale-[0.98]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-green-100/70 backdrop-blur-sm p-2 rounded-xl">
                    <Users size={16} className="text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Followers</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{analyticsData.totalFollowers.toLocaleString()}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+22.4%</span>
                </div>
              </div>
            </div>

            {/* Weekly Performance */}
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                <Calendar size={16} className="text-purple-600" />
                <span>Weekly Engagement</span>
              </h3>
              <div className="space-y-2">
                {analyticsData.engagementByDay.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 w-12">{day.date}</span>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.likes / 150) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <Heart size={10} className="text-red-500" />
                      <span>{day.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-3">
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                <TrendingUp size={16} className="text-green-600" />
                <span>Top Performing Posts</span>
              </h3>
              <div className="space-y-3">
                {analyticsData.topPerformingPosts.map((post, index) => (
                  <div key={post.id} className="bg-gray-50/70 backdrop-blur-sm border-2 border-gray-100 rounded-xl p-3">
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        #{index + 1}
                      </div>
                      <Badge className={`text-xs border-2 backdrop-blur-sm ${getPostTypeColor(post.postType)}`}>
                        {post.postType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs border-t-2 border-gray-100 pt-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center space-x-1 text-xs border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-red-50/70 hover:backdrop-blur-sm p-1 h-auto ${
                            isLiked(post.id) ? 'text-red-600 bg-red-50/70 backdrop-blur-sm border-red-200' : 'text-gray-500'
                          }`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <Heart size={10} className={`transition-all duration-300 ${isLiked(post.id) ? 'fill-current' : ''}`} />
                          <span className="font-medium">{post.likes + (isLiked(post.id) ? 1 : 0)}</span>
                        </Button>
                        
                        <CommentModal postId={post.id} onAddComment={addComment}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-blue-50/70 hover:backdrop-blur-sm hover:text-blue-600 p-1 h-auto"
                          >
                            <MessageCircle size={10} className="transition-all duration-300" />
                            <span className="font-medium">{post.comments + getCommentCount(post.id)}</span>
                          </Button>
                        </CommentModal>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-gray-50/70 hover:backdrop-blur-sm hover:text-gray-600 p-1 h-auto"
                          onClick={() => sharePost(post.id)}
                        >
                          <Share size={10} className="transition-all duration-300" />
                        </Button>
                      </div>
                      <span className="text-gray-400">{post.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "engagement" && (
          <div className="space-y-4">
            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center space-x-2">
                <Eye size={16} className="text-blue-600" />
                <span>Engagement Metrics</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Likes per Post</span>
                  <span className="text-sm font-semibold">{Math.round(analyticsData.totalLikes / analyticsData.totalPosts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Comments per Post</span>
                  <span className="text-sm font-semibold">{Math.round(analyticsData.totalComments / analyticsData.totalPosts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Share Rate</span>
                  <span className="text-sm font-semibold">{Math.round(analyticsData.totalShares / analyticsData.totalPosts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Follower Growth Rate</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">+{analyticsData.weeklyGrowth}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3">Engagement Tips</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="bg-green-500 rounded-full w-2 h-2 mt-1.5"></div>
                  <span>Post consistently to maintain engagement</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-500 rounded-full w-2 h-2 mt-1.5"></div>
                  <span>Use relevant hashtags for better visibility</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-purple-500 rounded-full w-2 h-2 mt-1.5"></div>
                  <span>Engage with comments to boost interaction</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;