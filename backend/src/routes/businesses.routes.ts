import { Router } from 'express';
import { businessesController } from '../controllers/businesses.controller';

const router = Router();

router.get('/', businessesController.getAll);
router.get('/:id', businessesController.getById);

export const businessesRoutes = router;
