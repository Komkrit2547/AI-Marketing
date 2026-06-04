import { fetchApi } from '@/lib/api';
import type { ApiResponse, Campaign } from '@/types';

export const campaignsService = {
  getAll(page = 1, limit = 20, date?: string) {
    const url = `/campaigns?page=${page}&limit=${limit}${date ? `&date=${date}` : ''}`;
    return fetchApi<ApiResponse<Campaign[]>>(url);
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
  updateStatus(id: string, status: string) {
    return fetchApi<ApiResponse<Campaign>>(`/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
