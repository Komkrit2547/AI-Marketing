import { PrismaClient } from '@prisma/client';

// Add basic query logging for performance monitoring
// In production, this can be filtered or disabled
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export default prisma;
