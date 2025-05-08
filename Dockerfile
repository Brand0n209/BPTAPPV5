# Multi-stage build for BPT Application V5

# Build stage for client
FROM node:16-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:16-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/build ./server/public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Set the working directory to the server
WORKDIR /app/server

# Start the server
CMD ["npm", "start"]
