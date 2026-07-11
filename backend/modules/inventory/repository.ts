import prisma from '../../core/database';

// Warehouses
export function findWarehousesByCompany(companyId: string) {
  return prisma.warehouse.findMany({
    where: { companyId },
    include: { _count: { select: { locations: true, inventory: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export function findWarehouseById(id: string) {
  return prisma.warehouse.findUnique({ where: { id }, include: { locations: true } });
}

export function createWarehouse(data: { name: string; address?: string; city?: string; state?: string; pincode?: string; contact?: string; companyId: string }) {
  return prisma.warehouse.create({ data });
}

export function updateWarehouse(id: string, data: Record<string, unknown>) {
  return prisma.warehouse.update({ where: { id }, data });
}

export function deleteWarehouse(id: string) {
  return prisma.warehouse.delete({ where: { id } });
}

// Locations
export function createLocation(data: { rack?: string; shelf?: string; bin?: string; barcode?: string; warehouseId: string }) {
  return prisma.warehouseLocation.create({ data });
}

// Inventory
export function findInventoryByProduct(productId: string) {
  return prisma.inventory.findMany({
    where: { productId },
    include: { warehouse: { select: { id: true, name: true, city: true } }, location: true },
  });
}

export function findInventoryByWarehouse(warehouseId: string) {
  return prisma.inventory.findMany({
    where: { warehouseId },
    include: { product: { select: { id: true, title: true, unit: true, price: true, images: true } }, location: true },
  });
}

export function findInventoryRecord(productId: string, warehouseId: string) {
  return prisma.inventory.findUnique({ where: { productId_warehouseId: { productId, warehouseId } } });
}

export function upsertInventory(productId: string, warehouseId: string, data: Record<string, unknown>) {
  return prisma.inventory.upsert({
    where: { productId_warehouseId: { productId, warehouseId } },
    update: data,
    create: { productId, warehouseId, ...data },
  });
}

export function findAllCompanyInventory(companyId: string) {
  return prisma.inventory.findMany({
    where: { product: { companyId } },
    include: {
      product: { select: { id: true, title: true, unit: true, price: true, images: true } },
      warehouse: { select: { id: true, name: true } },
      location: true,
    },
    orderBy: { lastUpdatedAt: 'desc' },
  });
}

export function findLowStock(companyId: string) {
  return prisma.inventory.findMany({
    where: { product: { companyId }, minStock: { not: null }, availableQty: { lte: 0 } },
    include: { product: { select: { id: true, title: true } }, warehouse: { select: { id: true, name: true } } },
  });
}

// Stock Transactions
export function createTransaction(data: {
  type: string; productId: string; warehouseId: string; locationId?: string;
  qty: number; direction: string; refType?: string; refId?: string; notes?: string; createdById?: string;
}) {
  return prisma.stockTransaction.create({ data });
}

export function findTransactions(productId?: string, warehouseId?: string, type?: string, limit = 50, offset = 0) {
  const where: Record<string, unknown> = {};
  if (productId) where.productId = productId;
  if (warehouseId) where.warehouseId = warehouseId;
  if (type) where.type = type;
  return prisma.stockTransaction.findMany({
    where,
    include: { product: { select: { id: true, title: true } }, warehouse: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}
