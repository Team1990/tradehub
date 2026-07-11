import prisma from '../../core/database';
import { Prisma } from '@prisma/client';
import { CreateProductDTO } from './types';

const productInclude = {
  company: { select: { id: true, name: true, city: true, state: true, logoUrl: true, isVerified: true } },
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true } },
} as const;

export function findProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: productInclude });
}

export function findProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export function countProducts(where: Prisma.ProductWhereInput) {
  return prisma.product.count({ where });
}

export function findProducts(where: Prisma.ProductWhereInput, orderBy: Prisma.ProductOrderByWithRelationInput, skip: number, take: number) {
  return prisma.product.findMany({ where, include: productInclude, orderBy, skip, take });
}

export function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data, include: productInclude });
}

export function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data, include: productInclude });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export function findProductsByCompany(companyId: string) {
  return prisma.product.findMany({
    where: { companyId },
    include: { category: true, brand: true, inventory: { include: { warehouse: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// Categories
export function findRootCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: { include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } },
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id }, include: { parent: true, children: true } });
}

// Brands
export function findBrands() {
  return prisma.brand.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } });
}
