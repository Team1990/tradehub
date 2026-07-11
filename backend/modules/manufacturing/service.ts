import { AppError } from '../../core/errors';
import * as bomRepo from './repository';
import { CreateBOMDTO } from './types';
import prisma from '../../core/database';

export async function createBOM(data: CreateBOMDTO, companyId: string) {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) throw new AppError(404, 'Product not found');
  if (product.companyId !== companyId) throw new AppError(403, 'Not authorized');

  const bom = await bomRepo.createBOM({
    name: data.name, description: data.description,
    productId: data.productId, outputQty: data.outputQty,
  });

  for (const item of data.items) {
    await bomRepo.createBOMItem({ bomId: bom.id, componentId: item.componentId, quantity: item.quantity });
  }

  return bomRepo.findBOMById(bom.id);
}

export async function getBOM(id: string) {
  const bom = await bomRepo.findBOMById(id);
  if (!bom) throw new AppError(404, 'BOM not found');
  return bom;
}

export async function listBOMs(companyId: string) {
  return bomRepo.findBOMsByCompany(companyId);
}

export async function assembleProduct(bomId: string, quantity: number, warehouseId: string, companyId: string) {
  const bom = await bomRepo.findBOMById(bomId);
  if (!bom) throw new AppError(404, 'BOM not found');

  // Check component availability and reserve stock
  for (const item of bom.items) {
    const inv = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: item.componentId, warehouseId } },
    });
    const needed = item.quantity * quantity;
    const available = inv ? Number(inv.availableQty) : 0;
    if (available < needed) {
      throw new AppError(400, `Insufficient stock for ${item.componentProduct.title}: need ${needed}, have ${available}`);
    }
  }

  // Deduct components
  for (const item of bom.items) {
    const needed = item.quantity * quantity;
    const inv = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: item.componentId, warehouseId } },
    });
    if (inv) {
      await prisma.inventory.update({
        where: { productId_warehouseId: { productId: item.componentId, warehouseId } },
        data: { availableQty: Number(inv.availableQty) - needed },
      });
    }

    // Record stock-out transaction for each component
    await prisma.stockTransaction.create({
      data: {
        type: 'MANUFACTURING',
        direction: 'OUT',
        qty: needed,
        productId: item.componentId,
        warehouseId,
        notes: `Assembled into ${bom.product.title} (BOM: ${bom.name})`,
      },
    });
  }

  // Add finished product to inventory
  const outputQty = quantity * bom.outputQty;
  const finInv = await prisma.inventory.findUnique({
    where: { productId_warehouseId: { productId: bom.productId, warehouseId } },
  });
  if (finInv) {
    await prisma.inventory.update({
      where: { productId_warehouseId: { productId: bom.productId, warehouseId } },
      data: { availableQty: Number(finInv.availableQty) + outputQty },
    });
  } else {
    await prisma.inventory.create({
      data: { productId: bom.productId, warehouseId, availableQty: outputQty },
    });
  }

  // Record stock-in transaction for finished product
  await prisma.stockTransaction.create({
    data: {
      type: 'MANUFACTURING',
      direction: 'IN',
      qty: outputQty,
      productId: bom.productId,
      warehouseId,
      notes: `Assembled from ${bom.items.length} components (BOM: ${bom.name})`,
    },
  });

  return { message: 'Assembly complete', outputQty };
}
