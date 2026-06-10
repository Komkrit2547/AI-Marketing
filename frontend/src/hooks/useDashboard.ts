'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export function useDashboard(params?: { year?: number; month?: number }) {
  return useQuery({
    queryKey: ['dashboard-overview', params?.year, params?.month],
    queryFn: () => dashboardService.getOverview(params),
  });
}
