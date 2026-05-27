import { fetchApi } from '@/lib/api';
import type { ApiResponse, AIInsight } from '@/types';

export const insightsService = {
  getAll(page = 1, limit = 20) {
    return fetchApi<ApiResponse<AIInsight[]>>(`/insights?page=${page}&limit=${limit}`);
  },
  getById(id: string) {
    return fetchApi<ApiResponse<AIInsight>>(`/insights/${id}`);
  },
};
