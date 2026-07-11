import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../errors';

// Express Request now has `user` via declaration merging (express.d.ts)

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, config.jwtSecret) as { userId: string; role: string };
    } catch {
      // ignore
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) return next(new AppError(403, 'Insufficient permissions'));
    next();
  };
}

export function getUserId(req: Request): string {
  return req.user!.userId;
}

export function getUserRole(req: Request): string {
  return req.user!.role;
}
