'use client';

import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news';

export function useNews(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['news', page, limit],
    queryFn: () => newsService.getAll(page, limit),
  });
}

export function useNewsItem(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsService.getById(id),
    enabled: !!id,
  });
}
