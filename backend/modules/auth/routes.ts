import { Router } from 'express';
import { authenticate } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', authenticate, ctrl.getProfile);
router.patch('/profile', authenticate, ctrl.updateProfile);
router.get('/company', authenticate, ctrl.getCompany);
router.put('/company', authenticate, ctrl.createOrUpdateCompany);

export default router;
