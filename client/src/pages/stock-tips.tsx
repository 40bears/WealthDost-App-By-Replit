import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedCreatePostModal from "@/components/dashboard/EnhancedCreatePostModal";
import { TipCard } from "@/components/dashboard/TipCard";
import { apiClient } from "@/lib/api";

// Demo stock tips data
const demoStockTips = [
  {
    id: '1',
    author: { name: 'CA Ankit Sharma', username: '@ca_ankit', initials: 'CA' },
    stock: { name: 'Apple Inc.', symbol: 'AAPL', change: '+10.0%' },
    entryPrice: '₹150',
    targetPrice: '₹165',
    buyDate: '12/09',
    sellDate: '12/10',
    reasoning: 'Strong Q1 earnings expected, iPhone 16 sales momentum, and AI integration driving growth.',
    chartImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    likes: 24,
    comments: 8,
    isFollowing: false,
  },
  {
    id: '2',
    author: { name: 'Sarah Chen', username: '@sarah_tech', initials: 'SC' },
    stock: { name: 'Tesla Inc.', symbol: 'TSLA', change: '+15.5%' },
    entryPrice: '₹185',
    targetPrice: '₹220',
    buyDate: '12/08',
    sellDate: '12/15',
    reasoning: 'Model Y refresh and FSD improvements should boost sales. Energy storage segment growing rapidly.',
    likes: 32,
    comments: 12,
    isFollowing: true,
  },
  {
    id: '3',
    author: { name: 'Rajesh Kumar', username: '@raj_invest', initials: 'RK' },
    stock: { name: 'Reliance Industries', symbol: 'RELIANCE', change: '+8.2%' },
    entryPrice: '₹2,450',
    targetPrice: '₹2,650',
    buyDate: '12/10',
    sellDate: '12/20',
    reasoning: 'Strong retail segment growth and new energy ventures showing promise. Jio platforms expansion continues.',
    chartImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop',
    likes: 45,
    comments: 15,
    isFollowing: false,
  },
  {
    id: '4',
    author: { name: 'Priya Mehta', username: '@priya_stocks', initials: 'PM' },
    stock: { name: 'Infosys Ltd.', symbol: 'INFY', change: '+6.8%' },
    entryPrice: '₹1,520',
    targetPrice: '₹1,625',
    buyDate: '12/11',
    sellDate: '12/18',
    reasoning: 'Digital transformation deals pipeline strong. Cloud migration services seeing increased demand.',
    chartImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=400&fit=crop',
    likes: 28,
    comments: 9,
    isFollowing: true,
  },
  {
    id: '5',
    author: { name: 'Alex Kumar', username: '@alex_ev', initials: 'AK' },
    stock: { name: 'Tata Motors', symbol: 'TATAMOTORS', change: '+12.3%' },
    entryPrice: '₹625',
    targetPrice: '₹700',
    buyDate: '12/09',
    sellDate: '12/16',
    reasoning: 'EV segment gaining traction. JLR sales improving in key markets. Strong order book for commercial vehicles.',
    likes: 38,
    comments: 11,
    isFollowing: false,
  },
  {
    id: '6',
    author: { name: 'David Park', username: '@david_fin', initials: 'DP' },
    stock: { name: 'HDFC Bank', symbol: 'HDFCBANK', change: '+5.5%' },
    entryPrice: '₹1,650',
    targetPrice: '₹1,740',
    buyDate: '12/12',
    sellDate: '12/19',
    reasoning: 'Post-merger synergies materializing well. Asset quality improving and NIM expansion expected.',
    chartImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
    likes: 31,
    comments: 10,
    isFollowing: true,
  },
  {
    id: '7',
    author: { name: 'Neha Sharma', username: '@neha_pharma', initials: 'NS' },
    stock: { name: 'Sun Pharma', symbol: 'SUNPHARMA', change: '+9.1%' },
    entryPrice: '₹1,180',
    targetPrice: '₹1,290',
    buyDate: '12/10',
    sellDate: '12/17',
    reasoning: 'US FDA approvals pipeline strong. Specialty segment showing robust growth. Generic launches on track.',
    likes: 26,
    comments: 7,
    isFollowing: false,
  },
  {
    id: '8',
    author: { name: 'Vikram Singh', username: '@vikram_tech', initials: 'VS' },
    stock: { name: 'TCS Ltd.', symbol: 'TCS', change: '+7.4%' },
    entryPrice: '₹3,520',
    targetPrice: '₹3,780',
    buyDate: '12/11',
    sellDate: '12/20',
    reasoning: 'Large deal wins momentum continuing. BFSI vertical showing strong growth. Margin improvement expected.',
    chartImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    likes: 42,
    comments: 14,
    isFollowing: true,
  },
  {
    id: '9',
    author: { name: 'Amit Patel', username: '@amit_energy', initials: 'AP' },
    stock: { name: 'Adani Green', symbol: 'ADANIGREEN', change: '+11.2%' },
    entryPrice: '₹1,850',
    targetPrice: '₹2,050',
    buyDate: '12/09',
    sellDate: '12/16',
    reasoning: 'Renewable energy capacity additions on track. Government policy support strong. International expansion plans.',
    chartImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    likes: 35,
    comments: 13,
    isFollowing: false,
  },
  {
    id: '10',
    author: { name: 'Sneha Reddy', username: '@sneha_fmcg', initials: 'SR' },
    stock: { name: 'ITC Ltd.', symbol: 'ITC', change: '+6.3%' },
    entryPrice: '₹425',
    targetPrice: '₹455',
    buyDate: '12/12',
    sellDate: '12/19',
    reasoning: 'FMCG segment gaining market share. Hotels business recovery strong. Cigarette volumes stable.',
    likes: 29,
    comments: 8,
    isFollowing: true,
  },
];

export default function StockTips() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'active' | 'completed'>('all');

  // Fetch stock tips using TanStack Query
  const { data: stockTips = [], isLoading, error } = useQuery({
    queryKey: ['stock-tips'],
    queryFn: async () => {
      const response = await apiClient.stock_tips.$get();
      return response;
    }
  });

  // Helper function to transform minio URLs for local development
  const transformImageUrl = (url: string) => {
    return url.replace('http://minio:', 'http://localhost:');
  };

  // Map API data to TipCard format
  const mappedTips = stockTips.map((tip) => {
    // Convert prices to numbers in case backend returns them as strings
    const entryPrice = typeof tip.entryPrice === 'string' ? parseFloat(tip.entryPrice) : tip.entryPrice;
    const targetPrice = typeof tip.targetPrice === 'string' ? parseFloat(tip.targetPrice) : tip.targetPrice;

    return {
      id: tip.id.toString(),
      author: {
        name: tip.user ? `${tip.user.firstName} ${tip.user.lastName}`.trim() : 'User',
        username: tip.user?.username ? `@${tip.user.username}` : `@user${tip.userId}`,
        initials: tip.user ? `${tip.user.firstName?.[0] || ''}${tip.user.lastName?.[0] || ''}` : 'U'
      },
      stock: {
        name: tip.stockName,
        symbol: tip.symbol,
        change: `${((targetPrice - entryPrice) / entryPrice * 100).toFixed(1)}%`
      },
      entryPrice: `₹${entryPrice.toFixed(2)}`,
      targetPrice: `₹${targetPrice.toFixed(2)}`,
      buyDate: new Date(tip.entryDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      sellDate: tip.exitDate ? new Date(tip.exitDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : undefined,
      reasoning: tip.reason || '',
      chartImage: tip.chartImage?.publicUrl ? transformImageUrl(tip.chartImage.publicUrl) : undefined,
      likes: 0,
      comments: 0,
      isFollowing: false
    };
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock tips...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading stock tips</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold">Stock Tips</h1>
              <p className="text-sm text-gray-600">Expert recommendations & community insights</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 px-4 pb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { key: 'all', label: 'All Tips' },
            { key: 'buy', label: 'Buy' },
            { key: 'sell', label: 'Sell' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Tips List */}
      <div className="p-4 pb-24 space-y-4">
        {mappedTips.length > 0 ? (
          mappedTips.map((tip) => (
            <TipCard key={tip.id} {...tip} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No stock tips found</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to share a stock tip!</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <EnhancedCreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          console.log('Post created successfully');
        }}
      />
    </div>
  );
}