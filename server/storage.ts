import {
  users,
  investorProfiles,
  expertProfiles,
  posts,
  marketData,
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
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Investor profile operations
  getInvestorProfile(userId: number): Promise<InvestorProfile | undefined>;
  createInvestorProfile(profile: InsertInvestorProfile): Promise<InvestorProfile>;
  updateInvestorProfile(userId: number, profile: Partial<InsertInvestorProfile>): Promise<InvestorProfile | undefined>;
  
  // Expert profile operations
  getExpertProfile(userId: number): Promise<ExpertProfile | undefined>;
  createExpertProfile(profile: InsertExpertProfile): Promise<ExpertProfile>;
  updateExpertProfile(userId: number, profile: Partial<InsertExpertProfile>): Promise<ExpertProfile | undefined>;
  
  // Posts operations
  getPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getPostsByUserId(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Market data operations
  getMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  updateMarketData(symbol: string, data: Partial<InsertMarketData>): Promise<MarketData | undefined>;
  insertMarketData(data: InsertMarketData): Promise<MarketData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private investorProfiles: Map<number, InvestorProfile>;
  private expertProfiles: Map<number, ExpertProfile>;
  private posts: Map<number, Post>;
  private marketData: Map<string, MarketData>;
  
  private userId: number;
  private investorProfileId: number;
  private expertProfileId: number;
  private postId: number;
  private marketDataId: number;

  constructor() {
    this.users = new Map();
    this.investorProfiles = new Map();
    this.expertProfiles = new Map();
    this.posts = new Map();
    this.marketData = new Map();
    
    this.userId = 1;
    this.investorProfileId = 1;
    this.expertProfileId = 1;
    this.postId = 1;
    this.marketDataId = 1;
    
    // Initialize with some default market data
    this.initializeMarketData();
  }
  
  private initializeMarketData() {
    const defaultMarketData: InsertMarketData[] = [
      {
        symbol: "NIFTY50",
        name: "NIFTY 50",
        price: "22,474.05",
        change: "+197.30",
        changePercent: "+0.89%",
      },
      {
        symbol: "SENSEX",
        name: "SENSEX",
        price: "73,876.44",
        change: "+489.57",
        changePercent: "+0.67%",
      },
      {
        symbol: "BTC/INR",
        name: "BTC/INR",
        price: "52,84,490",
        change: "-1,16,000",
        changePercent: "-2.14%",
      },
    ];
    
    defaultMarketData.forEach(data => {
      this.insertMarketData(data);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Investor profile operations
  async getInvestorProfile(userId: number): Promise<InvestorProfile | undefined> {
    return Array.from(this.investorProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }
  
  async createInvestorProfile(profile: InsertInvestorProfile): Promise<InvestorProfile> {
    const id = this.investorProfileId++;
    const investorProfile: InvestorProfile = { ...profile, id };
    this.investorProfiles.set(id, investorProfile);
    return investorProfile;
  }
  
  async updateInvestorProfile(userId: number, profile: Partial<InsertInvestorProfile>): Promise<InvestorProfile | undefined> {
    const existingProfile = await this.getInvestorProfile(userId);
    
    if (!existingProfile) {
      return undefined;
    }
    
    const updatedProfile: InvestorProfile = { ...existingProfile, ...profile };
    this.investorProfiles.set(existingProfile.id, updatedProfile);
    
    return updatedProfile;
  }
  
  // Expert profile operations
  async getExpertProfile(userId: number): Promise<ExpertProfile | undefined> {
    return Array.from(this.expertProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }
  
  async createExpertProfile(profile: InsertExpertProfile): Promise<ExpertProfile> {
    const id = this.expertProfileId++;
    const expertProfile: ExpertProfile = { ...profile, id };
    this.expertProfiles.set(id, expertProfile);
    return expertProfile;
  }
  
  async updateExpertProfile(userId: number, profile: Partial<InsertExpertProfile>): Promise<ExpertProfile | undefined> {
    const existingProfile = await this.getExpertProfile(userId);
    
    if (!existingProfile) {
      return undefined;
    }
    
    const updatedProfile: ExpertProfile = { ...existingProfile, ...profile };
    this.expertProfiles.set(existingProfile.id, updatedProfile);
    
    return updatedProfile;
  }
  
  // Posts operations
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const post: Post = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      likes: 0,
      comments: 0,
    };
    this.posts.set(id, post);
    return post;
  }
  
  // Market data operations
  async getMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }
  
  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }
  
  async updateMarketData(symbol: string, data: Partial<InsertMarketData>): Promise<MarketData | undefined> {
    const existingData = await this.getMarketDataBySymbol(symbol);
    
    if (!existingData) {
      return undefined;
    }
    
    const updatedData: MarketData = { 
      ...existingData, 
      ...data,
      updatedAt: new Date()
    };
    this.marketData.set(symbol, updatedData);
    
    return updatedData;
  }
  
  async insertMarketData(data: InsertMarketData): Promise<MarketData> {
    const id = this.marketDataId++;
    const marketData: MarketData = { 
      ...data, 
      id,
      updatedAt: new Date()
    };
    this.marketData.set(data.symbol, marketData);
    return marketData;
  }
}

export const storage = new MemStorage();
