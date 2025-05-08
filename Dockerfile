# Multi-stage build for BPT Application V5

# Build stage for client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# List the public directory to confirm files were copied correctly
RUN ls -la public/
RUN npm run build

# Build stage for server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --only=production
COPY server/ ./

# Production stage
FROM node:18-alpine
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

# Copy built artifacts from build stages
COPY --from=server-build --chown=appuser:appgroup /app/server ./server
COPY --from=client-build --chown=appuser:appgroup /app/client/build ./server/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Set the working directory to the server
WORKDIR /app/server

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Start the server
CMD ["node", "server.js"]
