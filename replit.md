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

- **Technology**: Node.js with Express
- **API Architecture**: RESTful API design with standard CRUD operations
- **Runtime**: ESM-based Node.js application
- **Development Tools**: Using Vite for frontend development and tsx for TypeScript execution in development
- **Build Process**: Vite for frontend bundling, esbuild for server-side code

### Database

- **ORM**: Drizzle ORM for database interactions
- **Schema Management**: Using Drizzle Kit for database schema migrations
- **Database**: Designed to work with PostgreSQL (Neon DB)
- **Validation**: Zod integration with Drizzle for schema validation

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

The application uses a relational schema with the following key tables:

1. **users** - Core user information
   - Authentication data
   - Profile information
   - User type (investor or expert)

2. **investor_profiles** - Extended data for investors
   - Investment preferences
   - Risk persona
   - Return targets

3. **expert_profiles** - Extended data for financial experts
   - Credentials and verification
   - Specializations
   - Achievement tracking

4. **posts** - Content shared in the platform
   - Different content types (analysis, news, debate, quiz)
   - Engagement metrics

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

## Upcoming Features

1. **Investment Portfolio Tracking**
   - Personal investment dashboard
   - Performance analytics

2. **Expert Verification System**
   - Credential verification workflow
   - Expert ranking algorithm

3. **Community Interaction Features**
   - Real-time chat and discussions
   - Group investment rooms

4. **Advanced Analytics**
   - Custom financial charts and insights
   - Personalized investment recommendations