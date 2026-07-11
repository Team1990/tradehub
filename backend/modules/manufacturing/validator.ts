import { z } from 'zod';

export const createBOMSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  productId: z.string().min(1),
  outputQty: z.number().positive().default(1),
  items: z.array(z.object({
    componentId: z.string().min(1),
    quantity: z.number().positive(),
  })).min(1),
});

export const assembleProductSchema = z.object({
  bomId: z.string().min(1),
  quantity: z.number().int().positive(),
  warehouseId: z.string().min(1),
});
