FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

# Build frontend
FROM base AS frontend-build
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Build backend
FROM base AS backend-build
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci
COPY backend/tsconfig.json ./backend/
COPY backend/core/ ./backend/core/
COPY backend/modules/ ./backend/modules/
COPY backend/routes/ ./backend/routes/
COPY backend/app.ts backend/index.ts ./backend/
COPY backend/prisma/ ./backend/prisma/
RUN cd backend && npx prisma generate && npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl

# Copy backend node_modules (production only)
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy compiled backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=backend-build /app/backend/prisma ./backend/prisma

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Environment
ENV NODE_ENV=production
EXPOSE 8080

# Start: run migrations then start server
CMD cd backend && npx prisma migrate deploy && node dist/index.js
