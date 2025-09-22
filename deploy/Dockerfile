# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend + server
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy dependencies and built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 5000

# Start production server
CMD ["npm", "run", "start"]
