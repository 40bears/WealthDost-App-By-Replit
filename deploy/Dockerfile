# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy all dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy the rest of the application code
COPY --from=builder /app/ ./ 

EXPOSE 5000

CMD ["npm", "run", "dev"]
