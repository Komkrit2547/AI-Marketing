import { Router } from 'express';
import { insightsRoutes } from './insights.routes';
import { campaignsRoutes } from './campaigns.routes';
import { businessesRoutes } from './businesses.routes';
import { newsRoutes } from './news.routes';

import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/insights', insightsRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/businesses', businessesRoutes);
router.use('/news', newsRoutes);

export const routes = router;
