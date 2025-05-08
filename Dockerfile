# Simple Dockerfile for BPTAPPV5
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy server package.json and package-lock.json
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy server files
COPY server/ ./

# Create a public directory for static files
RUN mkdir -p public

# Create a simple index.html for the public directory
RUN echo '<!DOCTYPE html><html><head><title>Bright Prodigy Tools</title></head><body><h1>Bright Prodigy Tools API Server</h1><p>API server is running.</p></body></html>' > public/index.html

# Create a non-root user
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

# Set ownership
RUN chown -R appuser:appgroup /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Start the server
CMD ["node", "server.js"]
