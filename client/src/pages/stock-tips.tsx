import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedCreatePostModal from "@/components/dashboard/EnhancedCreatePostModal";
import { TipCard } from "@/components/dashboard/TipCard";
import { useStockTips } from "@/hooks/graphql";
import { PullToRefresh } from "@/components/common/PullToRefresh";

export default function StockTips() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'live' | 'close'>('live');

  // Fetch stock tips using GraphQL
  const { data, loading: isLoading, error, refetch } = useStockTips();
  const stockTips = data?.stockTips || [];

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    await refetch();
  };

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
      id: tip.id,
      author: {
        id: tip.user?.id?.toString() || tip.userId?.toString() || '',
        uuid: tip.user?.id?.toString() || tip.userId?.toString() || '',
        name: tip.user ? `${tip.user.firstName} ${tip.user.lastName}`.trim() : 'User',
        username: tip.user?.username ? `@${tip.user.username}` : `@user${tip.userId}`,
        avatar: tip.user?.avatar,
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
      likes: tip.likeCount || 0,
      comments: tip.commentCount || 0,
      isLikedByMe: tip.isLikedByMe || false,
      tribe: tip.tribe ? {
        id: parseInt(tip.tribe.id),
        name: tip.tribe.name
      } : undefined
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-gray-600">Expert recommendations & community insights</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 px-4 pb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { key: 'live', label: 'Live' },
            { key: 'close', label: 'Close' },
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

      {/* Stock Tips List with Pull to Refresh */}
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1 min-h-0"
      >
        <div className="p-4 pb-24 space-y-4">
        {mappedTips.length > 0 ? (
          mappedTips.map((tip) => (
            <TipCard key={tip.id.toString()} {...tip} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No stock tips found</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to share a stock tip!</p>
          </div>
        )}
        </div>
      </PullToRefresh>

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