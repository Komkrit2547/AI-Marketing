import prisma from '../lib/prisma';

export const insightsService = {
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.aIInsight.findMany({
        skip,
        take: limit,
        orderBy: [{ rank: 'asc' }, { id: 'desc' }],
      }),
      prisma.aIInsight.count(),
    ]);
    // Ensure createdAt is always populated by extracting it from the ObjectId if missing
    const formattedData = data.map(item => {
      if (!item.createdAt && typeof item.id === 'string' && item.id.length === 24) {
        return {
          ...item,
          createdAt: new Date(parseInt(item.id.substring(0, 8), 16) * 1000)
        };
      }
      return item;
    });

    return { data: formattedData, total, page, limit };
  },

  async findById(id: string) {
    const item = await prisma.aIInsight.findUnique({ where: { id } });
    if (item && !item.createdAt && typeof item.id === 'string' && item.id.length === 24) {
      return {
        ...item,
        createdAt: new Date(parseInt(item.id.substring(0, 8), 16) * 1000)
      };
    }
    return item;
  },
};
