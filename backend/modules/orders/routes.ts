import { Router } from 'express';
import { authenticate, requireRole } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

// Orders
router.post('/', authenticate, ctrl.createOrder);
router.get('/', authenticate, ctrl.listMyOrders);
router.get('/supplier', authenticate, requireRole('SELLER'), ctrl.listSupplierOrders);
router.get('/:id', authenticate, ctrl.getOrder);
router.patch('/:id/status', authenticate, requireRole('SELLER'), ctrl.updateOrderStatus);

// Customers
router.get('/customers', authenticate, requireRole('SELLER'), ctrl.listCustomers);
router.post('/customers', authenticate, requireRole('SELLER'), ctrl.createCustomer);

// Invoices
router.get('/invoices', authenticate, requireRole('SELLER'), ctrl.listInvoices);
router.post('/invoices', authenticate, requireRole('SELLER'), ctrl.createInvoice);

export default router;
