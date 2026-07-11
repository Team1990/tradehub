import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../core/middleware/auth';
import { sendSuccess } from '../../core/errors';
import { AppError } from '../../core/errors';
import prisma from '../../core/database';
import { z } from 'zod';

const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().max(2000).optional() });
const router = Router();

router.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: String(req.params.productId) },
      include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const avg = await prisma.review.aggregate({
      where: { productId: String(req.params.productId) },
      _avg: { rating: true }, _count: true,
    });
    res.json({ success: true, data: { reviews, average: avg._avg?.rating, total: avg._count } });
  } catch (err) { next(err); }
});

router.post('/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = reviewSchema.parse(req.body);
    const productId = String(req.params.productId);
    const existing = await prisma.review.findUnique({
      where: { reviewerId_productId: { reviewerId: req.user.userId, productId } },
    });
    if (existing) throw new AppError(409, 'Already reviewed');
    const review = await prisma.review.create({
      data: { ...data, reviewerId: req.user.userId, productId },
      include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
});

export default router;
