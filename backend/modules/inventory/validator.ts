import { z } from 'zod';

export const createWarehouseSchema = z.object({
  name: z.string().min(2).max(200),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  contact: z.string().max(50).optional(),
  locations: z.array(z.object({
    rack: z.string().optional(),
    shelf: z.string().optional(),
    bin: z.string().optional(),
    barcode: z.string().optional(),
  })).optional(),
});

export const updateInventorySchema = z.object({
  availableQty: z.number().min(0).optional(),
  minStock: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  leadTimeDays: z.number().int().min(0).optional(),
  stockVisibility: z.enum(['EXACT', 'APPROXIMATE', 'READY_STOCK', 'MADE_TO_ORDER', 'OUT_OF_STOCK']).optional(),
  approximateQty: z.string().optional(),
  warehouseId: z.string().optional(),
  locationId: z.string().optional(),
});

export const stockTransactionSchema = z.object({
  type: z.enum(['PURCHASE', 'STOCK_IN', 'SALE', 'STOCK_OUT', 'RETURN', 'DAMAGE', 'TRANSFER', 'ADJUSTMENT']),
  productId: z.string().min(1),
  warehouseId: z.string().min(1),
  locationId: z.string().optional(),
  qty: z.number().positive(),
  direction: z.enum(['IN', 'OUT']),
  refType: z.string().optional(),
  refId: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const bulkStockSchema = z.object({
  transactions: z.array(stockTransactionSchema).min(1).max(100),
});
