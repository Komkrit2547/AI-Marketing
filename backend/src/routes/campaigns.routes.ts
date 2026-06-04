import { Router } from 'express';
import { campaignsController } from '../controllers/campaigns.controller';

const router = Router();

router.get('/', campaignsController.getAll);
router.post('/', campaignsController.create);
router.get('/:id', campaignsController.getById);
router.patch('/:id', campaignsController.update);

export const campaignsRoutes = router;
