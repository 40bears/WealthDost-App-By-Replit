import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profile table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  profileBio: text("profile_bio"),
  profileImageUrl: text("profile_image_url"),
  userType: text("user_type").notNull(), // 'investor' or 'expert'
  experienceLevel: text("experience_level"), // 'beginner', 'intermediate', 'advanced'
  createdAt: timestamp("created_at").defaultNow(),
});

// Investor profile table
export const investorProfiles = pgTable("investor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  interests: text("interests").array(), // Array of financial interests
  riskPersona: text("risk_persona"), // 'owl', 'fox', 'shark'
  riskLevel: text("risk_level"), // 'low', 'moderate', 'high'
  returnTarget: text("return_target"), // '5-8%', '10-15%', '20%+'
});

// Expert profile table
export const expertProfiles = pgTable("expert_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  education: text("education"), // Educational background
  achievements: text("achievements").array(), // Array of achievements
  specializations: text("specializations").array(), // Array of specializations
  expertPersona: text("expert_persona"), // 'owl', 'fox', 'shark'
  isVerified: boolean("is_verified").default(false), // Expert verification status
});

// Financial feed posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull(), // 'analysis', 'news', 'debate', 'quiz'
  createdAt: timestamp("created_at").defaultNow(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
});

// Market data
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  change: text("change").notNull(),
  changePercent: text("change_percent").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas for data insertion/validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertInvestorProfileSchema = createInsertSchema(investorProfiles).omit({
  id: true,
});

export const insertExpertProfileSchema = createInsertSchema(expertProfiles).omit({
  id: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  updatedAt: true,
});

// Types for data insertion/selection
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInvestorProfile = z.infer<typeof insertInvestorProfileSchema>;
export type InvestorProfile = typeof investorProfiles.$inferSelect;

export type InsertExpertProfile = z.infer<typeof insertExpertProfileSchema>;
export type ExpertProfile = typeof expertProfiles.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
