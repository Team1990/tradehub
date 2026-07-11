import { Request, Response, NextFunction } from 'express';
import * as mfgService from './service';
import { createBOMSchema, assembleProductSchema } from './validator';
import prisma from '../../core/database';
import { AppError } from '../../core/errors';

async function getCompanyId(req: Request) {
  const c = await prisma.company.findUnique({ where: { ownerId: req.user.userId } });
  if (!c) throw new AppError(400, 'Create a company profile first');
  return c.id;
}

export async function createBOM(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createBOMSchema.parse(req.body);
    const cid = await getCompanyId(req);
    const bom = await mfgService.createBOM(data, cid);
    res.status(201).json({ success: true, data: bom });
  } catch (err) { next(err); }
}

export async function getBOM(req: Request, res: Response, next: NextFunction) {
  try {
    const bom = await mfgService.getBOM(String(req.params.id));
    res.json({ success: true, data: bom });
  } catch (err) { next(err); }
}

export async function listBOMs(req: Request, res: Response, next: NextFunction) {
  try {
    const cid = await getCompanyId(req);
    const boms = await mfgService.listBOMs(cid);
    res.json({ success: true, data: boms });
  } catch (err) { next(err); }
}

export async function assembleProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = assembleProductSchema.parse(req.body);
    const cid = await getCompanyId(req);
    const result = await mfgService.assembleProduct(data.bomId, data.quantity, data.warehouseId, cid);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
