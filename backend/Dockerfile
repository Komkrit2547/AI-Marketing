FROM node:20-bookworm AS builder
WORKDIR /app
COPY backend/package.json backend/tsconfig.json ./
RUN npm install
RUN npm install prisma@5.22.0 @prisma/client@5.22.0
COPY prisma/ ./prisma/
RUN npx prisma@5.22.0 generate
COPY backend/src/ ./src/
RUN npm run build

FROM node:20-bookworm AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY thap_sakae_businesses_cleaned.json ./
COPY backend/package.json ./
EXPOSE 4000
CMD ["sh", "-c", "npx prisma@5.22.0 db push && node prisma/seed.js && node dist/index.js"]