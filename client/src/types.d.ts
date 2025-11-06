declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export interface User {
  id: number;
  uuid?: string;
  email: string;
  username: string;
  roles?: string[];
  isActive: boolean;
  isLoggedIn?: boolean;
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
  id: number;
  name: string;
  description: string;
  category: string;
  features?: string[];
  userId: number;
  user?: {
    id: number;
    email: string;
    phone: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: string[];
  };
  price?: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  coverImageId?: number;
  coverImage?: FileResponse;
  // Optional fields that might not be in DB yet
  member_count?: number;
  tips_hits?: number;
  weekly_feeds?: number;
  badges?: string[];
  rules?: string[];
}

export interface FileResponse {
  id: number;
  uuid: string;
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
  id: number;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  price?: number;
  coverImageId?: number;
  createdAt: string;
}
