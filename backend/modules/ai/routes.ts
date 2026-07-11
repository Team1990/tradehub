import { Router } from 'express';
import { authenticate, requireRole } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

router.get('/demand-forecast', authenticate, requireRole('SELLER'), ctrl.getDemandForecast);
router.get('/price-suggestions', authenticate, requireRole('SELLER'), ctrl.getPriceSuggestions);
router.post('/auto-categorize', authenticate, requireRole('SELLER'), ctrl.autoCategorize);

export default router;
