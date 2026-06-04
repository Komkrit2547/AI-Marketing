import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  caption: z.string().optional(),
  couponText: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const updateCampaignSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  caption: z.string().optional(),
  couponText: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
