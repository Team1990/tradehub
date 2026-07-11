import { Request, Response, NextFunction } from 'express';
import * as aiService from './service';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

async function getCompanyId(req: Request) {
  const c = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
  if (!c) throw new AppError(400, 'No company profile');
  return c.id;
}

export async function getDemandForecast(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await aiService.getDemandForecast(cid);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getPriceSuggestions(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const data = await aiService.getPriceSuggestions(cid);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function autoCategorize(req: Request, res: Response, next: NextFunction) {
  try {
    const { description } = req.body;
    if (!description) throw new AppError(400, 'Description is required');
    const category = await aiService.autoCategorizeProduct(description);
    res.json({ success: true, data: { suggestedCategory: category } });
  } catch (err) { next(err); }
}
