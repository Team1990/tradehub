import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    qty: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
  notes: z.string().max(2000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[\d\s-]{7,15}$/).optional().or(z.literal('')),
  companyName: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export const createInvoiceSchema = z.object({
  orderId: z.string().min(1),
  dueDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
});
