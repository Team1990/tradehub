import { Request, Response, NextFunction } from 'express';
import * as qService from './service';
import { createInquirySchema, createQuoteSchema, sendMessageSchema } from './validator';

export async function createInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createInquirySchema.parse(req.body);
    const inquiry = await qService.createInquiry(data, req.user.userId);
    res.status(201).json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

export async function listMyInquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { inquiries, total } = await qService.listMyInquiries(req.user.userId, page, limit);
    res.json({ success: true, data: inquiries, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function listReceivedInquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { inquiries, total } = await qService.listReceivedInquiries(req.user.userId, page, limit);
    res.json({ success: true, data: inquiries, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function updateInquiryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const inquiry = await qService.updateInquiryStatus(String(req.params.id), status, req.user.userId);
    res.json({ success: true, data: inquiry });
  } catch (err) { next(err); }
}

// Quotes
export async function createQuote(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createQuoteSchema.parse(req.body);
    const quote = await qService.createQuote(data, req.user.userId);
    res.status(201).json({ success: true, data: quote });
  } catch (err) { next(err); }
}

export async function getQuotes(req: Request, res: Response, next: NextFunction) {
  try {
    const quotes = await qService.getQuotesByInquiry(String(req.params.inquiryId), req.user.userId);
    res.json({ success: true, data: quotes });
  } catch (err) { next(err); }
}

// Messages
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const data = sendMessageSchema.parse(req.body);
    const msg = await qService.sendMessage(String(req.params.inquiryId), data.content, req.user.userId);
    res.status(201).json({ success: true, data: msg });
  } catch (err) { next(err); }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await qService.getMessages(String(req.params.inquiryId), req.user.userId);
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}
