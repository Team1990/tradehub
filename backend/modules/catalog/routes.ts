import { Router } from 'express';
import { authenticate, requireRole, optionalAuth } from '../../core/middleware/auth';
import { upload } from '../../core/middleware/upload';
import * as ctrl from './controller';

const router = Router();

router.get('/', optionalAuth, ctrl.listProducts);
router.get('/my', authenticate, requireRole('SELLER'), ctrl.listSellerProducts);
router.get('/:id', optionalAuth, ctrl.getProduct);
router.post('/', authenticate, requireRole('SELLER'), upload.array('images', 10), ctrl.createProduct);
router.patch('/:id', authenticate, requireRole('SELLER'), upload.array('images', 10), ctrl.updateProduct);
router.delete('/:id', authenticate, requireRole('SELLER'), ctrl.deleteProduct);

export default router;
