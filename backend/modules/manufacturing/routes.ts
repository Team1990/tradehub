import { Router } from 'express';
import { authenticate, requireRole } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

router.get('/', authenticate, requireRole('SELLER'), ctrl.listBOMs);
router.get('/:id', authenticate, requireRole('SELLER'), ctrl.getBOM);
router.post('/', authenticate, requireRole('SELLER'), ctrl.createBOM);
router.post('/assemble', authenticate, requireRole('SELLER'), ctrl.assembleProduct);

export default router;
