import { Router } from 'express';
import { authenticate, requireRole } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

router.get('/dashboard', authenticate, requireRole('SELLER'), ctrl.getDashboard);
router.get('/products', authenticate, requireRole('SELLER'), ctrl.getProductAnalytics);
router.get('/customers', authenticate, requireRole('SELLER'), ctrl.getTopCustomers);
router.get('/sales', authenticate, requireRole('SELLER'), ctrl.getMonthlySales);

export default router;
