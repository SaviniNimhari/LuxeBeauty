# ==========================================================
# LuxeBeauty Multi-Stage Production Dockerfile
# ==========================================================

# Stage 1: Build the React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

# Stage 2: Production Application Runtime
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose standard application port
EXPOSE 4000

# Add Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health || exit 1

# Start production server
CMD ["node", "backend/server.js"]
