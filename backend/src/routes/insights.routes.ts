import { Router } from 'express';
import { insightsController } from '../controllers/insights.controller';

const router = Router();

router.get('/', insightsController.getAll);
router.get('/:id', insightsController.getById);

export const insightsRoutes = router;
