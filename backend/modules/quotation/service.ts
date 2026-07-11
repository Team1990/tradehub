import { AppError } from '../../core/errors';
import * as qRepo from './repository';
import { CreateInquiryDTO, CreateQuoteDTO } from './types';
import prisma from '../../core/database';

export async function createInquiry(data: CreateInquiryDTO, buyerId: string) {
  const product = await prisma.product.findUnique({ where: { id: data.productId }, include: { company: true } });
  if (!product) throw new AppError(404, 'Product not found');
  return qRepo.createInquiry({
    productId: data.productId,
    quantity: data.quantity,
    message: data.message,
    buyerId,
    sellerId: product.company.ownerId,
  });
}

export async function listMyInquiries(userId: string, page = 1, limit = 20) {
  const [inquiries, total] = await Promise.all([
    qRepo.findInquiriesByBuyer(userId, (page - 1) * limit, limit),
    qRepo.countInquiriesByBuyer(userId),
  ]);
  return { inquiries, total };
}

export async function listReceivedInquiries(userId: string, page = 1, limit = 20) {
  const [inquiries, total] = await Promise.all([
    qRepo.findInquiriesBySeller(userId, (page - 1) * limit, limit),
    qRepo.countInquiriesBySeller(userId),
  ]);
  return { inquiries, total };
}

export async function updateInquiryStatus(inquiryId: string, status: string, userId: string) {
  const inquiry = await qRepo.findInquiryById(inquiryId);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  if (inquiry.sellerId !== userId) throw new AppError(403, 'Not authorized');
  return qRepo.updateInquiryStatus(inquiryId, status);
}

// Quotes
export async function createQuote(data: CreateQuoteDTO, userId: string) {
  const inquiry = await qRepo.findInquiryById(data.inquiryId);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  if (inquiry.sellerId !== userId) throw new AppError(403, 'Not authorized');

  const quote = await qRepo.createQuote({
    inquiryId: data.inquiryId,
    price: data.price,
    moq: data.moq,
    validUntil: data.validUntil,
    notes: data.notes,
  });

  await qRepo.updateInquiryStatus(data.inquiryId, 'RESPONDED');
  return quote;
}

export async function getQuotesByInquiry(inquiryId: string, userId: string) {
  const inquiry = await qRepo.findInquiryById(inquiryId);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  if (inquiry.buyerId !== userId && inquiry.sellerId !== userId) throw new AppError(403, 'Not authorized');
  return qRepo.findQuotesByInquiry(inquiryId);
}

// Messages
export async function sendMessage(inquiryId: string, content: string, senderId: string) {
  const inquiry = await qRepo.findInquiryById(inquiryId);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  if (inquiry.buyerId !== senderId && inquiry.sellerId !== senderId) throw new AppError(403, 'Not part of this conversation');

  const msg = await qRepo.createMessage({ content, senderId, inquiryId });

  if (inquiry.status === 'OPEN') {
    await qRepo.updateInquiryStatus(inquiryId, 'RESPONDED');
  }

  return msg;
}

export async function getMessages(inquiryId: string, userId: string) {
  const inquiry = await qRepo.findInquiryById(inquiryId);
  if (!inquiry) throw new AppError(404, 'Inquiry not found');
  if (inquiry.buyerId !== userId && inquiry.sellerId !== userId) throw new AppError(403, 'Not authorized');

  await qRepo.markMessagesRead(inquiryId, userId);
  return qRepo.findMessagesByInquiry(inquiryId);
}
