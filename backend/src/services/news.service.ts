import prisma from '../lib/prisma';

export const newsService = {
  async getNewsData(date?: string) {
    let startOfDay, endOfDay;
    
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
      }
    }

    // Weather: always get the latest 1 record
    const weather = await prisma.weatherRecord.findFirst({
      orderBy: { id: 'desc' }
    });

    // Trending: from AIInsight
    const trendingWhere = startOfDay && endOfDay 
      ? { createdAt: { gte: startOfDay, lte: endOfDay } }
      : {};
    
    const trending = await prisma.aIInsight.findMany({
      where: trendingWhere,
      orderBy: { createdAt: 'desc' }
    });

    // News: from CommunityPost
    const newsWhere = startOfDay && endOfDay 
      ? { postedAt: { gte: startOfDay, lte: endOfDay } }
      : {};

    const news = await prisma.communityPost.findMany({
      where: newsWhere,
      orderBy: { postedAt: 'desc' }
    });

    return {
      weather,
      trending,
      news
    };
  },

  async getLatestWeather() {
    return prisma.weatherRecord.findFirst({
      orderBy: { id: 'desc' }
    });
  }
};
