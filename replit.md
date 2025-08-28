# WealthDost - Financial Community Platform

## Overview

WealthDost is a community-powered financial application that connects investors and financial experts. It provides a platform for financial learning, market insights, investment tracking, and expert advice. The application follows a mobile-first design approach, focusing on delivering a seamless experience for both investors and financial experts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Technology**: React with TypeScript
- **UI Framework**: Custom component system built on top of Radix UI primitives and styled with Tailwind CSS
- **State Management**: React Query for server state and local React state for UI state
- **Routing**: Using Wouter, a lightweight router for React applications
- **Design System**: Using shadcn/ui component library with a "New York" style theme
- **Styling**: Tailwind CSS with a custom theme and CSS variables for theming support

### Backend

- **Technology**: Minimal Express server for frontend demo
- **API Architecture**: Simple mock endpoints returning static data
- **Purpose**: Frontend demonstration only - real backend logic to be implemented separately
- **Endpoints**: Basic API endpoints (/api/posts, /api/stock-tips, /api/market-data) with hardcoded responses
- **Development Tools**: Using Vite for frontend development and tsx for TypeScript execution

### Database

- **Current State**: No database - using static demo data for frontend showcase
- **Future Implementation**: Backend and database logic will be added separately
- **Demo Data**: Hardcoded market data and sample posts for UI demonstration

## Key Components

### Frontend Components

1. **Authentication Flows**
   - Sign-up and login screens with role-based onboarding (investor or expert)
   - User profile management

2. **Dashboard**
   - Market overview with financial stats
   - Content feed with different post types (analysis, news, debates, quizzes)
   - Navigation system with bottom tabs for mobile

3. **Onboarding**
   - Role-based onboarding flow (investor or expert)
   - Multi-step forms for profile completion
   - Persona-based classification system

4. **UI Component Library**
   - Comprehensive set of UI components built on Radix UI primitives
   - Accessibility-focused design
   - Responsive layout components
   - Theming system with light/dark mode support

### Backend Components

1. **API Routes**
   - User management (registration, authentication, profiles)
   - Content management (posts, comments, likes)
   - Market data integration

2. **Storage Layer**
   - Database abstraction with Drizzle ORM
   - Memory storage implementation for development

3. **Schema**
   - User profiles (basic user data, authentication)
   - Investor-specific profile data
   - Expert-specific profile data
   - Financial content and interactions

## Data Flow

1. **User Registration and Onboarding**
   - User selects role (investor or expert)
   - Role-specific onboarding collects relevant information
   - Profile data is stored in respective tables
   - Session is established for authenticated use

2. **Content Consumption and Interaction**
   - Dashboard displays personalized feed based on user preferences
   - Users can interact with content (like, comment, share)
   - Content interactions are tracked for personalization

3. **Market Data Integration**
   - Real-time or scheduled fetching of market data
   - Processing and displaying market trends
   - Alerting users about relevant market changes

## External Dependencies

### Frontend Dependencies
- React and React DOM for UI rendering
- Radix UI for accessible component primitives
- TanStack Query (React Query) for data fetching and caching
- Wouter for routing
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for form handling
- Zod for validation

### Backend Dependencies
- Express for API server
- Drizzle ORM for database operations
- @neondatabase/serverless for Postgres connectivity
- Connect-pg-simple for session management
- Zod for input validation

## Database Schema

The application uses a MongoDB document-based schema with the following key collections:

1. **users** - Core user documents with embedded profiles
   - Authentication data
   - Profile information
   - User type (investor or expert)
   - Embedded `investorProfile` subdocument for investor-specific data
   - Embedded `expertProfile` subdocument for expert-specific data

2. **posts** - Content shared in the platform
   - Different content types (analysis, news, debate, quiz)
   - Engagement metrics
   - References to user documents

3. **marketdata** - Financial market information
   - Stock prices and market indices
   - Real-time price changes and percentages

4. **watchlistassets** - User watchlist tracking
   - User-specific asset monitoring
   - Price alerts and notifications

5. **Additional Collections**: Asset sentiment, price alerts, watchlist themes, and tribe tracking

### Migration Benefits
- **Embedded Documents**: User profiles are now embedded within user documents, eliminating joins
- **Flexible Schema**: Easy to add new fields for different user types without schema migrations
- **Better Performance**: Reduced database queries through document embedding
- **Scalability**: Horizontal scaling capabilities with MongoDB

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Mode**
   - `npm run dev` - Starts the development server using tsx for server-side TypeScript

2. **Production Build**
   - `npm run build` - Builds both client and server code
   - Vite for client-side bundles
   - esbuild for server-side code

3. **Production Runtime**
   - `npm run start` - Runs the production build
   - Serves static assets from the build directory
   - API endpoints through Express

4. **Database Management**
   - `npm run db:push` - Updates the database schema using Drizzle Kit

The application is configured with appropriate ports and process management for seamless deployment on Replit.

## Recent Changes (January 2025)

### Simplified Release Version
1. **UI Framework Migration**
   - Fully migrated to Shadcn UI components throughout the application
   - Enhanced component consistency and accessibility

2. **Navigation Updates** 
   - Hidden Loops from footer navigation, replaced with Stock Tips
   - Removed header navigation links (Watchlist, Portfolio, Debate, Quiz, News) from Home page for simplified release

3. **Enhanced Post Creation**
   - Implemented dual post creation functionality:
     - Tweet-like posts: Text/image content with 600 character limit
     - Stock Tips: Structured stock recommendations with entry/exit prices, target dates, and reasoning
   - Created EnhancedCreatePostModal with tabbed interface

4. **Stock Tips Feature**
   - New `/stock-tips` page with card-based display
   - Backend API support for stock tip creation and retrieval
   - Integration with existing post system using `postType: 'stock_tip'`

5. **Schema Updates**
   - Extended Post schema to support both tweet-like posts and stock tips
   - Added stock-specific fields: stockName, symbol, entryPrice, exitPrice, targetDate, tipType, reasoning, status

6. **Backend Simplification**
   - Removed all complex backend logic, database connections, and MongoDB/Mongoose dependencies
   - Simplified to minimal Express server with static demo endpoints
   - Converted to frontend-only demo with hardcoded data for UI showcase
   - Removed validation schemas and complex API routing - ready for separate backend implementation

7. **Complete Interactive Features Implementation (Latest)**
   - Full SPA navigation with React Router across all components
   - Real-time interactive features: Like, Comment, Share, Follow buttons with dynamic updates
   - Enhanced InteractionProvider context for state management across the app
   - CommentModal component with real-time commenting system
   - Visual feedback with animations, color changes, and backdrop-blur effects
   - Mobile-first touch interactions with active:scale-95 animations
   - Complete glassmorphism styling with 300ms transitions throughout
   - Analytics page integration with "View All" functionality from dashboard MarketOverview
   - Interactive features added to Stock Tips page with Follow buttons for tip authors

## Upcoming Features

1. **User Authentication System**
   - Complete login/logout functionality
   - Session management

2. **Investment Portfolio Tracking**
   - Personal investment dashboard
   - Performance analytics

3. **Expert Verification System**
   - Credential verification workflow
   - Expert ranking algorithm

4. **Community Interaction Features**
   - Real-time chat and discussions
   - Group investment rooms