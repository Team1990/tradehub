import { AppError } from '../../core/errors';
import { generateOrderNumber, generateInvoiceNumber } from '../../core/utils/helpers';
import * as oRepo from './repository';
import { CreateOrderDTO, CreateCustomerDTO } from './types';
import prisma from '../../core/database';

export async function createOrder(data: CreateOrderDTO, buyerId: string, supplierId?: string) {
  const orderNumber = generateOrderNumber();
  let subtotal = 0;

  for (const item of data.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new AppError(404, `Product ${item.productId} not found`);
    subtotal += item.qty * item.unitPrice;
  }

  const taxAmount = 0; // calculate from product GST rates if needed
  const totalAmount = subtotal + taxAmount;

  const order = await oRepo.createOrder({
    orderNumber, buyerId, supplierId, subtotal, taxAmount, totalAmount, notes: data.notes,
  });

  for (const item of data.items) {
    await oRepo.createOrderItem({
      orderId: order.id, productId: item.productId,
      qty: item.qty, unitPrice: item.unitPrice,
      subtotal: item.qty * item.unitPrice,
    });
  }

  return oRepo.findOrderById(order.id);
}

export async function getOrder(id: string, userId: string) {
  const order = await oRepo.findOrderById(id);
  if (!order) throw new AppError(404, 'Order not found');
  return order;
}

export async function listMyOrders(userId: string, page = 1, limit = 20) {
  const [orders, total] = await Promise.all([
    oRepo.findOrdersByBuyer(userId, (page - 1) * limit, limit),
    oRepo.countOrdersByBuyer(userId),
  ]);
  return { orders, total };
}

export async function listSupplierOrders(companyId: string, page = 1, limit = 20) {
  const [orders, total] = await Promise.all([
    oRepo.findOrdersBySupplier(companyId, (page - 1) * limit, limit),
    oRepo.countOrdersBySupplier(companyId),
  ]);
  return { orders, total };
}

export async function updateOrderStatus(id: string, status: string, companyId: string) {
  const order = await oRepo.findOrderById(id);
  if (!order) throw new AppError(404, 'Order not found');
  return oRepo.updateOrder(id, { status });
}

// Customers
export async function listCustomers(companyId: string) {
  return oRepo.findCustomersByCompany(companyId);
}

export async function createCustomer(data: CreateCustomerDTO, companyId: string, userId: string) {
  return oRepo.createCustomer({ ...data, companyId, createdBy: userId });
}

// Invoices
export async function createInvoice(orderId: string, companyId: string, dueDate?: string, notes?: string) {
  const order = await oRepo.findOrderById(orderId);
  if (!order) throw new AppError(404, 'Order not found');
  const invoiceNumber = generateInvoiceNumber();
  return oRepo.createInvoice({
    invoiceNumber, orderId, companyId,
    amount: order.totalAmount, dueDate, notes,
  });
}

export async function listInvoices(companyId: string) {
  return oRepo.findInvoicesByCompany(companyId);
}
