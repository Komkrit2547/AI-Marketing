import prisma from '../lib/prisma';

export const insightsService = {
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.aIInsight.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aIInsight.count(),
    ]);
    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.aIInsight.findUnique({ where: { id } });
  },
};
