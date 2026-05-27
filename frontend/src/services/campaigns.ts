import { fetchApi } from '@/lib/api';
import type { ApiResponse, Campaign } from '@/types';

export const campaignsService = {
  getAll(page = 1, limit = 20) {
    return fetchApi<ApiResponse<Campaign[]>>(`/campaigns?page=${page}&limit=${limit}`);
  },
  getById(id: string) {
    return fetchApi<ApiResponse<Campaign>>(`/campaigns/${id}`);
  },
  create(data: Partial<Campaign>) {
    return fetchApi<ApiResponse<Campaign>>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
