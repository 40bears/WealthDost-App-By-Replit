import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Bell, Search, Plus, Users, Eye, Heart, MessageCircle, BarChart3, Newspaper, Star, ArrowLeft, X, ChevronDown, ChevronUp } from "lucide-react";

interface WatchlistAsset {
  id: number;
  symbol: string;
  name: string;
  assetType: string;
  exchange: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  theme?: string;
  tags: string[];
  hasAlert: boolean;
  sentiment?: {
    label: string;
    score: number;
    summary: string;
  };
  tribeStats?: {
    watcherCount: number;
    tribePercentage: number;
    trending: boolean;
  };
  news?: {
    headline: string;
    sentiment: string;
  };
  technicals?: {
    rsi: number;
    isNear52High: boolean;
  };
}

interface WatchlistTheme {
  id: number;
  name: string;
  description: string;
  followerCount: number;
  assetCount: number;
  isFollowing: boolean;
}

const Watchlist = () => {
  const [activeTab, setActiveTab] = useState<"my-watchlist" | "themed-lists" | "tribe-picks">("my-watchlist");
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<WatchlistAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAssets, setExpandedAssets] = useState<Set<number>>(new Set());

  // Mock data - replace with real API calls
  const watchlistAssets: WatchlistAsset[] = [
    {
      id: 1,
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      assetType: "stock",
      exchange: "NSE",
      currentPrice: 2456.75,
      priceChange: 23.45,
      priceChangePercent: 0.96,
      theme: "Energy",
      tags: ["Large Cap", "Energy"],
      hasAlert: true,
      sentiment: {
        label: "positive",
        score: 0.75,
        summary: "Strong quarterly results boost investor confidence"
      },
      tribeStats: {
        watcherCount: 89,
        tribePercentage: 45,
        trending: true
      },
      news: {
        headline: "Reliance Q3 results beat estimates",
        sentiment: "positive"
      },
      technicals: {
        rsi: 65,
        isNear52High: true
      }
    },
    {
      id: 2,
      symbol: "INFY",
      name: "Infosys Limited",
      assetType: "stock",
      exchange: "NSE",
      currentPrice: 1432.20,
      priceChange: -12.30,
      priceChangePercent: -0.85,
      theme: "Technology",
      tags: ["IT", "Large Cap"],
      hasAlert: false,
      sentiment: {
        label: "neutral",
        score: 0.15,
        summary: "Mixed reactions to guidance update"
      },
      tribeStats: {
        watcherCount: 156,
        tribePercentage: 78,
        trending: false
      }
    },
    {
      id: 3,
      symbol: "BTC-USD",
      name: "Bitcoin",
      assetType: "crypto",
      exchange: "CRYPTO",
      currentPrice: 42567.89,
      priceChange: 1234.56,
      priceChangePercent: 2.99,
      theme: "Crypto",
      tags: ["Cryptocurrency", "Volatile"],
      hasAlert: true,
      sentiment: {
        label: "positive",
        score: 0.65,
        summary: "Institutional adoption continues to drive prices"
      }
    }
  ];

  const themes: WatchlistTheme[] = [
    {
      id: 1,
      name: "Green Energy",
      description: "Clean and renewable energy stocks",
      followerCount: 2341,
      assetCount: 24,
      isFollowing: true
    },
    {
      id: 2,
      name: "AI Stocks",
      description: "Artificial Intelligence and Machine Learning companies",
      followerCount: 5678,
      assetCount: 31,
      isFollowing: false
    },
    {
      id: 3,
      name: "Dividend Picks",
      description: "High dividend yield stocks for income investors",
      followerCount: 3421,
      assetCount: 18,
      isFollowing: true
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "😊";
      case "negative": return "😟";
      default: return "😐";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const toggleAssetExpansion = (assetId: number) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <span className="material-icons text-lg">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Watchlist</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 text-purple-600"
              onClick={() => setShowAddAsset(true)}
            >
              <Plus size={20} />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search assets or add new ones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === "my-watchlist" 
                  ? "bg-white text-purple-600 shadow-sm" 
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("my-watchlist")}
            >
              My Watchlist
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === "themed-lists" 
                  ? "bg-white text-purple-600 shadow-sm" 
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("themed-lists")}
            >
              Themed Lists
            </button>
            <button
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === "tribe-picks" 
                  ? "bg-white text-purple-600 shadow-sm" 
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("tribe-picks")}
            >
              Tribe Picks
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === "my-watchlist" && (
          <div className="space-y-3">
            {watchlistAssets.map((asset) => {
              const isExpanded = expandedAssets.has(asset.id);
              return (
                <Card key={asset.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-sm">{asset.symbol}</h3>
                          <Badge variant="outline" className="text-xs">
                            {asset.exchange}
                          </Badge>
                          {asset.hasAlert && (
                            <Bell size={12} className="text-orange-500" />
                          )}
                          {asset.tribeStats?.trending && (
                            <span className="text-xs">🔥</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{asset.name}</p>
                        
                        {/* Price Info */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {asset.assetType === "crypto" ? "$" : "₹"}{asset.currentPrice.toLocaleString()}
                            </span>
                            <div className={`flex items-center space-x-1 ${
                              asset.priceChange >= 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {asset.priceChange >= 0 ? (
                                <TrendingUp size={12} />
                              ) : (
                                <TrendingDown size={12} />
                              )}
                              <span className="text-xs">
                                {asset.priceChange >= 0 ? "+" : ""}{asset.priceChangePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {/* Alert and Chart Buttons */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1"
                              onClick={() => {
                                setSelectedAsset(asset);
                                setShowCreateAlert(true);
                              }}
                            >
                              <Bell size={10} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1"
                            >
                              <BarChart3 size={10} />
                            </Button>
                            
                            {/* Expand/Collapse Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={() => toggleAssetExpansion(asset.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp size={16} className="text-gray-400" />
                              ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="space-y-3">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {asset.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Sentiment */}
                            {asset.sentiment && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{getSentimentIcon(asset.sentiment.label)}</span>
                                <span className={`text-xs ${getSentimentColor(asset.sentiment.label)}`}>
                                  {asset.sentiment.summary}
                                </span>
                              </div>
                            )}

                            {/* Tribe Stats */}
                            {asset.tribeStats && (
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Users size={12} />
                                  <span>{asset.tribeStats.watcherCount} watching</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye size={12} />
                                  <span>{asset.tribeStats.tribePercentage}% of tribe</span>
                                </div>
                              </div>
                            )}

                            {/* News Highlight */}
                            {asset.news && (
                              <div className="bg-blue-50 p-2 rounded text-xs">
                                <div className="flex items-center space-x-1">
                                  <Newspaper size={12} className="text-blue-600" />
                                  <span className="text-blue-800">{asset.news.headline}</span>
                                </div>
                              </div>
                            )}

                            {/* Technical Indicators */}
                            {asset.technicals && (
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span>RSI: {asset.technicals.rsi}</span>
                                {asset.technicals.isNear52High && (
                                  <Badge variant="outline" className="text-xs text-orange-600">
                                    Near 52W High
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* CTAs */}
                            <div className="grid grid-cols-3 gap-1">
                              <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                <MessageCircle size={10} className="mr-1" />
                                Discuss
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs px-2 py-1 hover:bg-purple-50 hover:text-purple-600"
                                onClick={() => window.location.href = "/expert/1"}
                              >
                                <Plus size={10} className="mr-1" />
                                Portfolio
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs px-2 py-1 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => window.location.href = "/experts"}
                              >
                                <Star size={10} className="mr-1" />
                                Expert
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "themed-lists" && (
          <div className="space-y-3">
            {themes.map((theme) => (
              <Card key={theme.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm">{theme.name}</h3>
                        {theme.isFollowing && (
                          <Badge className="text-xs bg-purple-100 text-purple-700">
                            Following
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{theme.description}</p>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users size={12} />
                          <span>{theme.followerCount.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 size={12} />
                          <span>{theme.assetCount} assets</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={theme.isFollowing ? "outline" : "default"}
                      size="sm"
                      className="text-xs ml-3"
                    >
                      {theme.isFollowing ? (
                        <>
                          <Heart size={12} className="mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <Heart size={12} className="mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "tribe-picks" && (
          <div className="space-y-3">
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Most Watched by Your Tribes</h3>
              <p className="text-sm text-gray-500 mb-4">
                Discover what assets are trending in your investment communities
              </p>
              <Button 
                className="bg-purple-600 text-white"
                onClick={() => {
                  // Navigate to a dedicated Tribe joining/selection screen
                  alert("Navigating to Tribe selection screen...");
                  // In a real app, this would redirect to a tribes page
                  // window.location.href = "/tribes";
                }}
              >
                Join a Tribe to See Picks
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add to Watchlist</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddAsset(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Search Asset</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm" 
                    placeholder="Enter symbol or company name (e.g., RELIANCE, AAPL, BTC)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Asset Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="etf">ETF</SelectItem>
                      <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Theme (Optional)</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Assign to theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Actions</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-purple-600" />
                      <span className="text-sm">Set price alert</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-purple-600" />
                      <span className="text-sm">Enable news alerts</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddAsset(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 text-white"
                  onClick={() => setShowAddAsset(false)}
                >
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateAlert && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create Alert for {selectedAsset.symbol}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowCreateAlert(false);
                    setSelectedAsset(null);
                  }}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Alert Type</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_above">Price goes above</SelectItem>
                      <SelectItem value="price_below">Price goes below</SelectItem>
                      <SelectItem value="volume_spike">Volume spike</SelectItem>
                      <SelectItem value="news_keyword">News keyword</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Target Price</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">₹</span>
                    <input 
                      type="number" 
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-sm" 
                      placeholder="2500.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Notification Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-purple-600" defaultChecked />
                      <span className="text-sm">In-app notification</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-purple-600" />
                      <span className="text-sm">Push notification</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-purple-600" />
                      <span className="text-sm">Email notification</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowCreateAlert(false);
                    setSelectedAsset(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 text-white"
                  onClick={() => {
                    setShowCreateAlert(false);
                    setSelectedAsset(null);
                  }}
                >
                  Create Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding for safe area */}
      <div className="h-20"></div>
    </div>
  );
};

export default Watchlist;