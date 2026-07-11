import { Request, Response, NextFunction } from 'express';
import * as orderService from './service';
import { createOrderSchema, updateOrderStatusSchema, createCustomerSchema, createInvoiceSchema } from './validator';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

async function getCompanyId(req: Request) {
  const c = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
  if (!c) throw new AppError(400, 'Create a company profile first');
  return c.id;
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createOrderSchema.parse(req.body);
    const company = await prisma.company.findUnique({ where: { ownerId: req.user.userId } }).catch(() => null);
    const order = await orderService.createOrder(data, req.user.userId, company?.id);
    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
}

export async function getOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await orderService.getOrder(String(req.params.id), req.user.userId);
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

export async function listMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { orders, total } = await orderService.listMyOrders(req.user.userId, page, limit);
    res.json({ success: true, data: orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function listSupplierOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { orders, total } = await orderService.listSupplierOrders(cid, page, limit);
    res.json({ success: true, data: orders, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateOrderStatusSchema.parse(req.body);
    const cid = await getCompanyId(req);
    const order = await orderService.updateOrderStatus(String(req.params.id), data.status, cid);
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
}

// Customers
export async function listCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const customers = await orderService.listCustomers(cid);
    res.json({ success: true, data: customers });
  } catch (err) { next(err); }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createCustomerSchema.parse(req.body);
    const cid = await getCompanyId(req);
    const customer = await orderService.createCustomer(data, cid, req.user.userId);
    res.status(201).json({ success: true, data: customer });
  } catch (err) { next(err); }
}

// Invoices
export async function createInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createInvoiceSchema.parse(req.body);
    const cid = await getCompanyId(req);
    const invoice = await orderService.createInvoice(data.orderId, cid, data.dueDate, data.notes);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { next(err); }
}

export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const invoices = await orderService.listInvoices(cid);
    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
}
