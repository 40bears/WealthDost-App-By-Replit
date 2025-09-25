# WealthDost Project

## Overview

This project is a web application named WealthDost. It uses Node.js, Vite, and React for the frontend and backend development. The project can be run locally or using Docker.

## Running the Project with Docker

### Prerequisites

- Docker and Docker Compose installed on your machine.
- A `.env` file in the project root with necessary environment variables.

### Steps to Run

1. Build the Docker image:

   ```bash
   docker build -f deploy/Dockerfile -t app-wealthdost:latest .
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

3. Access the application at:
   ```
   http://localhost:5000
   ```

### Docker Details

- The Dockerfile uses a multi-stage build:
  - Stage 1: Builds the app using Node.js 22 Alpine.
  - Stage 2: Creates a production image with dependencies and built app.
- The app runs on port 5000 inside the container, which is mapped to port 5000 on the host.
- Environment variables are loaded from the `.env` file.

## Running the Project Locally (Without Docker)

### Prerequisites

- Node.js and npm installed.

### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Access the app at:
   ```
   http://localhost:3000
   ```

## Scripts

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the frontend and backend for production.
- `npm start`: Runs the production build.
- `npm run check`: Runs TypeScript type checking.
- `npm run db:push`: Pushes database schema changes using Drizzle Kit.

## Additional Information

- The project uses Vite as the build tool.
- The backend is built with Express and TypeScript.
- The frontend uses React with various Radix UI components.
- Tailwind CSS is used for styling.

## Troubleshooting

- If you encounter issues with Docker, check the logs:
  ```bash
  docker-compose logs
  ```
- Ensure the `.env` file is properly configured with all required environment variables.
