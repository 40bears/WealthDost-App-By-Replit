import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertInvestorProfileSchema,
  insertExpertProfileSchema,
  insertPostSchema,
  insertLoopSchema,
  insertLoopCommentSchema,
  insertLoopLikeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Invalid user data', error });
    }
  });
  
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user', error });
    }
  });
  
  // Investor profile routes
  app.post('/api/investor-profile', async (req, res) => {
    try {
      const { userId, ...profileData } = req.body;
      const validatedProfile = insertInvestorProfileSchema.parse(profileData);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getInvestorProfile(userId);
      if (existingProfile) {
        return res.status(409).json({ message: 'Investor profile already exists for this user' });
      }
      
      const profile = await storage.createInvestorProfile(userId, validatedProfile);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  app.get('/api/investor-profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.getInvestorProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Investor profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch investor profile', error });
    }
  });
  
  app.patch('/api/investor-profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const profileData = req.body;
      
      const updatedProfile = await storage.updateInvestorProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Investor profile not found' });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  // Expert profile routes
  app.post('/api/expert-profile', async (req, res) => {
    try {
      const { userId, ...profileData } = req.body;
      const validatedProfile = insertExpertProfileSchema.parse(profileData);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getExpertProfile(userId);
      if (existingProfile) {
        return res.status(409).json({ message: 'Expert profile already exists for this user' });
      }
      
      const profile = await storage.createExpertProfile(userId, validatedProfile);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  app.get('/api/expert-profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await storage.getExpertProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Expert profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch expert profile', error });
    }
  });
  
  app.patch('/api/expert-profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const profileData = req.body;
      
      const updatedProfile = await storage.updateExpertProfile(userId, profileData);
      
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Expert profile not found' });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  // Posts routes
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch posts', error });
    }
  });
  
  app.get('/api/posts/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch post', error });
    }
  });
  
  app.get('/api/posts/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await storage.getPostsByUserId(userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch posts', error });
    }
  });
  
  app.post('/api/posts', async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const user = await storage.getUser(postData.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: 'Invalid post data', error });
    }
  });
  
  // Market data routes
  app.get('/api/market-data', async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch market data', error });
    }
  });
  
  app.get('/api/market-data/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const data = await storage.getMarketDataBySymbol(symbol);
      
      if (!data) {
        return res.status(404).json({ message: 'Market data not found' });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch market data', error });
    }
  });

  // Loops routes
  app.get('/api/loops', async (req, res) => {
    try {
      const loops = await storage.getLoops();
      res.json(loops);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch loops', error });
    }
  });

  app.get('/api/loops/:id', async (req, res) => {
    try {
      const loopId = req.params.id;
      const loop = await storage.getLoopById(loopId);
      
      if (!loop) {
        return res.status(404).json({ message: 'Loop not found' });
      }
      
      // Increment view count
      await storage.updateLoopStats(loopId, undefined, undefined, (loop.views || 0) + 1);
      
      res.json(loop);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch loop', error });
    }
  });

  app.get('/api/loops/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const loops = await storage.getLoopsByUserId(userId);
      res.json(loops);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user loops', error });
    }
  });

  app.post('/api/loops', async (req, res) => {
    try {
      const loopData = insertLoopSchema.parse(req.body);
      const user = await storage.getUser(loopData.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const loop = await storage.createLoop(loopData);
      res.status(201).json(loop);
    } catch (error) {
      res.status(400).json({ message: 'Invalid loop data', error });
    }
  });

  // Loop comments routes
  app.get('/api/loops/:loopId/comments', async (req, res) => {
    try {
      const loopId = req.params.loopId;
      const comments = await storage.getLoopComments(loopId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch loop comments', error });
    }
  });

  app.post('/api/loops/:loopId/comments', async (req, res) => {
    try {
      const loopId = req.params.loopId;
      const commentData = insertLoopCommentSchema.parse({
        ...req.body,
        loopId
      });
      
      const comment = await storage.addLoopComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: 'Invalid comment data', error });
    }
  });

  // Loop likes routes
  app.post('/api/loops/:loopId/like', async (req, res) => {
    try {
      const loopId = req.params.loopId;
      const likeData = insertLoopLikeSchema.parse({
        ...req.body,
        loopId
      });
      
      const result = await storage.toggleLoopLike(likeData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Failed to toggle like', error });
    }
  });

  app.get('/api/users/:userId/liked-loops', async (req, res) => {
    try {
      const userId = req.params.userId;
      const likedLoops = await storage.getUserLoopLikes(userId);
      res.json(likedLoops);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user likes', error });
    }
  });

  // Portfolio analysis endpoint
  app.post("/api/portfolio/analyze", async (req, res) => {
    try {
      const { portfolio } = req.body;
      
      if (!portfolio || !Array.isArray(portfolio) || portfolio.length === 0) {
        return res.status(400).json({ error: "Portfolio data is required" });
      }

      // Calculate portfolio metrics
      const sectorAllocation: { [key: string]: number } = {};
      let totalValue = 0;
      let totalGainLoss = 0;
      
      portfolio.forEach((stock: any) => {
        const value = stock.quantity * stock.currentPrice;
        totalValue += value;
        totalGainLoss += (stock.currentPrice - stock.entryPrice) * stock.quantity;
        
        sectorAllocation[stock.sector] = (sectorAllocation[stock.sector] || 0) + value;
      });

      // Normalize percentages
      Object.keys(sectorAllocation).forEach(sector => {
        sectorAllocation[sector] = (sectorAllocation[sector] / totalValue) * 100;
      });

      // Calculate health scores
      const diversificationScore = Math.min(95, Object.keys(sectorAllocation).length * 15 + 25);
      const performanceScore = Math.max(10, Math.min(95, 50 + (totalGainLoss / totalValue) * 200));
      const riskScore = 100 - Math.max(...Object.values(sectorAllocation));
      const overallScore = Math.round((diversificationScore + performanceScore + riskScore) / 3);

      const riskLevel = overallScore >= 75 ? "Low" : overallScore >= 50 ? "Medium" : "High";

      // Generate AI-powered recommendations
      const recommendations = [];
      const strengths = [];
      const concerns = [];

      if (Object.keys(sectorAllocation).length < 4) {
        recommendations.push("Consider diversifying across more sectors to reduce concentration risk");
      }

      if (Math.max(...Object.values(sectorAllocation)) > 40) {
        concerns.push("High concentration in one sector - consider rebalancing");
        recommendations.push("Reduce sector concentration by adding stocks from underrepresented sectors");
      }

      if (diversificationScore > 70) {
        strengths.push("Well-diversified portfolio across multiple sectors");
      }

      if (performanceScore > 60) {
        strengths.push("Portfolio showing positive performance trends");
      } else {
        recommendations.push("Review underperforming positions and consider rebalancing");
      }

      // Add sector-specific recommendations
      const topSector = Object.keys(sectorAllocation).reduce((a, b) => 
        sectorAllocation[a] > sectorAllocation[b] ? a : b
      );
      
      if (sectorAllocation[topSector] > 35) {
        recommendations.push(`Consider reducing exposure to ${topSector} sector to improve balance`);
      }

      const analysis = {
        overallScore,
        riskLevel,
        diversificationScore,
        performanceScore,
        riskScore,
        recommendations: recommendations.length > 0 ? recommendations : ["Portfolio appears well-balanced - continue monitoring market conditions"],
        strengths: strengths.length > 0 ? strengths : ["Stable portfolio composition"],
        concerns: concerns.length > 0 ? concerns : ["No major concerns identified"],
        sectorAllocation,
        totalValue,
        totalGainLoss,
        performancePercent: (totalGainLoss / (totalValue - totalGainLoss)) * 100
      };

      res.json(analysis);
    } catch (error) {
      console.error("Portfolio analysis error:", error);
      res.status(500).json({ error: "Failed to analyze portfolio" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
