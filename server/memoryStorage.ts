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
  type Loop,
  type InsertLoop,
  type LoopComment,
  type InsertLoopComment,
  type LoopLike,
  type InsertLoopLike,
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
  private loops: Map<string, Loop> = new Map();
  private loopComments: Map<string, LoopComment> = new Map();
  private loopLikes: Map<string, LoopLike> = new Map();

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

    // Initialize sample users for loops
    const sampleUsers = [
      { username: "financial_guru", fullName: "Rajesh Kumar" },
      { username: "market_maven", fullName: "Priya Sharma" },
      { username: "crypto_king", fullName: "Arjun Patel" },
    ];

    sampleUsers.forEach(userData => {
      const userId = new Types.ObjectId().toString();
      this.users.set(userId, {
        _id: new Types.ObjectId(userId),
        username: userData.username,
        email: `${userData.username}@example.com`,
        fullName: userData.fullName,
        userType: "investor",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);
    });

    // Initialize sample loops as placeholder content
    const sampleLoops = [
      {
        userId: Array.from(this.users.keys())[0],
        title: "Tesla Stock Analysis - 60 Second Breakdown",
        description: "Quick breakdown of Tesla's Q4 earnings and what it means for investors. Stock up 12% after beating revenue expectations. Key growth drivers include Model Y sales and energy storage division expansion.",
        videoUrl: "", // Empty for demo
        thumbnailUrl: "https://via.placeholder.com/400x600/6366f1/ffffff?text=Tesla+Analysis",
        duration: 58,
        tags: ["tesla", "earnings", "stocks", "analysis"],
        likes: 342,
        comments: 28,
        views: 1547,
      },
      {
        userId: Array.from(this.users.keys())[1],
        title: "Crypto Market Update - Bitcoin Rally",
        description: "Bitcoin breaks $45k resistance! Here's what this means for the crypto market. Institutional adoption and ETF approvals driving momentum. Key support levels to watch.",
        videoUrl: "", // Empty for demo
        thumbnailUrl: "https://via.placeholder.com/400x600/f59e0b/ffffff?text=Crypto+Update",
        duration: 45,
        tags: ["bitcoin", "crypto", "market", "bullish"],
        likes: 756,
        comments: 89,
        views: 3421,
      },
      {
        userId: Array.from(this.users.keys())[2],
        title: "SIP vs Lump Sum Investment Strategy",
        description: "Which investment strategy is better? Let's break it down with real numbers! Historical data shows SIP reduces timing risk while lump sum can generate higher returns in bull markets.",
        videoUrl: "", // Empty for demo
        thumbnailUrl: "https://via.placeholder.com/400x600/10b981/ffffff?text=SIP+vs+Lump",
        duration: 72,
        tags: ["sip", "investment", "strategy", "finance"],
        likes: 523,
        comments: 67,
        views: 2156,
      },
      {
        userId: Array.from(this.users.keys())[0],
        title: "Nifty 50 Technical Analysis",
        description: "Market at crucial support levels. RSI showing oversold conditions while institutional buying continues. Sector rotation from IT to banking stocks visible.",
        videoUrl: "", // Empty for demo
        thumbnailUrl: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Nifty+Analysis",
        duration: 68,
        tags: ["nifty", "technical", "analysis", "support"],
        likes: 289,
        comments: 34,
        views: 1823,
      },
      {
        userId: Array.from(this.users.keys())[1],
        title: "Mutual Fund Portfolio Review",
        description: "How to rebalance your mutual fund portfolio for 2024. Recommended allocation between large cap, mid cap, and international funds based on market conditions.",
        videoUrl: "", // Empty for demo
        thumbnailUrl: "https://via.placeholder.com/400x600/ec4899/ffffff?text=MF+Review",
        duration: 91,
        tags: ["mutualfunds", "portfolio", "rebalance", "2024"],
        likes: 412,
        comments: 56,
        views: 2789,
      },
    ];

    sampleLoops.forEach(loopData => {
      const loopId = new Types.ObjectId().toString();
      this.loops.set(loopId, {
        _id: new Types.ObjectId(loopId),
        userId: new Types.ObjectId(loopData.userId),
        title: loopData.title,
        description: loopData.description,
        videoUrl: loopData.videoUrl,
        thumbnailUrl: loopData.thumbnailUrl,
        duration: loopData.duration,
        tags: loopData.tags,
        likes: loopData.likes,
        comments: loopData.comments,
        views: loopData.views,
        isPublic: true,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
      } as Loop);
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

  // Loops operations
  async getLoops(): Promise<Loop[]> {
    const loops = Array.from(this.loops.values())
      .filter(loop => loop.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Populate user information
    return loops.map(loop => {
      const user = this.users.get(loop.userId.toString());
      return {
        ...loop,
        userId: user ? {
          _id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          profileImageUrl: user.profileImageUrl,
        } : {
          _id: loop.userId.toString(),
          username: "Unknown User",
          fullName: "Unknown User",
          profileImageUrl: undefined,
        }
      };
    });
  }

  async getLoopById(id: string): Promise<Loop | undefined> {
    return this.loops.get(id);
  }

  async getLoopsByUserId(userId: string): Promise<Loop[]> {
    const userObjectId = new Types.ObjectId(userId);
    return Array.from(this.loops.values())
      .filter(loop => loop.userId.equals(userObjectId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createLoop(loopData: InsertLoop): Promise<Loop> {
    const id = new Types.ObjectId().toString();
    const loop: Loop = {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(loopData.userId),
      title: loopData.title,
      description: loopData.description,
      videoUrl: loopData.videoUrl,
      thumbnailUrl: loopData.thumbnailUrl,
      duration: loopData.duration,
      tags: loopData.tags || [],
      likes: 0,
      comments: 0,
      views: 0,
      isPublic: true,
      createdAt: new Date(),
    } as Loop;
    
    this.loops.set(id, loop);
    return loop;
  }

  async updateLoopStats(loopId: string, likes?: number, comments?: number, views?: number): Promise<Loop | undefined> {
    const loop = this.loops.get(loopId);
    if (!loop) {
      return undefined;
    }
    
    if (likes !== undefined) loop.likes = likes;
    if (comments !== undefined) loop.comments = comments;
    if (views !== undefined) loop.views = views;
    
    this.loops.set(loopId, loop);
    return loop;
  }

  // Loop comments operations
  async getLoopComments(loopId: string): Promise<LoopComment[]> {
    const loopObjectId = new Types.ObjectId(loopId);
    const comments = Array.from(this.loopComments.values())
      .filter(comment => comment.loopId.equals(loopObjectId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Populate user information
    return comments.map(comment => {
      const user = this.users.get(comment.userId.toString());
      return {
        ...comment,
        userId: user ? {
          username: user.username,
          fullName: user.fullName,
          profileImageUrl: user.profileImageUrl,
        } : {
          username: "Unknown User",
          fullName: "Unknown User",
          profileImageUrl: undefined,
        }
      };
    });
  }

  async addLoopComment(commentData: InsertLoopComment): Promise<LoopComment> {
    const id = new Types.ObjectId().toString();
    const comment: LoopComment = {
      _id: new Types.ObjectId(id),
      loopId: new Types.ObjectId(commentData.loopId),
      userId: new Types.ObjectId(commentData.userId),
      content: commentData.content,
      createdAt: new Date(),
    } as LoopComment;
    
    this.loopComments.set(id, comment);
    
    // Update comment count on the loop
    const loop = this.loops.get(commentData.loopId);
    if (loop) {
      loop.comments += 1;
      this.loops.set(commentData.loopId, loop);
    }
    
    return comment;
  }

  // Loop likes operations
  async toggleLoopLike(likeData: InsertLoopLike): Promise<{ liked: boolean; likesCount: number }> {
    const loopObjectId = new Types.ObjectId(likeData.loopId);
    const userObjectId = new Types.ObjectId(likeData.userId);
    
    // Find existing like
    let existingLikeId: string | undefined;
    for (const [id, like] of this.loopLikes.entries()) {
      if (like.loopId.equals(loopObjectId) && like.userId.equals(userObjectId)) {
        existingLikeId = id;
        break;
      }
    }
    
    const loop = this.loops.get(likeData.loopId);
    if (!loop) {
      throw new Error('Loop not found');
    }
    
    if (existingLikeId) {
      // Remove like
      this.loopLikes.delete(existingLikeId);
      loop.likes = Math.max(0, loop.likes - 1);
      this.loops.set(likeData.loopId, loop);
      return { liked: false, likesCount: loop.likes };
    } else {
      // Add like
      const id = new Types.ObjectId().toString();
      const like: LoopLike = {
        _id: new Types.ObjectId(id),
        loopId: loopObjectId,
        userId: userObjectId,
        createdAt: new Date(),
      } as LoopLike;
      
      this.loopLikes.set(id, like);
      loop.likes += 1;
      this.loops.set(likeData.loopId, loop);
      return { liked: true, likesCount: loop.likes };
    }
  }

  async getUserLoopLikes(userId: string): Promise<string[]> {
    const userObjectId = new Types.ObjectId(userId);
    return Array.from(this.loopLikes.values())
      .filter(like => like.userId.equals(userObjectId))
      .map(like => like.loopId.toString());
  }
}