FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

# Copy package files
COPY scraper/package*.json ./
COPY prisma/ ./prisma/

# Install dependencies
RUN npm install
RUN npm install prisma@5.22.0 @prisma/client@5.22.0

# Generate Prisma Client
RUN npx prisma@5.22.0 generate

# Copy the rest of the application
COPY scraper/ .

# Run the TypeScript app
CMD ["npm", "start"]
