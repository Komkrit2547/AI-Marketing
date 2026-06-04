import { fetchApi } from '@/lib/api';

export const newsService = {
  getNewsData(date?: string) {
    const query = date ? `?date=${date}` : '';
    return fetchApi<any>(`/news${query}`);
  },
  getLatestWeather() {
    return fetchApi<any>(`/news/weather`);
  }
};
