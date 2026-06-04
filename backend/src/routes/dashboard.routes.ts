import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/overview', dashboardController.getOverview);

export default router;
