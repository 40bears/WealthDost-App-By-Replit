# Stage 1: Build the client
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the client
RUN npm run build

# Stage 2: Serve static files
FROM nginx:alpine

# Copy built client files
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
