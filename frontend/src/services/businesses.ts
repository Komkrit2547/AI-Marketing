import { fetchApi } from '@/lib/api';
import type { ApiResponse, Business } from '@/types';

export const businessesService = {
  getAll(page = 1, limit = 20, province?: string) {
    let url = `/businesses?page=${page}&limit=${limit}`;
    if (province) {
      url += `&province=${encodeURIComponent(province)}`;
    }
    return fetchApi<ApiResponse<Business[]>>(url);
  },
  getById(id: string) {
    return fetchApi<ApiResponse<Business>>(`/businesses/${id}`);
  },
};
