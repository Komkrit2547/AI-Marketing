import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
  async getOverview(req: Request, res: Response) {
    try {
      const data = await dashboardService.getOverview();
      res.json(data);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard overview' });
    }
  }
};
