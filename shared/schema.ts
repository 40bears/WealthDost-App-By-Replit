// Minimal type definitions for frontend demo
export interface User {
  id: string;
  username: string;
  fullName?: string;
  profileBio?: string;
  profileImageUrl?: string;
  userType: 'investor' | 'expert';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  postType: string;
  tags?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  imageUrl?: string;
  isLiked?: boolean;
  isFollowing?: boolean;
  // Stock tip specific fields
  stockName?: string;
  symbol?: string;
  entryPrice?: number;
  exitPrice?: number;
  targetDate?: Date;
  tipType?: 'buy' | 'sell';
  reasoning?: string;
  status?: 'active' | 'completed' | 'expired';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
}

export interface Analytics {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowers: number;
  totalFollowing: number;
  weeklyGrowth: number;
  topPerformingPosts: Post[];
  engagementByDay: Array<{
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}

// Simple type exports for frontend use
export type PostType = 'discussion' | 'tweet' | 'stock_tip' | 'analysis' | 'news' | 'debate' | 'quiz';
export type UserType = 'investor' | 'expert';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TipType = 'buy' | 'sell';
export type PostStatus = 'active' | 'completed' | 'expired';