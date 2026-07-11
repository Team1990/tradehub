import { Request, Response, NextFunction } from 'express';
import * as catalogService from './service';
import { createProductSchema, updateProductSchema, productQuerySchema } from './validator';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const params = productQuerySchema.parse(req.query);
    const { products, total } = await catalogService.listProducts(params);
    res.json({ success: true, data: products, pagination: { total, page: params.page, limit: params.limit, totalPages: Math.ceil(total / params.limit) } });
  } catch (err) { next(err); }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await catalogService.getProduct(String(req.params.id));
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createProductSchema.parse(req.body);
    const company = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
    if (!company) throw new AppError(400, 'Create a company profile first');
    const files = (req.files || []) as Express.Multer.File[];
    const product = await catalogService.createProduct(data, company.id, files);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProductSchema.parse(req.body);
    const company = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
    if (!company) throw new AppError(400, 'No company profile');
    const files = (req.files || []) as Express.Multer.File[];
    const product = await catalogService.updateProduct(String(req.params.id), data, company.id, files);
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
    if (!company) throw new AppError(400, 'No company profile');
    await catalogService.deleteProduct(String(req.params.id), company.id);
    res.json({ success: true, data: { message: 'Product deleted' } });
  } catch (err) { next(err); }
}

export async function listSellerProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
    if (!company) return res.json({ success: true, data: [] });
    const products = await catalogService.listSellerProducts(company.id);
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
}

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await catalogService.listCategories();
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await catalogService.getCategory(String(req.params.id));
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
}

export async function listBrands(_req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await catalogService.listBrands();
    res.json({ success: true, data: brands });
  } catch (err) { next(err); }
}
