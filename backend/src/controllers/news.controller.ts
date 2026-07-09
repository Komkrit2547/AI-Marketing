import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/news.service';

export const newsController = {
  async getNewsData(req: Request, res: Response, next: NextFunction) {
    try {
      const date = req.query.date as string;
      const data = await newsService.getNewsData(date);
      res.json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  async getLatestWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const date = req.query.date as string;
      const district = req.query.district as string;
      const data = await newsService.getLatestWeather(date, district);
      res.json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
};
