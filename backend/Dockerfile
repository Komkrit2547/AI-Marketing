FROM node:20-bookworm AS builder
WORKDIR /app
COPY backend/package.json backend/tsconfig.json ./
RUN npm install
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY backend/src/ ./src/
RUN npm run build

FROM node:20-bookworm AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY backend/package.json ./
EXPOSE 4000
CMD ["node", "dist/index.js"]
