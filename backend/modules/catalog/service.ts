import { AppError } from '../../core/errors';
import { generateSlug } from '../../core/utils/helpers';
import * as catalogRepo from './repository';
import { CreateProductDTO, UpdateProductDTO } from './types';
import { Prisma } from '@prisma/client';

function parseProduct(p: any) {
  return {
    ...p,
    images: JSON.parse(p.images || '[]'),
    tags: JSON.parse(p.tags || '[]'),
    specs: JSON.parse(p.specs || '{}'),
  };
}

export async function listProducts(params: {
  page: number; limit: number; search?: string; categoryId?: string;
  minPrice?: number; maxPrice?: number; sortBy: string; sortOrder: 'asc' | 'desc';
  status?: string; companyId?: string; brandId?: string;
}) {
  const where: Prisma.ProductWhereInput = {};
  if (params.status) where.status = params.status;
  else where.status = 'ACTIVE';
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
      { tags: { contains: params.search } },
      { hsnCode: { contains: params.search } },
    ];
  }
  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.companyId) where.companyId = params.companyId;
  if (params.brandId) where.brandId = params.brandId;
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {};
    if (params.minPrice !== undefined) where.price.gte = params.minPrice;
    if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
  }

  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[params.sortBy] = params.sortOrder;

  const [products, total] = await Promise.all([
    catalogRepo.findProducts(where, orderBy as Prisma.ProductOrderByWithRelationInput, (params.page - 1) * params.limit, params.limit),
    catalogRepo.countProducts(where),
  ]);

  return { products: products.map(parseProduct), total };
}

export async function getProduct(id: string) {
  const product = await catalogRepo.findProductById(id);
  if (!product) throw new AppError(404, 'Product not found');
  return parseProduct(product);
}

export async function createProduct(data: CreateProductDTO, companyId: string, imageFiles: Express.Multer.File[]) {
  const baseSlug = generateSlug(data.title);
  const existing = await catalogRepo.findProductBySlug(baseSlug);
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
  const images = imageFiles.map(f => `/uploads/${f.filename}`);

  const product = await catalogRepo.createProduct({
    title: data.title,
    description: data.description,
    shortDesc: data.shortDesc,
    slug,
    images: JSON.stringify(images),
    company: { connect: { id: companyId } },
    category: { connect: { id: data.categoryId } },
    brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
    price: data.price,
    moqPrice: data.moqPrice,
    minOrderQty: data.minOrderQty,
    unit: data.unit,
    tags: JSON.stringify(data.tags),
    gstRate: data.gstRate,
    hsnCode: data.hsnCode,
    specs: JSON.stringify(data.specs || {}),
  });
  return parseProduct(product);
}

export async function updateProduct(id: string, data: UpdateProductDTO, companyId: string, imageFiles: Express.Multer.File[]) {
  const existing = await catalogRepo.findProductById(id);
  if (!existing) throw new AppError(404, 'Product not found');
  if (existing.companyId !== companyId) throw new AppError(403, 'Not authorized');

  const updateData: Record<string, unknown> = { ...data };
  if (data.tags) updateData.tags = JSON.stringify(data.tags);
  if (data.specs) updateData.specs = JSON.stringify(data.specs);
  if (imageFiles.length > 0) {
    const currentImages: string[] = JSON.parse(existing.images || '[]');
    updateData.images = JSON.stringify([...currentImages, ...imageFiles.map(f => `/uploads/${f.filename}`)]);
  }

  const updated = await catalogRepo.updateProduct(id, updateData as Prisma.ProductUpdateInput);
  return parseProduct(updated);
}

export async function deleteProduct(id: string, companyId: string) {
  const existing = await catalogRepo.findProductById(id);
  if (!existing) throw new AppError(404, 'Product not found');
  if (existing.companyId !== companyId) throw new AppError(403, 'Not authorized');
  await catalogRepo.deleteProduct(id);
}

export async function listSellerProducts(companyId: string) {
  const products = await catalogRepo.findProductsByCompany(companyId);
  return products.map(parseProduct);
}

export async function listCategories() {
  return catalogRepo.findRootCategories();
}

export async function getCategory(id: string) {
  return catalogRepo.findCategoryById(id);
}

export async function listBrands() {
  return catalogRepo.findBrands();
}
