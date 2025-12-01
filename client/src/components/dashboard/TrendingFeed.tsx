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
import { usePosts } from '@/hooks/graphql';

type FeedFilter = 'following' | 'trending' | 'latest' | 'popular';

interface FeedItem {
  id: string;
  type: 'post' | 'tip';
  data: any;
}

const mockFeedData: FeedItem[] = [
  {
    id: '2',
    type: 'tip',
    data: {
      author: {
        name: 'CA Ankit Sharma',
        username: '@ca_ankit',
        initials: 'CA',
      },
      stock: {
        name: 'Apple Inc.',
        symbol: 'AAPL',
        change: '+10.0%',
      },
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
  },
  {
    id: '3',
    type: 'tip',
    data: {
      author: {
        name: 'CA Ankit Sharma',
        username: '@ca_ankit',
        initials: 'CA',
      },
      stock: {
        name: 'Apple Inc.',
        symbol: 'AAPL',
        change: '+10.0%',
      },
      entryPrice: '₹150',
      targetPrice: '₹165',
      buyDate: '12/09',
      sellDate: '12/10',
      reasoning: 'Strong Q1 earnings expected, iPhone 16 sales momentum, and AI integration driving growth.',
      chartImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop',
      likes: 24,
      comments: 8,
      isFollowing: true,
    },
  },
];

export function TrendingFeed() {
  const [filter, setFilter] = useState<FeedFilter>('following');
  const { data: postsData, loading } = usePosts();
  const posts = (postsData as { posts: any[] })?.posts || [];

  // Transform GraphQL posts to FeedItem format
  const postFeedItems: FeedItem[] = posts.map((post) => ({
    id: post.id.toString(),
    type: 'post' as const,
    data: {
      author: {
        name: `${post.user.firstName} ${post.user.lastName}`,
        username: `@user${post.user.id}`,
        initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
      },
      content: post.content,
      tags: [], // TODO: extract hashtags from content
      likes: 0, // Not available yet
      comments: 0, // Not available yet
      timestamp: new Date(post.createdAt).toLocaleDateString(),
      isFollowing: false,
      image: post.image?.path,
    },
  }));

  // Combine real posts with mock tips
  const feedData = [...postFeedItems, ...mockFeedData];

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
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        ) : feedData.length > 0 ? (
          feedData.map((item) => {
            if (item.type === 'post') {
              return <PostCard key={item.id} {...item.data} />;
            } else {
              return <TipCard key={item.id} {...item.data} />;
            }
          })
        ) : (
          <div className="text-center py-8 text-gray-500">No posts yet</div>
        )}
      </div>
    </div>
  );
}