import { fetchApi } from '@/lib/api';
import type { ApiResponse, News } from '@/types';

export const newsService = {
  getAll(page = 1, limit = 20) {
    return fetchApi<ApiResponse<News[]>>(`/news?page=${page}&limit=${limit}`);
  },
  getById(id: string) {
    return fetchApi<ApiResponse<News>>(`/news/${id}`);
  },
};
