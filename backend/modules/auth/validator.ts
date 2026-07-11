import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[\d\s-]{7,15}$/).optional(),
  role: z.enum(['BUYER', 'SELLER']).default('BUYER'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[\d\s-]{7,15}$/).optional(),
});

export const companySchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[\d\s-]{7,15}$/).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  gstin: z.string().max(15).optional(),
});
