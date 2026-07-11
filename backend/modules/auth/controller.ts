import { Request, Response, NextFunction } from 'express';
import * as authService from './service';
import { registerSchema, loginSchema, updateProfileSchema, companySchema } from './validator';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await authService.getProfile(req.user.userId);
    if (!profile) return res.status(404).json({ success: false, error: { message: 'User not found' } });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await authService.updateProfile(req.user.userId, data);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await authService.getCompany(req.user.userId);
    res.json({ success: true, data: company });
  } catch (err) { next(err); }
}

export async function createOrUpdateCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const data = companySchema.parse(req.body);
    const company = await authService.createOrUpdateCompany(req.user.userId, data);
    res.json({ success: true, data: company });
  } catch (err) { next(err); }
}
