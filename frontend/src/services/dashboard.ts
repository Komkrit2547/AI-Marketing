import { fetchApi } from '@/lib/api';

export interface DashboardOverview {
  totalShops: number;
  currentMonthTrends: number;
  topPopularShops: Array<{
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    popularityScore: number;
  }>;
  keywords: string[];
}

export const dashboardService = {
  getOverview() {
    return fetchApi<DashboardOverview>('/dashboard/overview');
  },
};
