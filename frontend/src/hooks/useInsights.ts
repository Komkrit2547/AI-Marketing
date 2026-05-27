'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsService } from '@/services/insights';

export function useInsights(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['insights', page, limit],
    queryFn: () => insightsService.getAll(page, limit),
  });
}

export function useInsightItem(id: string) {
  return useQuery({
    queryKey: ['insights', id],
    queryFn: () => insightsService.getById(id),
    enabled: !!id,
  });
}
