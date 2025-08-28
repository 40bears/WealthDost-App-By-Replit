import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Target, Calendar, User, Star, Plus, Heart, MessageCircle, Share, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import EnhancedCreatePostModal from "@/components/dashboard/EnhancedCreatePostModal";
import { useInteraction } from "@/lib/interactionContext";
import { CommentModal } from "@/components/ui/comment-modal";


// Demo stock tips data
const demoStockTips = [
  {
    id: '1',
    stockName: 'Apple Inc.',
    symbol: 'AAPL',
    tipType: 'buy' as const,
    entryPrice: 150.00,
    exitPrice: 165.00,
    targetDate: '2025-03-01',
    reasoning: 'Strong Q1 earnings expected, iPhone 16 sales momentum, and AI integration driving growth.',
    status: 'active' as const,
    createdAt: new Date('2025-01-15'),
    author: {
      name: 'Sarah Chen',
      avatar: '',
      isExpert: true,
      expertise: 'Tech Analyst'
    }
  },
  {
    id: '2',
    stockName: 'Tesla Inc.',
    symbol: 'TSLA',
    tipType: 'buy' as const,
    entryPrice: 185.00,
    exitPrice: 220.00,
    targetDate: '2025-04-15',
    reasoning: 'Model Y refresh and FSD improvements should boost sales. Energy storage segment growing rapidly.',
    status: 'active' as const,
    createdAt: new Date('2025-01-14'),
    author: {
      name: 'Alex Kumar',
      avatar: '',
      isExpert: true,
      expertise: 'EV Specialist'
    }
  },
  {
    id: '3',
    stockName: 'Microsoft Corp.',
    symbol: 'MSFT',
    tipType: 'sell' as const,
    entryPrice: 420.00,
    exitPrice: 395.00,
    targetDate: '2025-02-28',
    reasoning: 'Overvalued at current levels. Cloud growth slowing and AI spending not yet showing ROI.',
    status: 'completed' as const,
    createdAt: new Date('2025-01-10'),
    author: {
      name: 'David Park',
      avatar: '',
      isExpert: false,
      expertise: 'Individual Investor'
    }
  }
];

export default function StockTips() {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'active' | 'completed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
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

  const filteredTips = demoStockTips.filter(tip => {
    if (filter === 'all') return true;
    if (filter === 'buy' || filter === 'sell') return tip.tipType === filter;
    if (filter === 'active' || filter === 'completed') return tip.status === filter;
    return true;
  });

  const calculatePotentialReturn = (entryPrice: number, exitPrice: number, tipType: 'buy' | 'sell') => {
    if (tipType === 'buy') {
      return ((exitPrice - entryPrice) / entryPrice * 100).toFixed(1);
    } else {
      return ((entryPrice - exitPrice) / entryPrice * 100).toFixed(1);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-2 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Stock Tips</h1>
              <p className="text-sm text-gray-600">Expert recommendations & community insights</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-sm border border-blue-500/30 hover:border-blue-400 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {[
            { key: 'all', label: 'All Tips' },
            { key: 'buy', label: 'Buy' },
            { key: 'sell', label: 'Sell' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key as any)}
              className={`whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-xl ${
                filter === key 
                  ? 'shadow-lg hover:shadow-xl' 
                  : 'border-2 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stock Tips List */}
      <div className="p-4 pb-24 space-y-4">
        {filteredTips.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-8">
            <div className="p-6">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Stock Tips Found</h3>
              <p className="text-gray-500">Try adjusting your filter or check back later for new tips.</p>
            </div>
          </div>
        ) : (
          filteredTips.map((tip) => (
            <div key={tip.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl overflow-hidden">
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        tip.tipType === 'buy' 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/20' 
                          : 'bg-red-50 text-red-700 border-red-200 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/20'
                      }`}>
                        {tip.tipType === 'buy' ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{tip.stockName}</h3>
                        <p className="text-sm text-gray-600">{tip.symbol}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                      tip.status === 'active' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/20'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}>
                      {tip.status}
                    </div>
                    <div className={`px-3 py-1 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                      tip.tipType === 'buy'
                        ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-300 hover:shadow-md hover:shadow-green-500/20'
                        : 'bg-red-50 text-red-700 border-red-200 hover:border-red-300 hover:shadow-md hover:shadow-red-500/20'
                    }`}>
                      {tip.tipType.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Price Information */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 hover:shadow-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Entry Price</p>
                    <p className="font-bold text-lg">${tip.entryPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Target Price</p>
                    <p className="font-bold text-lg">${tip.exitPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Potential Return</p>
                    <p className={`font-bold text-lg ${
                      parseFloat(calculatePotentialReturn(tip.entryPrice, tip.exitPrice, tip.tipType)) > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {calculatePotentialReturn(tip.entryPrice, tip.exitPrice, tip.tipType)}%
                    </p>
                  </div>
                </div>

                {/* Target Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-blue-500/20">
                  <Calendar className="h-4 w-4" />
                  <span>Target Date: {formatDate(new Date(tip.targetDate))}</span>
                </div>

                {/* Reasoning */}
                {tip.reasoning && (
                  <div className="p-4 bg-blue-50/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                    <p className="text-sm text-gray-700">{tip.reasoning}</p>
                  </div>
                )}

                {/* Author Info & Follow Button */}
                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg">
                      {tip.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{tip.author.name}</p>
                        {tip.author.isExpert && (
                          <div className="p-1 bg-yellow-100 border-2 border-yellow-200 rounded-full">
                            <Star className="h-3 w-3 text-yellow-600 fill-current" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{tip.author.expertise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatDate(tip.createdAt)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-7 px-3 text-xs border-2 rounded-xl transition-all duration-300 active:scale-95 ${
                        isFollowing(tip.author.name) 
                          ? 'bg-purple-50/70 text-purple-600 border-purple-200 hover:bg-purple-100/70 hover:border-purple-300' 
                          : 'bg-white/70 text-gray-600 border-gray-200 hover:bg-gray-50/70 hover:border-gray-300'
                      }`}
                      onClick={() => toggleFollow(tip.author.name)}
                    >
                      {isFollowing(tip.author.name) ? (
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
                  </div>
                </div>

                {/* Interactive Buttons */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 text-xs border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-red-50/70 hover:backdrop-blur-sm ${
                      isLiked(tip.id) ? 'text-red-600 bg-red-50/70 backdrop-blur-sm border-red-200' : 'text-gray-500'
                    }`}
                    onClick={() => toggleLike(tip.id)}
                  >
                    <Heart size={14} className={`transition-all duration-300 ${isLiked(tip.id) ? 'fill-current' : ''}`} />
                    <span className="font-medium">{24 + (isLiked(tip.id) ? 1 : 0)}</span>
                  </Button>
                  
                  <CommentModal postId={tip.id} onAddComment={addComment}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-blue-50/70 hover:backdrop-blur-sm hover:text-blue-600"
                    >
                      <MessageCircle size={14} className="transition-all duration-300" />
                      <span className="font-medium">{8 + getCommentCount(tip.id)}</span>
                    </Button>
                  </CommentModal>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-xl transition-all duration-300 active:scale-95 hover:bg-gray-50/70 hover:backdrop-blur-sm hover:text-gray-600"
                    onClick={() => sharePost(tip.id)}
                  >
                    <Share size={14} className="transition-all duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="stock-tips" onTabChange={() => {}} />

      {/* Create Post Modal */}
      <EnhancedCreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          // In a real app, this would refresh the tips list
          console.log('Post created successfully');
        }}
      />


    </div>
  );
}