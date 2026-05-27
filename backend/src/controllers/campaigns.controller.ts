import { Request, Response, NextFunction } from 'express';
import { campaignsService } from '../services/campaigns.service';
import { createCampaignSchema } from '../validators/campaign';

export const campaignsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await campaignsService.findAll(page, limit);
      res.json({
        success: true,
        data: result.data,
        pagination: { page: result.page, limit: result.limit, total: result.total },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await campaignsService.findById(String(req.params.id));
      if (!item) {
        res.status(404).json({ success: false, error: 'Campaign not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createCampaignSchema.parse(req.body);
      const campaign = await campaignsService.create(parsed);
      res.status(201).json({ success: true, data: campaign });
    } catch (err) {
      next(err);
    }
  },
};
