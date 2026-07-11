import { Request, Response, NextFunction } from 'express';
import * as invService from './service';
import { createWarehouseSchema, updateInventorySchema, stockTransactionSchema, bulkStockSchema } from './validator';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

function getCompanyId(req: Request): Promise<string> {
  return prisma.company.findUnique({ where: { ownerId: req.user.userId } }).then(c => {
    if (!c) throw new AppError(400, 'Create a company profile first');
    return c.id;
  });
}

// Warehouses
export async function listWarehouses(req: Request, res: Response, next: NextFunction) {
  try { const cid = await getCompanyId(req); const data = await invService.listWarehouses(cid); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

export async function getWarehouse(req: Request, res: Response, next: NextFunction) {
  try { const cid = await getCompanyId(req);     const data = await invService.getWarehouse(String(req.params.id), cid); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

export async function createWarehouse(req: Request, res: Response, next: NextFunction) {
  try { const data = createWarehouseSchema.parse(req.body); const cid = await getCompanyId(req); const wh = await invService.createWarehouse(data, cid); res.status(201).json({ success: true, data: wh }); }
  catch (err) { next(err); }
}

// Inventory
export async function getProductInventory(req: Request, res: Response, next: NextFunction) {
  try {     const data = await invService.getProductInventory(String(req.params.productId)); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

export async function getWarehouseInventory(req: Request, res: Response, next: NextFunction) {
  try {     const data = await invService.getWarehouseInventory(String(req.params.warehouseId)); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

export async function updateInventory(req: Request, res: Response, next: NextFunction) {
  try { const data = updateInventorySchema.parse(req.body);     const result = await invService.updateInventory(String(req.params.productId), data); res.json({ success: true, data: result }); }
  catch (err) { next(err); }
}

export async function getAllInventory(req: Request, res: Response, next: NextFunction) {
  try { const cid = await getCompanyId(req); const data = await invService.getAllCompanyInventory(cid); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

export async function getLowStock(req: Request, res: Response, next: NextFunction) {
  try { const cid = await getCompanyId(req); const data = await invService.getLowStock(cid); res.json({ success: true, data }); }
  catch (err) { next(err); }
}

// Stock Transactions
export async function recordTransaction(req: Request, res: Response, next: NextFunction) {
  try { const data = stockTransactionSchema.parse(req.body); const txn = await invService.recordTransaction(data, req.user.userId); res.status(201).json({ success: true, data: txn }); }
  catch (err) { next(err); }
}

export async function recordBulkTransactions(req: Request, res: Response, next: NextFunction) {
  try { const data = bulkStockSchema.parse(req.body); const txns = await invService.recordBulkTransactions(data.transactions, req.user.userId); res.status(201).json({ success: true, data: txns }); }
  catch (err) { next(err); }
}

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const data = await invService.getTransactions(req.query.productId as string, req.query.warehouseId as string, req.query.type as string, page, limit);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
