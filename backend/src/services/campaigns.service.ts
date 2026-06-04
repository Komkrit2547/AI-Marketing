import prisma from '../lib/prisma';
import type { CreateCampaignInput } from '../validators/campaign';

export const campaignsService = {
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.campaign.count(),
    ]);

    const formattedData = data.map(item => {
      const isMissingDates = (!item.createdAt || !item.updatedAt);
      if (isMissingDates && typeof item.id === 'string' && item.id.length === 24) {
        const fallbackDate = new Date(parseInt(item.id.substring(0, 8), 16) * 1000);
        return {
          ...item,
          createdAt: item.createdAt || fallbackDate,
          updatedAt: item.updatedAt || fallbackDate,
        };
      }
      return item;
    });

    return { data: formattedData, total, page, limit };
  },

  async findById(id: string) {
    const item = await prisma.campaign.findUnique({ where: { id } });
    if (item && (!item.createdAt || !item.updatedAt) && typeof item.id === 'string' && item.id.length === 24) {
      const fallbackDate = new Date(parseInt(item.id.substring(0, 8), 16) * 1000);
      return {
        ...item,
        createdAt: item.createdAt || fallbackDate,
        updatedAt: item.updatedAt || fallbackDate,
      };
    }
    return item;
  },

  async create(input: CreateCampaignInput) {
    return prisma.campaign.create({
      data: {
        title: input.title,
        description: input.description,
        caption: input.caption,
        couponText: input.couponText,
        status: input.status,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      },
    });
  },
};
