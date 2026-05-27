import { Router } from 'express';
import { newsRoutes } from './news.routes';
import { insightsRoutes } from './insights.routes';
import { campaignsRoutes } from './campaigns.routes';

const router = Router();

router.use('/news', newsRoutes);
router.use('/insights', insightsRoutes);
router.use('/campaigns', campaignsRoutes);

export const routes = router;
