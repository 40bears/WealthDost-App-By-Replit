import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PostCard } from './PostCard';
import { TipCard } from './TipCard';
import { useFeed } from '@/hooks/graphql';
import { formatDate } from '@/lib/utils';
import type { FeedItem as ApiFeedItem } from '@/graphql/feed/types';

interface FeedItem {
  id: string;
  type: 'post' | 'tip';
  data: any;
}

export function TrendingFeed() {
  const [showFollowing, setShowFollowing] = useState(false);
  const limit = 20;

  const { data, loading } = useFeed({
    limit,
    offset: 0,
    showFollowing,
  });

  const feedItems = data?.feed?.items || [];

  // Helper function to transform minio URLs for local development
  const transformImageUrl = (url: string) => {
    if (!url) return undefined;
    return url.replace('http://minio:', 'http://localhost:');
  };

  // Transform feed items to component props format
  const feedData: FeedItem[] = feedItems.map((item: ApiFeedItem) => {
    // Normalize type to handle both uppercase and lowercase variants
    const itemType = item.type.toLowerCase();

    if (itemType === 'post' && item.post) {
      const post = item.post;
      const tags = post.hashtags?.map(h => h.masterHashtag?.tag || h.tagName) || [];

      return {
        id: post.id,
        type: 'post' as const,
        data: {
          id: post.id,
          author: {
            id: post.user.id,
            name: `${post.user.firstName} ${post.user.lastName}`,
            username: post.user.username ? `@${post.user.username}` : `@user${post.user.id}`,
            avatar: '',
            initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
            uuid: post.user.id,
          },
          content: post.content,
          tags,
          likes: post.likeCount || 0,
          comments: post.commentCount || 0,
          timestamp: formatDate(post.createdAt),
          image: post.image?.publicUrl ? transformImageUrl(post.image.publicUrl) : post.image?.path,
          isLikedByMe: post.isLikedByMe || false,
        },
      };
    } else if (itemType === 'stock_tip' && item.stockTip) {
      const tip = item.stockTip;
      const entryPrice = typeof tip.entryPrice === 'string' ? parseFloat(tip.entryPrice) : tip.entryPrice;
      const targetPrice = typeof tip.targetPrice === 'string' ? parseFloat(tip.targetPrice) : tip.targetPrice;

      return {
        id: tip.id,
        type: 'tip' as const,
        data: {
          id: tip.id,
          author: {
            id: tip.user.id,
            name: `${tip.user.firstName} ${tip.user.lastName}`.trim(),
            username: tip.user.username ? `@${tip.user.username}` : `@user${tip.user.id}`,
            avatar: '',
            initials: `${tip.user.firstName?.[0] || ''}${tip.user.lastName?.[0] || ''}`,
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
        },
      };
    }

    // Fallback for unknown types
    return {
      id: item.id,
      type: 'post' as const,
      data: {},
    };
  }).filter(item => item.data.id); // Filter out any invalid items

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