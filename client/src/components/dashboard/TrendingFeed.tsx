import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PostCard } from './PostCard';
import { TipCard } from './TipCard';
import { usePublicPosts, usePublicStockTips } from '@/hooks/graphql';
import { formatDate } from '@/lib/utils';

interface FeedItem {
  id: string;
  type: 'post' | 'tip';
  data: any;
}

export function TrendingFeed() {
  const [showFollowing, setShowFollowing] = useState(false);
  const { data: postsData, loading: loadingPosts } = usePublicPosts();
  const { data: stockTipsData, loading: loadingStockTips } = usePublicStockTips();

  const posts = (postsData as { publicPosts: any[] })?.publicPosts || [];
  const stockTips = (stockTipsData as { publicStockTips: any[] })?.publicStockTips || [];
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
        id: post.user.id.toString(),
        name: `${post.user.firstName} ${post.user.lastName}`,
        username: post.user.username ? `@${post.user.username}` : `@user${post.user.id}`,
        initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
      },
      content: post.content,
      tags: [], // TODO: extract hashtags from content
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      timestamp: formatDate(post.createdAt),
      isFollowing: false,
      image: post.image?.path,
      isLikedByMe: post.isLikedByMe || false,
      tribe: post.tribe ? { id: post.tribe.id, name: post.tribe.name } : undefined,
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
          id: tip.user?.id?.toString() || 'unknown',
          name: tip.user ? `${tip.user.firstName} ${tip.user.lastName}`.trim() : 'User',
          username: tip.user?.username ? `@${tip.user.username}` : `@user${tip.user?.id || 'unknown'}`,
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
        comments: tip.commentCount || 0,
        isFollowing: false,
        isLikedByMe: tip.isLikedByMe || false,
        tribe: tip.tribe ? { id: tip.tribe.id, name: tip.tribe.name } : undefined,
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
          <Checkbox
            id="show-following"
            checked={showFollowing}
            onCheckedChange={(checked) => setShowFollowing(!!checked)}
          />
          <Label
            htmlFor="show-following"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Show following
          </Label>
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