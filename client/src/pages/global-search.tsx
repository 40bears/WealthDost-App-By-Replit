import { useState, useEffect } from "react";
import { ArrowLeft, Search, User, Hash, MessageSquare, Star, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import FloatingCreateButton from "@/components/FloatingCreateButton";

// Demo data for search results
const demoUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarahc_trades',
    avatar: '',
    isExpert: true,
    expertise: 'Tech Analyst',
    followers: 43200,
    verified: true
  },
  {
    id: '2',
    name: 'Alex Kumar',
    username: '@alex_investing',
    avatar: '',
    isExpert: true,
    expertise: 'EV Specialist',
    followers: 28100,
    verified: true
  },
  {
    id: '3',
    name: 'David Park',
    username: '@davidp_stocks',
    avatar: '',
    isExpert: false,
    expertise: 'Individual Investor',
    followers: 8500,
    verified: false
  }
];

const demoHashtags = [
  {
    id: '1',
    tag: 'TechStocks',
    postCount: 15420,
    trending: true
  },
  {
    id: '2',
    tag: 'InvestmentTips',
    postCount: 8930,
    trending: false
  },
  {
    id: '3',
    tag: 'MarketAnalysis',
    postCount: 12650,
    trending: true
  }
];

const demoPosts = [
  {
    id: '1',
    content: 'Apple stock showing strong momentum after Q1 earnings beat. Revenue up 8% YoY with services segment driving growth.',
    author: {
      name: 'Sarah Chen',
      username: '@sarahc_trades',
      avatar: '',
      isExpert: true
    },
    createdAt: new Date('2025-01-20'),
    likes: 234,
    comments: 45,
    hashtags: ['AAPL', 'TechStocks']
  },
  {
    id: '2',
    content: 'Tesla Model Y refresh announcement could be a catalyst for the stock. Watching for entry around $185-190 range.',
    author: {
      name: 'Alex Kumar',
      username: '@alex_investing',
      avatar: '',
      isExpert: true
    },
    createdAt: new Date('2025-01-19'),
    likes: 187,
    comments: 32,
    hashtags: ['TSLA', 'EVStocks']
  }
];

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'hashtags' | 'posts'>('all');
  const [location] = useLocation();

  // Check for URL parameters and populate search on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  const filteredUsers = demoUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHashtags = demoHashtags.filter(hashtag => 
    hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = demoPosts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const renderSearchResults = () => {
    if (!searchQuery.trim()) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Search WealthDost</h3>
          <p className="text-gray-500">Find users, hashtags, and posts</p>
        </div>
      );
    }

    const hasResults = filteredUsers.length > 0 || filteredHashtags.length > 0 || filteredPosts.length > 0;

    if (!hasResults) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Users Section */}
        {(activeTab === 'all' || activeTab === 'users') && filteredUsers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Users</h3>
              <Badge variant="secondary">{filteredUsers.length}</Badge>
            </div>
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{user.name}</h4>
                            {user.verified && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.expertise}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-2 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95">
                          Follow
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFollowers(user.followers)} followers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Section */}
        {(activeTab === 'all' || activeTab === 'hashtags') && filteredHashtags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Hashtags</h3>
              <Badge variant="secondary">{filteredHashtags.length}</Badge>
            </div>
            <div className="space-y-3">
              {filteredHashtags.map((hashtag) => (
                <div key={hashtag.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-green-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100/70 backdrop-blur-sm p-2 rounded-lg border-2 border-green-200 hover:border-green-300 transition-all duration-300">
                          <Hash className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">#{hashtag.tag}</h4>
                          <p className="text-sm text-gray-600">
                            {hashtag.postCount.toLocaleString()} posts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hashtag.trending && (
                          <Badge variant="default" className="bg-orange-100/70 backdrop-blur-sm text-orange-700 border-2 border-orange-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/20 transition-all duration-300">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" className="border-2 hover:border-green-300 hover:shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 active:scale-95">
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {(activeTab === 'all' || activeTab === 'posts') && filteredPosts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Posts</h3>
              <Badge variant="secondary">{filteredPosts.length}</Badge>
            </div>
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{post.author.name}</h4>
                          <p className="text-xs text-gray-500">{post.author.username}</p>
                          <p className="text-xs text-gray-500">·</p>
                          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                        <p className="text-sm text-gray-800 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <div className="flex gap-1">
                            {post.hashtags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs border-2 hover:border-purple-300 hover:shadow-sm hover:shadow-purple-500/20 transition-all duration-300">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg">
        <div className="flex items-center gap-3 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="p-2 border-2 border-transparent hover:border-gray-300 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, hashtags, and posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 rounded-xl"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'users', label: 'Users' },
            { key: 'hashtags', label: 'Hashtags' },
            { key: 'posts', label: 'Posts' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(key as any)}
              className={`whitespace-nowrap border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                activeTab === key 
                  ? 'shadow-lg hover:shadow-xl' 
                  : 'border-2 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4 pb-24">
        {renderSearchResults()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}