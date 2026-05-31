# syntax=docker/dockerfile:1

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# gen-certs writes to src/certs/; compiled server reads from dist/certs/
RUN npm run gen-certs \
 && mkdir -p dist/certs \
 && cp src/certs/server.key dist/certs/server.key \
 && cp src/certs/server.crt dist/certs/server.crt

# ── Stage 2: Run ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001 3443

CMD ["node", "dist/index.js"]
