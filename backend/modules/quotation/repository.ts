import prisma from '../../core/database';

export function createInquiry(data: { productId: string; quantity: number; message?: string; buyerId: string; sellerId: string }) {
  return prisma.inquiry.create({
    data,
    include: { product: { select: { id: true, title: true } }, buyer: { select: { id: true, name: true } } },
  });
}

export function findInquiriesByBuyer(buyerId: string, skip: number, take: number) {
  return prisma.inquiry.findMany({
    where: { buyerId },
    include: {
      product: { select: { id: true, title: true, images: true } },
      seller: { select: { id: true, name: true, company: { select: { name: true } } } },
      messages: { take: 1, orderBy: { createdAt: 'desc' } },
      quotes: true,
    },
    orderBy: { createdAt: 'desc' },
    skip, take,
  });
}

export function countInquiriesByBuyer(buyerId: string) {
  return prisma.inquiry.count({ where: { buyerId } });
}

export function findInquiriesBySeller(sellerId: string, skip: number, take: number) {
  return prisma.inquiry.findMany({
    where: { sellerId },
    include: {
      product: { select: { id: true, title: true, images: true } },
      buyer: { select: { id: true, name: true } },
      messages: { take: 1, orderBy: { createdAt: 'desc' } },
      quotes: true,
    },
    orderBy: { createdAt: 'desc' },
    skip, take,
  });
}

export function countInquiriesBySeller(sellerId: string) {
  return prisma.inquiry.count({ where: { sellerId } });
}

export function findInquiryById(id: string) {
  return prisma.inquiry.findUnique({ where: { id } });
}

export function updateInquiryStatus(id: string, status: string) {
  return prisma.inquiry.update({ where: { id }, data: { status } });
}

// Quotes
export function createQuote(data: { inquiryId: string; price: number; moq?: number; validUntil?: string; notes?: string }) {
  return prisma.quote.create({ data });
}

export function findQuotesByInquiry(inquiryId: string) {
  return prisma.quote.findMany({ where: { inquiryId }, orderBy: { createdAt: 'desc' } });
}

// Messages
export function createMessage(data: { content: string; senderId: string; inquiryId: string }) {
  return prisma.message.create({ data, include: { sender: { select: { id: true, name: true, role: true } } } });
}

export function findMessagesByInquiry(inquiryId: string) {
  return prisma.message.findMany({
    where: { inquiryId },
    include: { sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

export function markMessagesRead(inquiryId: string, userId: string) {
  return prisma.message.updateMany({
    where: { inquiryId, senderId: { not: userId }, read: false },
    data: { read: true },
  });
}
