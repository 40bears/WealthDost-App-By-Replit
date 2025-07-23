import { Types } from "mongoose";
import {
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
import { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<string, Post> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private watchlistAssets: Map<string, WatchlistAsset> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();
  private watchlistThemes: Map<string, WatchlistTheme> = new Map();
  private assetSentiments: Map<string, AssetSentiment> = new Map();
  private tribeTracking: Map<string, TribeAssetTracking> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample market data
    const marketDataSamples = [
      { symbol: "NIFTY50", name: "NIFTY 50", price: "24,825.80", change: "+125.60", changePercent: "+0.51%" },
      { symbol: "SENSEX", name: "BSE SENSEX", price: "81,559.54", change: "+456.10", changePercent: "+0.56%" },
      { symbol: "BANKNIFTY", name: "BANK NIFTY", price: "53,475.25", change: "-234.75", changePercent: "-0.44%" },
      { symbol: "RELIANCE", name: "Reliance Industries", price: "2,847.50", change: "+15.30", changePercent: "+0.54%" },
      { symbol: "TCS", name: "Tata Consultancy Services", price: "4,234.70", change: "-23.45", changePercent: "-0.55%" },
    ];

    marketDataSamples.forEach((data, index) => {
      const id = new Types.ObjectId().toString();
      this.marketData.set(data.symbol, {
        _id: new Types.ObjectId(id),
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        updatedAt: new Date(),
      } as MarketData);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = new Types.ObjectId().toString();
    const user: User = {
      _id: new Types.ObjectId(id),
      ...userData,
      createdAt: new Date(),
    } as User;
    
    this.users.set(id, user);
    return user;
  }

  // Investor profile operations
  async getInvestorProfile(userId: string): Promise<InvestorProfile | undefined> {
    const user = this.users.get(userId);
    return user?.investorProfile ? { ...user.investorProfile, _id: user._id, userId: user._id } : undefined;
  }

  async createInvestorProfile(userId: string, profile: InsertInvestorProfile): Promise<InvestorProfile> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.investorProfile = profile;
    this.users.set(userId, user);
    return { ...profile, _id: user._id, userId: user._id };
  }

  async updateInvestorProfile(userId: string, profile: Partial<InsertInvestorProfile>): Promise<InvestorProfile | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    
    user.investorProfile = { ...user.investorProfile, ...profile };
    this.users.set(userId, user);
    return user.investorProfile ? { ...user.investorProfile, _id: user._id, userId: user._id } : undefined;
  }

  // Expert profile operations
  async getExpertProfile(userId: string): Promise<ExpertProfile | undefined> {
    const user = this.users.get(userId);
    return user?.expertProfile ? { ...user.expertProfile, _id: user._id, userId: user._id } : undefined;
  }

  async createExpertProfile(userId: string, profile: InsertExpertProfile): Promise<ExpertProfile> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.expertProfile = profile;
    this.users.set(userId, user);
    return { ...profile, _id: user._id, userId: user._id };
  }

  async updateExpertProfile(userId: string, profile: Partial<InsertExpertProfile>): Promise<ExpertProfile | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    
    user.expertProfile = { ...user.expertProfile, ...profile };
    this.users.set(userId, user);
    return user.expertProfile ? { ...user.expertProfile, _id: user._id, userId: user._id } : undefined;
  }

  // Posts operations
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const userObjectId = new Types.ObjectId(userId);
    return Array.from(this.posts.values())
      .filter(post => post.userId.equals(userObjectId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPost(postData: InsertPost): Promise<Post> {
    const id = new Types.ObjectId().toString();
    const post: Post = {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(postData.userId),
      content: postData.content,
      postType: postData.postType || 'discussion',
      tags: postData.tags || [],
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    } as Post;
    
    this.posts.set(id, post);
    return post;
  }

  // Market data operations
  async getMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values()).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }

  async updateMarketData(symbol: string, data: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    const existing = this.marketData.get(symbol);
    if (!existing) {
      return undefined;
    }
    
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.marketData.set(symbol, updated);
    return updated;
  }

  async insertMarketData(data: InsertMarketData): Promise<MarketData> {
    const id = new Types.ObjectId().toString();
    const marketData: MarketData = {
      _id: new Types.ObjectId(id),
      ...data,
      updatedAt: new Date(),
    } as MarketData;
    
    this.marketData.set(data.symbol, marketData);
    return marketData;
  }

  // Watchlist operations
  async getUserWatchlist(userId: string): Promise<WatchlistAsset[]> {
    const userObjectId = new Types.ObjectId(userId);
    return Array.from(this.watchlistAssets.values())
      .filter(asset => asset.userId.equals(userObjectId))
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
  }

  async addToWatchlist(assetData: InsertWatchlistAsset): Promise<WatchlistAsset> {
    const id = new Types.ObjectId().toString();
    const asset: WatchlistAsset = {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(assetData.userId),
      symbol: assetData.symbol,
      name: assetData.name,
      price: assetData.price,
      change: assetData.change,
      changePercent: assetData.changePercent,
      addedAt: new Date(),
    } as WatchlistAsset;
    
    this.watchlistAssets.set(id, asset);
    return asset;
  }

  async removeFromWatchlist(userId: string, assetId: string): Promise<boolean> {
    const asset = this.watchlistAssets.get(assetId);
    if (asset && asset.userId.equals(new Types.ObjectId(userId))) {
      this.watchlistAssets.delete(assetId);
      return true;
    }
    return false;
  }

  async updateAssetPrice(symbol: string, price: number, change: number, changePercent: number): Promise<void> {
    for (const asset of this.watchlistAssets.values()) {
      if (asset.symbol === symbol) {
        asset.price = price;
        asset.change = change;
        asset.changePercent = changePercent;
      }
    }
  }

  // Price alerts operations
  async getUserAlerts(userId: string): Promise<PriceAlert[]> {
    const userObjectId = new Types.ObjectId(userId);
    return Array.from(this.priceAlerts.values())
      .filter(alert => alert.userId.equals(userObjectId) && alert.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAlert(alertData: InsertPriceAlert): Promise<PriceAlert> {
    const id = new Types.ObjectId().toString();
    const alert: PriceAlert = {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(alertData.userId),
      symbol: alertData.symbol,
      targetPrice: alertData.targetPrice,
      alertType: alertData.alertType,
      isActive: true,
      createdAt: new Date(),
    } as PriceAlert;
    
    this.priceAlerts.set(id, alert);
    return alert;
  }

  async deleteAlert(alertId: string): Promise<boolean> {
    return this.priceAlerts.delete(alertId);
  }

  // Watchlist themes operations
  async getPublicThemes(): Promise<WatchlistTheme[]> {
    return Array.from(this.watchlistThemes.values())
      .filter(theme => theme.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTheme(themeData: InsertWatchlistTheme): Promise<WatchlistTheme> {
    const id = new Types.ObjectId().toString();
    const theme: WatchlistTheme = {
      _id: new Types.ObjectId(id),
      name: themeData.name,
      description: themeData.description,
      assets: themeData.assets,
      isPublic: themeData.isPublic,
      createdBy: new Types.ObjectId(themeData.createdBy),
      createdAt: new Date(),
    } as WatchlistTheme;
    
    this.watchlistThemes.set(id, theme);
    return theme;
  }

  // Asset sentiment operations
  async getAssetSentiment(symbol: string): Promise<AssetSentiment | undefined> {
    return this.assetSentiments.get(symbol);
  }

  async updateAssetSentiment(symbol: string, sentimentData: InsertAssetSentiment): Promise<AssetSentiment> {
    const id = new Types.ObjectId().toString();
    const sentiment: AssetSentiment = {
      _id: new Types.ObjectId(id),
      symbol: sentimentData.symbol,
      sentiment: sentimentData.sentiment,
      confidence: sentimentData.confidence,
      updatedAt: new Date(),
    } as AssetSentiment;
    
    this.assetSentiments.set(symbol, sentiment);
    return sentiment;
  }

  // Tribe asset tracking operations
  async getTribeTracking(tribeId: string): Promise<TribeAssetTracking[]> {
    const tribeObjectId = new Types.ObjectId(tribeId);
    return Array.from(this.tribeTracking.values())
      .filter(tracking => tracking.tribeId.equals(tribeObjectId) && tracking.isActive)
      .sort((a, b) => b.trackingStarted.getTime() - a.trackingStarted.getTime());
  }

  async addTribeTracking(trackingData: InsertTribeAssetTracking): Promise<TribeAssetTracking> {
    const id = new Types.ObjectId().toString();
    const tracking: TribeAssetTracking = {
      _id: new Types.ObjectId(id),
      tribeId: new Types.ObjectId(trackingData.tribeId),
      symbol: trackingData.symbol,
      trackingStarted: new Date(),
      isActive: true,
    } as TribeAssetTracking;
    
    this.tribeTracking.set(id, tracking);
    return tracking;
  }
}