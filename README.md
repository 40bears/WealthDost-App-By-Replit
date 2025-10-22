# WealthDost Project

## Overview

This project is a React web application named WealthDost. It uses Vite for the frontend development. The API is implemented in a separate project. The project can be run locally or using Docker.

## Running the Project with Docker

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Steps to Run

1. Build and start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Access the application at:
   ```
   http://localhost:5000
   ```

### Docker Details

- The Dockerfile uses a multi-stage build:
  - Stage 1: Builds the client using Node.js 22 Alpine.
  - Stage 2: Serves static files using Nginx Alpine.
- The app runs on port 80 inside the container, which is mapped to port 5000 on the host.

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
- `npm run build`: Builds the frontend for production.
- `npm start`: Runs the production build (serves static files).
- `npm run check`: Runs TypeScript type checking.

## Additional Information

- The project uses Vite as the build tool.
- The frontend uses React with various Radix UI components.
- Tailwind CSS is used for styling.
- API calls should be configured to point to the separate API project.

## Troubleshooting

- If you encounter issues with Docker, check the logs:
  ```bash
  docker-compose logs
  ```
- Ensure the API project is running and accessible for API calls.
