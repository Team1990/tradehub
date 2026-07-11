import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  shortDesc: z.string().max(300).optional(),
  minOrderQty: z.number().int().positive().default(1),
  price: z.number().positive(),
  moqPrice: z.number().positive().optional(),
  unit: z.string().default('Piece'),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  gstRate: z.number().min(0).max(100).optional(),
  hsnCode: z.string().max(20).optional(),
  specs: z.record(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.string().optional(),
  companyId: z.string().optional(),
});
