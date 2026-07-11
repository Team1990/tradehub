import { Router } from 'express';
import * as ctrl from './controller';

const router = Router();

router.get('/', ctrl.listCategories);
router.get('/brands', ctrl.listBrands);
router.get('/:id', ctrl.getCategory);

export default router;
