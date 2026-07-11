import prisma from '../../core/database';

export function createOrder(data: {
  orderNumber: string; buyerId: string; supplierId?: string;
  subtotal: number; taxAmount: number; totalAmount: number; notes?: string;
}) {
  return prisma.order.create({
    data,
    include: { items: true, buyer: { select: { id: true, name: true } } },
  });
}

export function createOrderItem(data: { orderId: string; productId: string; qty: number; unitPrice: number; subtotal: number }) {
  return prisma.orderItem.create({ data });
}

export function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { id: true, title: true, images: true } } } },
      buyer: { select: { id: true, name: true, email: true } },
      supplier: { select: { id: true, name: true } },
      invoices: true,
    },
  });
}

export function findOrdersByBuyer(buyerId: string, skip: number, take: number) {
  return prisma.order.findMany({
    where: { buyerId },
    include: { items: { include: { product: { select: { id: true, title: true } } } }, supplier: { select: { id: true, name: true } }, invoices: true },
    orderBy: { createdAt: 'desc' }, skip, take,
  });
}

export function countOrdersByBuyer(buyerId: string) {
  return prisma.order.count({ where: { buyerId } });
}

export function findOrdersBySupplier(supplierId: string, skip: number, take: number) {
  return prisma.order.findMany({
    where: { supplierId },
    include: { items: { include: { product: { select: { id: true, title: true } } } }, buyer: { select: { id: true, name: true } }, invoices: true },
    orderBy: { createdAt: 'desc' }, skip, take,
  });
}

export function countOrdersBySupplier(supplierId: string) {
  return prisma.order.count({ where: { supplierId } });
}

export function updateOrder(id: string, data: Record<string, unknown>) {
  return prisma.order.update({ where: { id }, data });
}

// Customers
export function findCustomersByCompany(companyId: string) {
  return prisma.customer.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
}

export function createCustomer(data: { name: string; email?: string; phone?: string; companyName?: string; address?: string; city?: string; state?: string; notes?: string; companyId: string; createdBy?: string }) {
  return prisma.customer.create({ data });
}

// Invoices
export function createInvoice(data: { invoiceNumber: string; orderId: string; companyId: string; amount: number; taxAmount?: number; dueDate?: string; notes?: string }) {
  return prisma.invoice.create({ data });
}

export function findInvoicesByCompany(companyId: string) {
  return prisma.invoice.findMany({ where: { companyId }, include: { order: { select: { orderNumber: true, buyer: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } });
}
