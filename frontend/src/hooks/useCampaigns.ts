'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns';
import type { Campaign } from '@/types';

export function useCampaigns(page = 1, limit = 20, date?: string) {
  return useQuery({
    queryKey: ['campaigns', page, limit, date],
    queryFn: () => campaignsService.getAll(page, limit, date),
  });
}

export function useCampaignItem(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Campaign>) => campaignsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      campaignsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
