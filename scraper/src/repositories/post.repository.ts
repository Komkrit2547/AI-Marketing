import { PrismaClient, CommunityPost, ScraperLog, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PostRepository {
  async findPostByHash(contentHash: string): Promise<CommunityPost | null> {
    return prisma.communityPost.findUnique({
      where: { contentHash },
    });
  }

  async createPost(data: Prisma.CommunityPostCreateInput): Promise<CommunityPost> {
    return prisma.communityPost.create({
      data,
    });
  }

  async updatePost(id: string, data: Prisma.CommunityPostUpdateInput): Promise<CommunityPost> {
    return prisma.communityPost.update({
      where: { id },
      data,
    });
  }

  async createScraperLog(data: Prisma.ScraperLogCreateInput): Promise<ScraperLog> {
    return prisma.scraperLog.create({
      data,
    });
  }

  async disconnect() {
    await prisma.$disconnect();
  }
}

export const postRepository = new PostRepository();
