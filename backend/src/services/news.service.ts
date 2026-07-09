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

  async getLatestWeather(date?: string, district?: string) {
    let startOfDay, endOfDay;
    let targetDate = new Date(); // Default to today
    
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        targetDate = parsedDate;
        startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);
      }
    } else {
      startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
    }

    // 1. Current Weather
    let weatherWhere: any = {};
    if (district) {
      weatherWhere.district = district;
    }
    if (date) {
      // Find the latest record within that day
      weatherWhere.recordedAt = { gte: startOfDay, lte: endOfDay };
    }

    const current = await prisma.weatherRecord.findFirst({
      where: weatherWhere,
      orderBy: { id: 'desc' } // or recordedAt: 'desc' if it's indexed, but id is objectId so it works
    });

    // 2. 7-Day Forecast
    let forecastWhere: any = {
      forecastDate: { gte: startOfDay }
    };
    if (district) {
      forecastWhere.district = district;
    }

    const forecast = await prisma.weatherForecast.findMany({
      where: forecastWhere,
      orderBy: { forecastDate: 'asc' },
      take: 7
    });

    return {
      current,
      forecast
    };
  }
};
