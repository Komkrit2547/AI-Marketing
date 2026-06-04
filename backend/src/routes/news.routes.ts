import { Router } from 'express';
import { newsController } from '../controllers/news.controller';

const router = Router();

router.get('/', newsController.getNewsData);
router.get('/weather', newsController.getLatestWeather);

export const newsRoutes = router;
