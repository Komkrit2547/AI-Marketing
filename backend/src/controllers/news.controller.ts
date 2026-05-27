import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/news.service';

export const newsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await newsService.findAll(page, limit);
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
      const item = await newsService.findById(String(req.params.id));
      if (!item) {
        res.status(404).json({ success: false, error: 'News not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  },
};
