import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertInvestorProfileSchema,
  insertExpertProfileSchema,
  insertPostSchema
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
      const userId = parseInt(req.params.id);
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
      const profileData = insertInvestorProfileSchema.parse(req.body);
      const user = await storage.getUser(profileData.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getInvestorProfile(profileData.userId);
      if (existingProfile) {
        return res.status(409).json({ message: 'Investor profile already exists for this user' });
      }
      
      const profile = await storage.createInvestorProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  app.get('/api/investor-profile/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
      const userId = parseInt(req.params.userId);
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
      const profileData = insertExpertProfileSchema.parse(req.body);
      const user = await storage.getUser(profileData.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getExpertProfile(profileData.userId);
      if (existingProfile) {
        return res.status(409).json({ message: 'Expert profile already exists for this user' });
      }
      
      const profile = await storage.createExpertProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: 'Invalid profile data', error });
    }
  });
  
  app.get('/api/expert-profile/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
      const userId = parseInt(req.params.userId);
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
      const postId = parseInt(req.params.id);
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
      const userId = parseInt(req.params.userId);
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

  const httpServer = createServer(app);
  return httpServer;
}
