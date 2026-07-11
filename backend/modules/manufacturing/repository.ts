import prisma from '../../core/database';

export function createBOM(data: {
  name: string; description?: string; productId: string; outputQty: number;
}) {
  return prisma.bOM.create({ data });
}

export function createBOMItem(data: { bomId: string; componentId: string; quantity: number }) {
  return prisma.bOMItem.create({ data });
}

export function findBOMById(id: string) {
  return prisma.bOM.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, title: true } },
      items: { include: { componentProduct: { select: { id: true, title: true, unit: true } } } },
    },
  });
}

export function findBOMsByCompany(companyId: string) {
  return prisma.bOM.findMany({
    where: { product: { companyId } },
    include: {
      product: { select: { id: true, title: true } },
      items: { include: { componentProduct: { select: { id: true, title: true, unit: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
