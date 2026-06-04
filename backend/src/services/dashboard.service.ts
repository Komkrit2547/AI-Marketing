import prisma from '../lib/prisma';

export const dashboardService = {
  async getOverview() {
    // 1. Total shops
    const totalShops = await prisma.business.count();

    // 2. Current month trends (AIInsight)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const currentMonthTrends = await prisma.aIInsight.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // 3. Top 5 Popular Shops
    // Fetch top 100 by reviewCount to have a good sample, then calculate a score
    const candidateShops = await prisma.business.findMany({
      where: {
        rating: { not: null },
        reviewCount: { not: null },
      },
      take: 100,
      orderBy: {
        reviewCount: 'desc'
      }
    });

    // Calculate score to average popularity based on rating and reviewCount
    const scoredShops = candidateShops.map((shop: any) => {
      const rating = shop.rating || 0;
      const reviewCount = shop.reviewCount || 0;
      // Popularity score = rating * log10(reviewCount)
      const score = rating * Math.log10(reviewCount > 0 ? reviewCount + 1 : 1);
      return { ...shop, popularityScore: score };
    });

    // Sort by score desc and take top 5
    scoredShops.sort((a: any, b: any) => b.popularityScore - a.popularityScore);
    const topPopularShops = scoredShops.slice(0, 5);

    // 4. Keyword Cloud (Top Trends/Insights from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentInsights = await prisma.aIInsight.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: { title: true },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
    
    const rawKeywords = recentInsights.map(insight => insight.title);
    const keywords = Array.from(new Set(rawKeywords));

    return {
      totalShops,
      currentMonthTrends,
      topPopularShops,
      keywords
    };
  }
};
