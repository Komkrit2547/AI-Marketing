import prisma from '../lib/prisma';

export const newsService = {
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.news.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.news.count(),
    ]);
    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.news.findUnique({ where: { id } });
  },
};
