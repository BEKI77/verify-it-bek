# Builder stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json  ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Only copy production node_modules and build output
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/next.config.ts  ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]