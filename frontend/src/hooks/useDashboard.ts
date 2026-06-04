'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => dashboardService.getOverview(),
  });
}
