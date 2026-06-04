import prisma from '../lib/prisma';
import type { CreateCampaignInput, UpdateCampaignInput } from '../validators/campaign';

export const campaignsService = {
  async findAll(page: number = 1, limit: number = 20, dateStr?: string) {
    const skip = (page - 1) * limit;
    
    let whereClause = {};
    if (dateStr) {
      const startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateStr);
      endDate.setHours(23, 59, 59, 999);
      
      whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      };
    }

    const [data, total] = await Promise.all([
      prisma.campaign.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.campaign.count({ where: whereClause }),
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

  async update(id: string, input: UpdateCampaignInput) {
    return prisma.campaign.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.caption !== undefined && { caption: input.caption }),
        ...(input.couponText !== undefined && { couponText: input.couponText }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.startDate !== undefined && { startDate: input.startDate ? new Date(input.startDate) : null }),
        ...(input.endDate !== undefined && { endDate: input.endDate ? new Date(input.endDate) : null }),
      },
    });
  },
};
