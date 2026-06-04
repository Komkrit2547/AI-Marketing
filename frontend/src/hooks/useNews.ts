'use client';

import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news';

export function useNews(date?: string) {
  return useQuery({
    queryKey: ['news', date],
    queryFn: () => newsService.getNewsData(date),
  });
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: () => newsService.getLatestWeather(),
    refetchInterval: 3000, // Poll every 3 seconds for near real-time
  });
}
