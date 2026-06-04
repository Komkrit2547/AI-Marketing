export interface News {
  id: string;
  title: string;
  content?: string;
  source: string;
  url?: string;
  category?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  recommendation?: string;
  category?: string;
  relatedNewsId?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  caption?: string;
  couponText?: string;
  status: 'draft' | 'active' | 'archived';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  placeId?: string;
  name: string;
  category?: string;
  address?: string;
  city?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  googleUrl?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
  pagination?: Pagination;
}
