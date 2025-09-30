# build stage
FROM node:22-alpine AS build-stage

WORKDIR /app

RUN corepack enable \
  && corepack prepare pnpm@9.12.3 --activate

# Copy the application code
COPY . .

# Install app dependencies
RUN pnpm install

# Convert the template.env file to format:
# FOO=___FOO___
# Used to change those vars in runtime
RUN sed -i "s/\([^=]*\)=\(.*\)/\1=___\1___/" /app/.env.sample
RUN cp .env.sample .env.production

RUN  npm run api:build && NODE_ENV=production npm run build



#production stage
# Production stage using Caddy
FROM caddy:2-alpine AS production-stage

WORKDIR /app

# Copy Caddyfile
COPY deploy/Caddyfile /etc/caddy/Caddyfile

# Copy built assets from build-stage
COPY --from=build-stage /app/dist /usr/share/caddy/html

# Copy environment example for reference (if needed)
COPY --from=build-stage /app/.env.sample /usr/share/caddy/.env.sample

# Update build date in index.html
RUN sed -i "s/VERSION_BUILD_DATE/$(date +%s)/" /usr/share/caddy/html/public/index.html

EXPOSE 80

# # Set up entrypoint
COPY deploy/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]


