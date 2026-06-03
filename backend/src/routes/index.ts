import { Router } from 'express';
import { insightsRoutes } from './insights.routes';
import { campaignsRoutes } from './campaigns.routes';

const router = Router();

router.use('/insights', insightsRoutes);
router.use('/campaigns', campaignsRoutes);

export const routes = router;
