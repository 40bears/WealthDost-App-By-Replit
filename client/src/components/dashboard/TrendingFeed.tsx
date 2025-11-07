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

type FeedFilter = 'following' | 'trending' | 'latest' | 'popular';

interface FeedItem {
  id: string;
  type: 'post' | 'tip';
  data: any;
}

const mockFeedData: FeedItem[] = [
  {
    id: '1',
    type: 'post',
    data: {
      author: {
        name: 'Priya Mehta',
        username: '@ca_priya',
        initials: 'P',
      },
      content: 'What are your thoughts on investing in small-cap funds in the current market? Looking for some expert opinions.',
      tags: ['#tech', '#stocks', '#renewable'],
      likes: 24,
      comments: 7,
      timestamp: '2 days ago',
      isFollowing: false,
    },
  },
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
        {mockFeedData.map((item) => {
          if (item.type === 'post') {
            return <PostCard key={item.id} {...item.data} />;
          } else {
            return <TipCard key={item.id} {...item.data} />;
          }
        })}
      </div>
    </div>
  );
}