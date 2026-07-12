import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../errors';
import { config } from '../config';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) return sendError(res, err);
  console.error('Unhandled error:', err);
  return sendError(res, new AppError(500, config.nodeEnv === 'production' ? 'Internal server error' : err.message));
}

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, new AppError(404, 'Route not found'));
}
