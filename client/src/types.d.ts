declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profileBio?: string;
  roles?: string[];
  isActive: boolean;
  isLoggedIn?: boolean;
  kycStatus?: boolean;
  totalPosts?: number;
  likesReceived?: number;
  watchlistCount?: number;
  totalComments?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'investor' | 'expert';
  profile_image?: string;
  bio?: string;
  location?: string;
  risk_tolerance?: string;
  investment_style?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface VerifyOtpResponse {
  flow: 'login' | 'register';
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface VerifyRegistrationResponse {
  flow: 'login' | 'register';
  accessToken?: string;
  refreshToken?: string;
}

export interface Tribe {
  id: string;
  name: string;
  description: string;
  category: string;
  features?: string[];
  userId?: number;
  user?: {
    id: string;
    email?: string;
    phone?: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive?: boolean;
    roles?: string[];
  };
  price?: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  coverImageId?: number;
  coverImage?: FileResponse;
  // Optional fields
  memberCount?: number;
  tipsHits?: number;
  weeklyFeeds?: number;
  badges?: string[];
  rules?: string[];
}

export interface FileResponse {
  id: string;
  originalName: string;
  storedName: string;
  extension: string;
  mimeType: string;
  size: number;
  bucket: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTribeInput {
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price?: number;
  coverImageId?: number;
  rules?: string[];
  features?: {
    discussionPosts?: boolean;
    stockTips?: boolean;
    liveEvents?: boolean;
    premiumPolls?: boolean;
  };
}

export interface CreateTribeResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price?: number;
  coverImageId?: number;
  createdAt: string;
}

// Stock Tips Types
export interface StockTip {
  id: string;
  type: 'Stocks' | 'Futures' | 'Options' | 'Commodities';
  stockName: string;
  symbol: string;
  entryPrice: number;
  targetPrice: number;
  entryDate: string;
  exitDate?: string | null;
  reason?: string;
  userId: number;
  chartImageId?: number | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
  };
  chartImage?: FileResponse;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockTipInput {
 type: 'Stocks' | 'Futures' | 'Options' | 'Commodities';
  stockName: string;
  symbol: string;
  entryPrice: number;
  targetPrice: number;
  entryDate: string;
  exitDate?: string;
  reason?: string;
  chartImageId?: number;
}

export interface UpdateStockTipInput {
  stockName?: string;
  symbol?: string;
  entryPrice?: number;
  targetPrice?: number;
  entryDate?: string;
  exitDate?: string;
  reason?: string;
  chartImageId?: number;
}
