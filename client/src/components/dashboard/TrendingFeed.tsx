import { useState } from 'react';
import { ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PostCard } from './PostCard';
import { TipCard } from './TipCard';
import { usePosts, useStockTips } from '@/hooks/graphql';

type FeedFilter = 'following' | 'trending' | 'latest' | 'popular';

interface FeedItem {
  id: string;
  type: 'post' | 'tip';
  data: any;
}

export function TrendingFeed() {
  const [filter, setFilter] = useState<FeedFilter>('following');
  const { data: postsData, loading: loadingPosts } = usePosts();
  const { data: stockTipsData, loading: loadingStockTips } = useStockTips();

  const posts = (postsData as { posts: any[] })?.posts || [];
  const stockTips = (stockTipsData as { stockTips: any[] })?.stockTips || [];
  const loading = loadingPosts || loadingStockTips;

  // Helper function to transform minio URLs for local development
  const transformImageUrl = (url: string) => {
    if (!url) return undefined;
    return url.replace('http://minio:', 'http://localhost:');
  };

  // Transform GraphQL posts to FeedItem format
  const postFeedItems: FeedItem[] = posts.map((post) => ({
    id: post.id.toString(),
    type: 'post' as const,
    data: {
      id: post.id,
      author: {
        name: `${post.user.firstName} ${post.user.lastName}`,
        username: `@user${post.user.id}`,
        initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
      },
      content: post.content,
      tags: [], // TODO: extract hashtags from content
      likes: post.likeCount || 0,
      comments: 0, // Not available yet
      timestamp: new Date(post.createdAt).toLocaleDateString(),
      isFollowing: false,
      image: post.image?.path,
      isLikedByMe: post.isLikedByMe || false,
    },
  }));

  // Transform GraphQL stock tips to FeedItem format
  const stockTipFeedItems: FeedItem[] = stockTips.map((tip) => {
    const entryPrice = typeof tip.entryPrice === 'string' ? parseFloat(tip.entryPrice) : tip.entryPrice;
    const targetPrice = typeof tip.targetPrice === 'string' ? parseFloat(tip.targetPrice) : tip.targetPrice;

    return {
      id: tip.id.toString(),
      type: 'tip' as const,
      data: {
        id: tip.id,
        author: {
          name: tip.user ? `${tip.user.firstName} ${tip.user.lastName}`.trim() : 'User',
          username: tip.user?.username ? `@${tip.user.username}` : `@user${tip.userId}`,
          initials: tip.user ? `${tip.user.firstName?.[0] || ''}${tip.user.lastName?.[0] || ''}` : 'U',
        },
        stock: {
          name: tip.stockName,
          symbol: tip.symbol,
          change: `${((targetPrice - entryPrice) / entryPrice * 100).toFixed(1)}%`,
        },
        entryPrice: `₹${entryPrice.toFixed(2)}`,
        targetPrice: `₹${targetPrice.toFixed(2)}`,
        buyDate: new Date(tip.entryDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        sellDate: tip.exitDate ? new Date(tip.exitDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : 'N/A',
        reasoning: tip.reason || '',
        chartImage: tip.chartImage?.publicUrl ? transformImageUrl(tip.chartImage.publicUrl) : undefined,
        likes: tip.likeCount || 0,
        comments: 0, // Not available yet
        isFollowing: false,
        isLikedByMe: tip.isLikedByMe || false,
      },
    };
  });

  // Combine real posts and stock tips
  const feedData = [...postFeedItems, ...stockTipFeedItems];

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Trending</h2>
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-gray-500" />
          <Select value={filter} onValueChange={(value) => setFilter(value as FeedFilter)}>
            <SelectTrigger className="w-auto h-8 border-none shadow-none [&>svg]:hidden px-0 focus:ring-0 focus:ring-offset-0 bg-transparent hover:bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <SelectItem value="following">Following</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading feed...</div>
        ) : feedData.length > 0 ? (
          feedData.map((item) => {
            if (item.type === 'post') {
              return <PostCard key={item.id} {...item.data} />;
            } else {
              return <TipCard key={item.id} {...item.data} />;
            }
          })
        ) : (
          <div className="text-center py-8 text-gray-500">No posts or stock tips yet</div>
        )}
      </div>
    </div>
  );
}