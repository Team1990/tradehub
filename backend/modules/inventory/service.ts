import { AppError } from '../../core/errors';
import * as invRepo from './repository';
import { UpdateInventoryDTO, StockTransactionDTO, CreateWarehouseDTO } from './types';

function parseInventory(inv: any) {
  return {
    ...inv,
    availableQty: Number(inv.availableQty),
    reservedQty: Number(inv.reservedQty),
    minStock: inv.minStock !== null ? Number(inv.minStock) : null,
    maxStock: inv.maxStock !== null ? Number(inv.maxStock) : null,
  };
}

// Warehouse
export async function listWarehouses(companyId: string) {
  return invRepo.findWarehousesByCompany(companyId);
}

export async function getWarehouse(id: string, companyId: string) {
  const wh = await invRepo.findWarehouseById(id);
  if (!wh) throw new AppError(404, 'Warehouse not found');
  return wh;
}

export async function createWarehouse(data: CreateWarehouseDTO, companyId: string) {
  const { locations, ...whData } = data;
  const wh = await invRepo.createWarehouse({ ...whData, companyId });
  if (locations) {
    for (const loc of locations) {
      await invRepo.createLocation({ ...loc, warehouseId: wh.id });
    }
  }
  return invRepo.findWarehouseById(wh.id);
}

// Inventory
export async function getProductInventory(productId: string) {
  return (await invRepo.findInventoryByProduct(productId)).map(parseInventory);
}

export async function getWarehouseInventory(warehouseId: string) {
  return (await invRepo.findInventoryByWarehouse(warehouseId)).map(parseInventory);
}

export async function updateInventory(productId: string, data: UpdateInventoryDTO) {
  const warehouseId = data.warehouseId;
  if (!warehouseId) throw new AppError(400, 'warehouseId is required');

  const updateData: Record<string, unknown> = {};
  if (data.availableQty !== undefined) updateData.availableQty = data.availableQty;
  if (data.minStock !== undefined) updateData.minStock = data.minStock;
  if (data.maxStock !== undefined) updateData.maxStock = data.maxStock;
  if (data.leadTimeDays !== undefined) updateData.leadTimeDays = data.leadTimeDays;
  if (data.stockVisibility) updateData.stockVisibility = data.stockVisibility;
  if (data.approximateQty) updateData.approximateQty = data.approximateQty;
  if (data.locationId !== undefined) updateData.locationId = data.locationId || null;

  const inv = await invRepo.upsertInventory(productId, warehouseId, updateData);
  return parseInventory(inv);
}

export async function getAllCompanyInventory(companyId: string) {
  return (await invRepo.findAllCompanyInventory(companyId)).map(parseInventory);
}

export async function getLowStock(companyId: string) {
  return invRepo.findLowStock(companyId);
}

// Stock Transactions
export async function recordTransaction(data: StockTransactionDTO, userId?: string) {
  const inv = await invRepo.findInventoryRecord(data.productId, data.warehouseId);
  if (!inv && data.direction === 'OUT') {
    throw new AppError(400, 'No inventory record exists for this product in the selected warehouse');
  }

  const txn = await invRepo.createTransaction({
    ...data,
    createdById: userId,
  });

  const qtyChange = data.direction === 'IN' ? data.qty : -data.qty;
  const currentQty = inv ? Number(inv.availableQty) : 0;
  const newQty = Math.max(0, currentQty + qtyChange);
  const newReserved = data.type === 'SALE' && data.direction === 'OUT'
    ? Math.max(0, (inv ? Number(inv.reservedQty) : 0) - data.qty)
    : (inv ? Number(inv.reservedQty) : 0);

  await invRepo.upsertInventory(data.productId, data.warehouseId, {
    availableQty: newQty,
    reservedQty: newReserved,
  });

  return txn;
}

export async function recordBulkTransactions(transactions: StockTransactionDTO[], userId?: string) {
  const results = [];
  for (const txn of transactions) {
    results.push(await recordTransaction(txn, userId));
  }
  return results;
}

export async function getTransactions(productId?: string, warehouseId?: string, type?: string, page = 1, limit = 50) {
  return invRepo.findTransactions(productId, warehouseId, type, limit, (page - 1) * limit);
}
