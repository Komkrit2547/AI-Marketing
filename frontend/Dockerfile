FROM node:20-bookworm AS builder
WORKDIR /app
COPY package.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
