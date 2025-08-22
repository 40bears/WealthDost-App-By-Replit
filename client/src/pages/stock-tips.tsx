import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Target, Calendar, User, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import EnhancedCreatePostModal from "@/components/dashboard/EnhancedCreatePostModal";
import FloatingCreateButton from "@/components/FloatingCreateButton";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-2"
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
              className="whitespace-nowrap"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stock Tips List */}
      <div className="p-4 pb-24 space-y-4">
        {filteredTips.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Stock Tips Found</h3>
              <p className="text-gray-500">Try adjusting your filter or check back later for new tips.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        tip.tipType === 'buy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tip.tipType === 'buy' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{tip.stockName}</h3>
                        <p className="text-sm text-gray-600">{tip.symbol}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={tip.status === 'active' ? 'default' : 'secondary'}>
                      {tip.status}
                    </Badge>
                    <Badge variant={tip.tipType === 'buy' ? 'default' : 'destructive'}>
                      {tip.tipType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price Information */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Target Date: {formatDate(new Date(tip.targetDate))}</span>
                </div>

                {/* Reasoning */}
                {tip.reasoning && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{tip.reasoning}</p>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={tip.author.avatar} />
                      <AvatarFallback>
                        {tip.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{tip.author.name}</p>
                        {tip.author.isExpert && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{tip.author.expertise}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(tip.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="tips" onTabChange={() => {}} />

      {/* Create Post Modal */}
      <EnhancedCreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          // In a real app, this would refresh the tips list
          console.log('Post created successfully');
        }}
      />

      {/* Floating Create Button */}
      <FloatingCreateButton />
    </div>
  );
}