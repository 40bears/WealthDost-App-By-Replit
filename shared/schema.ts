import { pgTable, text, serial, integer, boolean, timestamp, varchar, json, decimal } from "drizzle-orm/pg-core";
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
  content: text("content").notNull(),
  postType: varchar("post_type", { length: 50 }).default("discussion"),
  tags: text("tags").array(),
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

// Investment Rooms
export const investmentRooms = pgTable("investment_rooms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  isPremium: boolean("is_premium").default(false),
  premiumPrice: decimal("premium_price", { precision: 10, scale: 2 }),
  isSponsored: boolean("is_sponsored").default(false),
  sponsorName: varchar("sponsor_name", { length: 255 }),
  sponsorLogo: varchar("sponsor_logo", { length: 500 }),
  category: varchar("category", { length: 100 }).notNull(),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room Subscriptions
export const roomSubscriptions = pgTable("room_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  roomId: integer("room_id").notNull().references(() => investmentRooms.id),
  status: varchar("status", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Room Memberships
export const roomMemberships = pgTable("room_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  roomId: integer("room_id").notNull().references(() => investmentRooms.id),
  role: varchar("role", { length: 50 }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
  xpEarned: integer("xp_earned").default(0),
});

// User Wallet
export const userWallet = pgTable("user_wallet", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  wealthCoins: integer("wealth_coins").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  pendingWithdrawal: decimal("pending_withdrawal", { precision: 10, scale: 2 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  roomId: integer("room_id").references(() => investmentRooms.id),
  status: varchar("status", { length: 50 }).default("completed"),
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Room Analytics
export const roomAnalytics = pgTable("room_analytics", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => investmentRooms.id),
  date: timestamp("date").notNull(),
  activeMembers: integer("active_members").default(0),
  newSubscriptions: integer("new_subscriptions").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  engagement: integer("engagement").default(0),
});

// User Badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeType: varchar("badge_type", { length: 100 }).notNull(),
  badgeName: varchar("badge_name", { length: 255 }).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  roomId: integer("room_id").references(() => investmentRooms.id),
});

// Watchlist Assets
export const watchlistAssets = pgTable("watchlist_assets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  assetType: varchar("asset_type", { length: 50 }).notNull(), // stock, mutual_fund, etf, crypto
  exchange: varchar("exchange", { length: 50 }).notNull(), // NSE, BSE, NYSE, NASDAQ, CRYPTO
  currentPrice: decimal("current_price", { precision: 15, scale: 4 }),
  priceChange: decimal("price_change", { precision: 15, scale: 4 }),
  priceChangePercent: decimal("price_change_percent", { precision: 10, scale: 4 }),
  theme: varchar("theme", { length: 100 }),
  tags: text("tags").array(),
  addedAt: timestamp("added_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Price Alerts
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assetId: integer("asset_id").notNull().references(() => watchlistAssets.id),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // price_above, price_below, volume_spike, news_keyword
  targetValue: decimal("target_value", { precision: 15, scale: 4 }),
  keyword: varchar("keyword", { length: 255 }),
  isActive: boolean("is_active").default(true),
  notificationMethod: varchar("notification_method", { length: 50 }).default("in_app"), // in_app, push, email
  createdAt: timestamp("created_at").defaultNow(),
  triggeredAt: timestamp("triggered_at"),
});

// Watchlist Themes
export const watchlistThemes = pgTable("watchlist_themes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  followerCount: integer("follower_count").default(0),
  assetCount: integer("asset_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Theme Followers
export const themeFollowers = pgTable("theme_followers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  themeId: integer("theme_id").notNull().references(() => watchlistThemes.id),
  followedAt: timestamp("followed_at").defaultNow(),
});

// Asset Sentiment
export const assetSentiment = pgTable("asset_sentiment", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 5, scale: 2 }), // -1 to 1
  sentimentLabel: varchar("sentiment_label", { length: 20 }), // positive, neutral, negative
  summary: text("summary"),
  source: varchar("source", { length: 100 }), // twitter, news, reddit
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tribe Asset Tracking
export const tribeAssetTracking = pgTable("tribe_asset_tracking", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => investmentRooms.id),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  watcherCount: integer("watcher_count").default(0),
  trendingScore: decimal("trending_score", { precision: 10, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
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

// Investment Rooms schemas
export const insertInvestmentRoomSchema = createInsertSchema(investmentRooms).omit({
  id: true,
  memberCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoomSubscriptionSchema = createInsertSchema(roomSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertRoomMembershipSchema = createInsertSchema(roomMemberships).omit({
  id: true,
  joinedAt: true,
  xpEarned: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallet).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertWatchlistAssetSchema = createInsertSchema(watchlistAssets).omit({
  id: true,
  addedAt: true,
  lastUpdated: true,
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
  triggeredAt: true,
});

export const insertWatchlistThemeSchema = createInsertSchema(watchlistThemes).omit({
  id: true,
  createdAt: true,
});

export const insertThemeFollowerSchema = createInsertSchema(themeFollowers).omit({
  id: true,
  followedAt: true,
});

export const insertAssetSentimentSchema = createInsertSchema(assetSentiment).omit({
  id: true,
  updatedAt: true,
});

export const insertTribeAssetTrackingSchema = createInsertSchema(tribeAssetTracking).omit({
  id: true,
  lastUpdated: true,
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

// Investment Rooms types
export type InsertInvestmentRoom = z.infer<typeof insertInvestmentRoomSchema>;
export type InvestmentRoom = typeof investmentRooms.$inferSelect;

export type InsertRoomSubscription = z.infer<typeof insertRoomSubscriptionSchema>;
export type RoomSubscription = typeof roomSubscriptions.$inferSelect;

export type InsertRoomMembership = z.infer<typeof insertRoomMembershipSchema>;
export type RoomMembership = typeof roomMemberships.$inferSelect;

export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;
export type UserWallet = typeof userWallet.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Watchlist types
export type InsertWatchlistAsset = z.infer<typeof insertWatchlistAssetSchema>;
export type WatchlistAsset = typeof watchlistAssets.$inferSelect;

export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;

export type InsertWatchlistTheme = z.infer<typeof insertWatchlistThemeSchema>;
export type WatchlistTheme = typeof watchlistThemes.$inferSelect;

export type InsertThemeFollower = z.infer<typeof insertThemeFollowerSchema>;
export type ThemeFollower = typeof themeFollowers.$inferSelect;

export type InsertAssetSentiment = z.infer<typeof insertAssetSentimentSchema>;
export type AssetSentiment = typeof assetSentiment.$inferSelect;

export type InsertTribeAssetTracking = z.infer<typeof insertTribeAssetTrackingSchema>;
export type TribeAssetTracking = typeof tribeAssetTracking.$inferSelect;
