export interface FeedUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profile?: {
    profileBio?: string;
  };
}

export interface FeedHashtag {
  id: string;
  tagName: string;
  masterHashtag?: {
    id: string;
    tag: string;
  };
}

export interface FeedImage {
  id: string;
  path?: string;
  publicUrl?: string;
  originalName?: string;
}

export interface FeedPost {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  user: FeedUser;
  hashtags?: FeedHashtag[];
  image?: FeedImage;
}

export interface FeedStockTip {
  id: string;
  type: string;
  stockName: string;
  symbol: string;
  entryPrice: string | number;
  targetPrice: string | number;
  entryDate: string;
  exitDate?: string;
  reason?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  user: FeedUser;
  hashtags?: FeedHashtag[];
  chartImage?: FeedImage;
}

export interface FeedItem {
  id: string;
  type: 'post' | 'stock_tip';
  createdAt: string;
  score?: number;
  post?: FeedPost;
  stockTip?: FeedStockTip;
}

export interface FeedResponse {
  feed: {
    items: FeedItem[];
    hasMore: boolean;
    nextOffset: number;
  };
}

export interface FeedVariables {
  limit: number;
  offset: number;
  showFollowing?: boolean;
}
