import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import catalogRoutes from '../modules/catalog/routes';
import categoryRoutes from '../modules/catalog/category.routes';
import reviewRoutes from '../modules/catalog/review.routes';
import inventoryRoutes from '../modules/inventory/routes';
import quotationRoutes from '../modules/quotation/routes';
import orderRoutes from '../modules/orders/routes';
import manufacturingRoutes from '../modules/manufacturing/routes';
import analyticsRoutes from '../modules/analytics/routes';
import aiRoutes from '../modules/ai/routes';

const api = Router();

api.use('/auth', authRoutes);
api.use('/products', catalogRoutes);
api.use('/categories', categoryRoutes);
api.use('/reviews', reviewRoutes);
api.use('/inventory', inventoryRoutes);
api.use('/', quotationRoutes);
api.use('/orders', orderRoutes);
api.use('/customers', orderRoutes);
api.use('/invoices', orderRoutes);
api.use('/manufacturing', manufacturingRoutes);
api.use('/analytics', analyticsRoutes);
api.use('/ai', aiRoutes);

export default api;
