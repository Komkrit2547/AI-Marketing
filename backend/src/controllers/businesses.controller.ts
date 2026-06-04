import { Request, Response } from 'express';
import { businessesService } from '../services/businesses.service';

export const businessesController = {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const province = req.query.province as string;

      const result = await businessesService.findAll(page, limit, province);
      res.json(result);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const business = await businessesService.findById(req.params.id as string);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json(business);
    } catch (error) {
      console.error('Error fetching business by id:', error);
      res.status(500).json({ error: 'Failed to fetch business' });
    }
  },
};
