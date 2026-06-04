'use client';

import { useQuery } from '@tanstack/react-query';
import { businessesService } from '@/services/businesses';

export function useBusinesses(page = 1, limit = 20, province?: string) {
  return useQuery({
    queryKey: ['businesses', page, limit, province],
    queryFn: () => businessesService.getAll(page, limit, province),
  });
}

export function useBusinessItem(id: string) {
  return useQuery({
    queryKey: ['businesses', id],
    queryFn: () => businessesService.getById(id),
    enabled: !!id,
  });
}
