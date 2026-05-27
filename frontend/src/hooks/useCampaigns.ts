'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns';
import type { Campaign } from '@/types';

export function useCampaigns(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['campaigns', page, limit],
    queryFn: () => campaignsService.getAll(page, limit),
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
