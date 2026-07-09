'use client';

import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/news';

export function useNews(date?: string) {
  return useQuery({
    queryKey: ['news', date],
    queryFn: () => newsService.getNewsData(date),
  });
}

export function useWeather(date?: string, district?: string) {
  return useQuery({
    queryKey: ['weather', date, district],
    queryFn: () => newsService.getLatestWeather(date, district),
    refetchInterval: 60000, // Change to 60 seconds, as weather doesn't update every 3 seconds
  });
}
