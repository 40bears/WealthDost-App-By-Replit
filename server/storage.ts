import { Types } from "mongoose";
import {
  UserModel,
  PostModel,
  MarketDataModel,
  WatchlistAssetModel,
  PriceAlertModel,
  WatchlistThemeModel,
  AssetSentimentModel,
  TribeAssetTrackingModel,
  type User,
  type InsertUser,
  type InvestorProfile,
  type InsertInvestorProfile,
  type ExpertProfile,
  type InsertExpertProfile,
  type Post,
  type InsertPost,
  type MarketData,
  type InsertMarketData,
  type WatchlistAsset,
  type InsertWatchlistAsset,
  type PriceAlert,
  type InsertPriceAlert,
  type WatchlistTheme,
  type InsertWatchlistTheme,
  type AssetSentiment,
  type InsertAssetSentiment,
  type TribeAssetTracking,
  type InsertTribeAssetTracking,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Investor profile operations
  getInvestorProfile(userId: string): Promise<InvestorProfile | undefined>;
  createInvestorProfile(userId: string, profile: InsertInvestorProfile): Promise<InvestorProfile>;
  updateInvestorProfile(userId: string, profile: Partial<InsertInvestorProfile>): Promise<InvestorProfile | undefined>;
  
  // Expert profile operations
  getExpertProfile(userId: string): Promise<ExpertProfile | undefined>;
  createExpertProfile(userId: string, profile: InsertExpertProfile): Promise<ExpertProfile>;
  updateExpertProfile(userId: string, profile: Partial<InsertExpertProfile>): Promise<ExpertProfile | undefined>;
  
  // Posts operations
  getPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  getPostsByUserId(userId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Market data operations
  getMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  updateMarketData(symbol: string, data: Partial<InsertMarketData>): Promise<MarketData | undefined>;
  insertMarketData(data: InsertMarketData): Promise<MarketData>;

  // Watchlist operations
  getUserWatchlist(userId: string): Promise<WatchlistAsset[]>;
  addToWatchlist(asset: InsertWatchlistAsset): Promise<WatchlistAsset>;
  removeFromWatchlist(userId: string, assetId: string): Promise<boolean>;
  updateAssetPrice(symbol: string, price: number, change: number, changePercent: number): Promise<void>;
  
  // Price alerts operations
  getUserAlerts(userId: string): Promise<PriceAlert[]>;
  createAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  deleteAlert(alertId: string): Promise<boolean>;
  
  // Watchlist themes operations
  getPublicThemes(): Promise<WatchlistTheme[]>;
  createTheme(theme: InsertWatchlistTheme): Promise<WatchlistTheme>;
  
  // Asset sentiment operations
  getAssetSentiment(symbol: string): Promise<AssetSentiment | undefined>;
  updateAssetSentiment(symbol: string, sentiment: InsertAssetSentiment): Promise<AssetSentiment>;
  
  // Tribe asset tracking operations
  getTribeTracking(tribeId: string): Promise<TribeAssetTracking[]>;
  addTribeTracking(tracking: InsertTribeAssetTracking): Promise<TribeAssetTracking>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(new Types.ObjectId(id));
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const newUser = new UserModel(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Investor profile operations
  async getInvestorProfile(userId: string): Promise<InvestorProfile | undefined> {
    try {
      const user = await UserModel.findById(new Types.ObjectId(userId));
      return user?.investorProfile ? { ...user.investorProfile, _id: user._id, userId: user._id } : undefined;
    } catch (error) {
      console.error('Error getting investor profile:', error);
      return undefined;
    }
  }

  async createInvestorProfile(userId: string, profile: InsertInvestorProfile): Promise<InvestorProfile> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $set: { investorProfile: profile } },
        { new: true, upsert: false }
      );
      if (!user || !user.investorProfile) {
        throw new Error('Failed to create investor profile');
      }
      return { ...user.investorProfile, _id: user._id, userId: user._id };
    } catch (error) {
      console.error('Error creating investor profile:', error);
      throw error;
    }
  }

  async updateInvestorProfile(userId: string, profile: Partial<InsertInvestorProfile>): Promise<InvestorProfile | undefined> {
    try {
      const updateFields: any = {};
      Object.keys(profile).forEach(key => {
        updateFields[`investorProfile.${key}`] = profile[key as keyof InsertInvestorProfile];
      });

      const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $set: updateFields },
        { new: true }
      );
      return user?.investorProfile ? { ...user.investorProfile, _id: user._id, userId: user._id } : undefined;
    } catch (error) {
      console.error('Error updating investor profile:', error);
      return undefined;
    }
  }

  // Expert profile operations
  async getExpertProfile(userId: string): Promise<ExpertProfile | undefined> {
    try {
      const user = await UserModel.findById(new Types.ObjectId(userId));
      return user?.expertProfile ? { ...user.expertProfile, _id: user._id, userId: user._id } : undefined;
    } catch (error) {
      console.error('Error getting expert profile:', error);
      return undefined;
    }
  }

  async createExpertProfile(userId: string, profile: InsertExpertProfile): Promise<ExpertProfile> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $set: { expertProfile: profile } },
        { new: true, upsert: false }
      );
      if (!user || !user.expertProfile) {
        throw new Error('Failed to create expert profile');
      }
      return { ...user.expertProfile, _id: user._id, userId: user._id };
    } catch (error) {
      console.error('Error creating expert profile:', error);
      throw error;
    }
  }

  async updateExpertProfile(userId: string, profile: Partial<InsertExpertProfile>): Promise<ExpertProfile | undefined> {
    try {
      const updateFields: any = {};
      Object.keys(profile).forEach(key => {
        updateFields[`expertProfile.${key}`] = profile[key as keyof InsertExpertProfile];
      });

      const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $set: updateFields },
        { new: true }
      );
      return user?.expertProfile ? { ...user.expertProfile, _id: user._id, userId: user._id } : undefined;
    } catch (error) {
      console.error('Error updating expert profile:', error);
      return undefined;
    }
  }

  // Posts operations
  async getPosts(): Promise<Post[]> {
    try {
      return await PostModel.find().sort({ createdAt: -1 }).populate('userId', 'username fullName profileImageUrl');
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | undefined> {
    try {
      const post = await PostModel.findById(new Types.ObjectId(id)).populate('userId', 'username fullName profileImageUrl');
      return post || undefined;
    } catch (error) {
      console.error('Error getting post by id:', error);
      return undefined;
    }
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    try {
      return await PostModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting posts by user id:', error);
      return [];
    }
  }

  async createPost(post: InsertPost): Promise<Post> {
    try {
      const newPost = new PostModel({
        ...post,
        userId: new Types.ObjectId(post.userId)
      });
      return await newPost.save();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Market data operations
  async getMarketData(): Promise<MarketData[]> {
    try {
      return await MarketDataModel.find().sort({ updatedAt: -1 });
    } catch (error) {
      console.error('Error getting market data:', error);
      return [];
    }
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    try {
      const data = await MarketDataModel.findOne({ symbol });
      return data || undefined;
    } catch (error) {
      console.error('Error getting market data by symbol:', error);
      return undefined;
    }
  }

  async updateMarketData(symbol: string, data: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    try {
      const updated = await MarketDataModel.findOneAndUpdate(
        { symbol },
        { $set: { ...data, updatedAt: new Date() } },
        { new: true }
      );
      return updated || undefined;
    } catch (error) {
      console.error('Error updating market data:', error);
      return undefined;
    }
  }

  async insertMarketData(data: InsertMarketData): Promise<MarketData> {
    try {
      const newData = new MarketDataModel(data);
      return await newData.save();
    } catch (error) {
      console.error('Error inserting market data:', error);
      throw error;
    }
  }

  // Watchlist operations
  async getUserWatchlist(userId: string): Promise<WatchlistAsset[]> {
    try {
      return await WatchlistAssetModel.find({ userId: new Types.ObjectId(userId) }).sort({ addedAt: -1 });
    } catch (error) {
      console.error('Error getting user watchlist:', error);
      return [];
    }
  }

  async addToWatchlist(asset: InsertWatchlistAsset): Promise<WatchlistAsset> {
    try {
      const newAsset = new WatchlistAssetModel({
        ...asset,
        userId: new Types.ObjectId(asset.userId)
      });
      return await newAsset.save();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async removeFromWatchlist(userId: string, assetId: string): Promise<boolean> {
    try {
      const result = await WatchlistAssetModel.deleteOne({
        _id: new Types.ObjectId(assetId),
        userId: new Types.ObjectId(userId)
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }

  async updateAssetPrice(symbol: string, price: number, change: number, changePercent: number): Promise<void> {
    try {
      await WatchlistAssetModel.updateMany(
        { symbol },
        { $set: { price, change, changePercent } }
      );
    } catch (error) {
      console.error('Error updating asset price:', error);
    }
  }

  // Price alerts operations
  async getUserAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      return await PriceAlertModel.find({ userId: new Types.ObjectId(userId), isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting user alerts:', error);
      return [];
    }
  }

  async createAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    try {
      const newAlert = new PriceAlertModel({
        ...alert,
        userId: new Types.ObjectId(alert.userId)
      });
      return await newAlert.save();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async deleteAlert(alertId: string): Promise<boolean> {
    try {
      const result = await PriceAlertModel.deleteOne({ _id: new Types.ObjectId(alertId) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting alert:', error);
      return false;
    }
  }

  // Watchlist themes operations
  async getPublicThemes(): Promise<WatchlistTheme[]> {
    try {
      return await WatchlistThemeModel.find({ isPublic: true }).sort({ createdAt: -1 }).populate('createdBy', 'username fullName');
    } catch (error) {
      console.error('Error getting public themes:', error);
      return [];
    }
  }

  async createTheme(theme: InsertWatchlistTheme): Promise<WatchlistTheme> {
    try {
      const newTheme = new WatchlistThemeModel({
        ...theme,
        createdBy: new Types.ObjectId(theme.createdBy)
      });
      return await newTheme.save();
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  }

  // Asset sentiment operations
  async getAssetSentiment(symbol: string): Promise<AssetSentiment | undefined> {
    try {
      const sentiment = await AssetSentimentModel.findOne({ symbol });
      return sentiment || undefined;
    } catch (error) {
      console.error('Error getting asset sentiment:', error);
      return undefined;
    }
  }

  async updateAssetSentiment(symbol: string, sentiment: InsertAssetSentiment): Promise<AssetSentiment> {
    try {
      const updated = await AssetSentimentModel.findOneAndUpdate(
        { symbol },
        { $set: { ...sentiment, updatedAt: new Date() } },
        { new: true, upsert: true }
      );
      if (!updated) {
        throw new Error('Failed to update asset sentiment');
      }
      return updated;
    } catch (error) {
      console.error('Error updating asset sentiment:', error);
      throw error;
    }
  }

  // Tribe asset tracking operations
  async getTribeTracking(tribeId: string): Promise<TribeAssetTracking[]> {
    try {
      return await TribeAssetTrackingModel.find({ 
        tribeId: new Types.ObjectId(tribeId), 
        isActive: true 
      }).sort({ trackingStarted: -1 });
    } catch (error) {
      console.error('Error getting tribe tracking:', error);
      return [];
    }
  }

  async addTribeTracking(tracking: InsertTribeAssetTracking): Promise<TribeAssetTracking> {
    try {
      const newTracking = new TribeAssetTrackingModel({
        ...tracking,
        tribeId: new Types.ObjectId(tracking.tribeId)
      });
      return await newTracking.save();
    } catch (error) {
      console.error('Error adding tribe tracking:', error);
      throw error;
    }
  }
}

import { MemoryStorage } from "./memoryStorage";

// Create and export storage instance - fallback to memory storage for development
export const storage = new MemoryStorage();