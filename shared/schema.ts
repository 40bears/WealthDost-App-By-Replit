import mongoose, { Schema, Document, Types } from "mongoose";
import { z } from "zod";

// Base interfaces for TypeScript types
export interface BaseUser {
  username: string;
  password: string;
  fullName?: string;
  profileBio?: string;
  profileImageUrl?: string;
  userType: 'investor' | 'expert';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}

export interface InvestorData {
  interests?: string[];
  riskPersona?: 'owl' | 'fox' | 'shark';
  riskLevel?: 'low' | 'moderate' | 'high';
  returnTarget?: '5-8%' | '10-15%' | '20%+';
}

export interface ExpertData {
  education?: string;
  achievements?: string[];
  specializations?: string[];
  expertPersona?: 'owl' | 'fox' | 'shark';
  isVerified: boolean;
}

// User document interface with embedded profile data
export interface User extends BaseUser, Document {
  _id: Types.ObjectId;
  investorProfile?: InvestorData;
  expertProfile?: ExpertData;
}

// Post interface
export interface Post extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  postType: string;
  tags?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
}

// Market data interface
export interface MarketData extends Document {
  _id: Types.ObjectId;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  updatedAt: Date;
}

// Investment rooms interface
export interface InvestmentRoom extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  creatorId: Types.ObjectId;
  isPremium: boolean;
  premiumPrice?: number;
  isSponsored: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
  category: string;
  memberCount: number;
  createdAt: Date;
}

// Watchlist assets interface
export interface WatchlistAsset extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: Date;
}

// Price alerts interface
export interface PriceAlert extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  symbol: string;
  targetPrice: number;
  alertType: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

// Watchlist themes interface
export interface WatchlistTheme extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  assets: string[];
  isPublic: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

// Asset sentiment interface
export interface AssetSentiment extends Document {
  _id: Types.ObjectId;
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  updatedAt: Date;
}

// Tribe asset tracking interface
export interface TribeAssetTracking extends Document {
  _id: Types.ObjectId;
  tribeId: Types.ObjectId;
  symbol: string;
  trackingStarted: Date;
  isActive: boolean;
}

// Mongoose Schemas
const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  profileBio: { type: String },
  profileImageUrl: { type: String },
  userType: { type: String, required: true, enum: ['investor', 'expert'] },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  
  // Embedded investor profile data
  investorProfile: {
    interests: [{ type: String }],
    riskPersona: { type: String, enum: ['owl', 'fox', 'shark'] },
    riskLevel: { type: String, enum: ['low', 'moderate', 'high'] },
    returnTarget: { type: String, enum: ['5-8%', '10-15%', '20%+'] }
  },
  
  // Embedded expert profile data
  expertProfile: {
    education: { type: String },
    achievements: [{ type: String }],
    specializations: [{ type: String }],
    expertPersona: { type: String, enum: ['owl', 'fox', 'shark'] },
    isVerified: { type: Boolean, default: false }
  },
  
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new Schema<Post>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  postType: { type: String, default: 'discussion' },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const marketDataSchema = new Schema<MarketData>({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  change: { type: String, required: true },
  changePercent: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const investmentRoomSchema = new Schema<InvestmentRoom>({
  name: { type: String, required: true },
  description: { type: String },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPremium: { type: Boolean, default: false },
  premiumPrice: { type: Number },
  isSponsored: { type: Boolean, default: false },
  sponsorName: { type: String },
  sponsorLogo: { type: String },
  category: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const watchlistAssetSchema = new Schema<WatchlistAsset>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }
});

const priceAlertSchema = new Schema<PriceAlert>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  alertType: { type: String, required: true, enum: ['above', 'below'] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const watchlistThemeSchema = new Schema<WatchlistTheme>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assets: [{ type: String }],
  isPublic: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const assetSentimentSchema = new Schema<AssetSentiment>({
  symbol: { type: String, required: true, unique: true },
  sentiment: { type: String, required: true, enum: ['bullish', 'bearish', 'neutral'] },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  updatedAt: { type: Date, default: Date.now }
});

const tribeAssetTrackingSchema = new Schema<TribeAssetTracking>({
  tribeId: { type: Schema.Types.ObjectId, required: true },
  symbol: { type: String, required: true },
  trackingStarted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Export Mongoose models
export const UserModel = mongoose.model<User>('User', userSchema);
export const PostModel = mongoose.model<Post>('Post', postSchema);
export const MarketDataModel = mongoose.model<MarketData>('MarketData', marketDataSchema);
export const InvestmentRoomModel = mongoose.model<InvestmentRoom>('InvestmentRoom', investmentRoomSchema);
export const WatchlistAssetModel = mongoose.model<WatchlistAsset>('WatchlistAsset', watchlistAssetSchema);
export const PriceAlertModel = mongoose.model<PriceAlert>('PriceAlert', priceAlertSchema);
export const WatchlistThemeModel = mongoose.model<WatchlistTheme>('WatchlistTheme', watchlistThemeSchema);
export const AssetSentimentModel = mongoose.model<AssetSentiment>('AssetSentiment', assetSentimentSchema);
export const TribeAssetTrackingModel = mongoose.model<TribeAssetTracking>('TribeAssetTracking', tribeAssetTrackingSchema);

// Zod validation schemas for API requests
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  fullName: z.string().optional(),
  profileBio: z.string().optional(),
  profileImageUrl: z.string().optional(),
  userType: z.enum(['investor', 'expert']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export const insertInvestorProfileSchema = z.object({
  interests: z.array(z.string()).optional(),
  riskPersona: z.enum(['owl', 'fox', 'shark']).optional(),
  riskLevel: z.enum(['low', 'moderate', 'high']).optional(),
  returnTarget: z.enum(['5-8%', '10-15%', '20%+']).optional(),
});

export const insertExpertProfileSchema = z.object({
  education: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  expertPersona: z.enum(['owl', 'fox', 'shark']).optional(),
  isVerified: z.boolean().default(false),
});

export const insertPostSchema = z.object({
  userId: z.string(),
  content: z.string().min(1),
  postType: z.string().default('discussion'),
  tags: z.array(z.string()).optional(),
});

export const insertMarketDataSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  change: z.string().min(1),
  changePercent: z.string().min(1),
});

export const insertWatchlistAssetSchema = z.object({
  userId: z.string(),
  symbol: z.string().min(1),
  name: z.string().min(1),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
});

export const insertPriceAlertSchema = z.object({
  userId: z.string(),
  symbol: z.string().min(1),
  targetPrice: z.number(),
  alertType: z.enum(['above', 'below']),
});

export const insertWatchlistThemeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  assets: z.array(z.string()),
  isPublic: z.boolean().default(false),
  createdBy: z.string(),
});

export const insertAssetSentimentSchema = z.object({
  symbol: z.string().min(1),
  sentiment: z.enum(['bullish', 'bearish', 'neutral']),
  confidence: z.number().min(0).max(1),
});

export const insertTribeAssetTrackingSchema = z.object({
  tribeId: z.string(),
  symbol: z.string().min(1),
});

// Type exports for use in other files
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertInvestorProfile = z.infer<typeof insertInvestorProfileSchema>;
export type InsertExpertProfile = z.infer<typeof insertExpertProfileSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type InsertWatchlistAsset = z.infer<typeof insertWatchlistAssetSchema>;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type InsertWatchlistTheme = z.infer<typeof insertWatchlistThemeSchema>;
export type InsertAssetSentiment = z.infer<typeof insertAssetSentimentSchema>;
export type InsertTribeAssetTracking = z.infer<typeof insertTribeAssetTrackingSchema>;

// Legacy type compatibility for existing code
export type InvestorProfile = InvestorData & { _id?: Types.ObjectId; userId?: Types.ObjectId };
export type ExpertProfile = ExpertData & { _id?: Types.ObjectId; userId?: Types.ObjectId };