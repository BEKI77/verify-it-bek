# Builder stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Use --frozen-lockfile for CI/CD environments
RUN npm install --frozen-lockfile

COPY . .

# Build the React app
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy the build output from the builder stage to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html
COPY .env.local  .env.local
# Expose port 80 for nginx
EXPOSE 80

# The default nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]