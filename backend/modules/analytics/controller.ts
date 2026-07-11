import { Request, Response, NextFunction } from 'express';
import * as analyticsService from './service';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

async function getCompanyId(req: Request) {
  const c = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
  if (!c) throw new AppError(400, 'No company profile');
  return c.id;
}

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await analyticsService.getDashboardStats(cid);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getProductAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await analyticsService.getProductAnalytics(cid);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getTopCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await analyticsService.getTopCustomers(cid, parseInt(req.query.limit as string) || 10);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getMonthlySales(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await analyticsService.getMonthlySales(cid);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}
