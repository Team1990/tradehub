import { z } from 'zod';

const parseTags = (v: unknown) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
  return [];
};

const parseSpecs = (v: unknown) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, string>;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return {}; } }
  return {};
};

export const createProductSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  shortDesc: z.string().max(300).optional(),
  minOrderQty: z.coerce.number().int().positive().default(1),
  price: z.coerce.number().positive(),
  moqPrice: z.coerce.number().positive().optional(),
  unit: z.string().default('Piece'),
  categoryId: z.string().min(1),
  brandId: z.string().optional(),
  tags: z.preprocess(parseTags, z.array(z.string())).default([]),
  gstRate: z.coerce.number().min(0).max(100).optional(),
  hsnCode: z.string().max(20).optional(),
  specs: z.preprocess(parseSpecs, z.record(z.string())).optional(),
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
