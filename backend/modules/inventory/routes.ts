import { Router } from 'express';
import { authenticate, requireRole } from '../../core/middleware/auth';
import * as ctrl from './controller';

const router = Router();

// Warehouses
router.get('/warehouses', authenticate, requireRole('SELLER'), ctrl.listWarehouses);
router.get('/warehouses/:id', authenticate, requireRole('SELLER'), ctrl.getWarehouse);
router.post('/warehouses', authenticate, requireRole('SELLER'), ctrl.createWarehouse);

// Inventory
router.get('/', authenticate, requireRole('SELLER'), ctrl.getAllInventory);
router.get('/low-stock', authenticate, requireRole('SELLER'), ctrl.getLowStock);
router.get('/product/:productId', authenticate, ctrl.getProductInventory);
router.get('/warehouse/:warehouseId', authenticate, requireRole('SELLER'), ctrl.getWarehouseInventory);
router.patch('/product/:productId', authenticate, requireRole('SELLER'), ctrl.updateInventory);

// Stock Transactions
router.get('/transactions', authenticate, requireRole('SELLER'), ctrl.getTransactions);
router.post('/transactions', authenticate, requireRole('SELLER'), ctrl.recordTransaction);
router.post('/transactions/bulk', authenticate, requireRole('SELLER'), ctrl.recordBulkTransactions);

export default router;
