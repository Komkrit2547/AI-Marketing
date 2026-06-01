import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const before = await prisma.communityPost.count();
  console.log('CommunityPost before:', before, 'records');

  const logsBefore = await prisma.scraperLog.count();
  console.log('ScraperLog before:', logsBefore, 'records');

  await prisma.communityPost.deleteMany();
  await prisma.scraperLog.deleteMany();

  const after = await prisma.communityPost.count();
  console.log('CommunityPost after:', after, 'records');

  const logsAfter = await prisma.scraperLog.count();
  console.log('ScraperLog after:', logsAfter, 'records');

  await prisma.$disconnect();
}

main().catch(console.error);
