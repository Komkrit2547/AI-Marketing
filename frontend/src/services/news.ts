import { fetchApi } from '@/lib/api';

export const newsService = {
  getNewsData(date?: string) {
    const query = date ? `?date=${date}` : '';
    return fetchApi<any>(`/news${query}`);
  },
  getLatestWeather(date?: string, district?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (district) params.append('district', district);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<any>(`/news/weather${queryString}`);
  }
};
