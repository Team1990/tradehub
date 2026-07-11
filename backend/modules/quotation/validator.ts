import { z } from 'zod';

export const createInquirySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  message: z.string().max(2000).optional(),
});

export const createQuoteSchema = z.object({
  inquiryId: z.string().min(1),
  price: z.number().positive(),
  moq: z.number().int().positive().optional(),
  validUntil: z.string().optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    qty: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});
