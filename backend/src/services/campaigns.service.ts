import prisma from '../lib/prisma';
import type { CreateCampaignInput } from '../validators/campaign';

export const campaignsService = {
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaign.count(),
    ]);
    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.campaign.findUnique({ where: { id } });
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
