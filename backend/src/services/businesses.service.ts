import prisma from '../lib/prisma';

export const businessesService = {
  async findAll(page: number = 1, limit: number = 20, province?: string) {
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    if (province) {
      where.province = province;
    }

    const [data, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.business.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.business.findUnique({ where: { id } });
  },
};
