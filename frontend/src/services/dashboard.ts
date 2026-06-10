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
  totalMonthlyCampaigns: number;
  totalMonthlyAiInsights: number;
}

export const dashboardService = {
  getOverview(params?: { year?: number; month?: number }) {
    const query = new URLSearchParams();
    if (params?.year) query.append('year', params.year.toString());
    if (params?.month) query.append('month', params.month.toString());
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<DashboardOverview>(`/dashboard/overview${queryString}`);
  },
};
