import prisma from '../../core/database';

export async function getDashboardStats(companyId: string) {
  const [products, inventory, orders, inquiries, customers] = await Promise.all([
    prisma.product.count({ where: { companyId } }),
    prisma.inventory.count({ where: { product: { companyId } } }),
    prisma.order.count({ where: { supplierId: companyId } }),
    prisma.inquiry.count({ where: { seller: { company: { id: companyId } } } }),
    prisma.customer.count({ where: { companyId } }),
  ]);

  const lowStock = await prisma.inventory.count({
    where: { product: { companyId }, minStock: { not: null }, availableQty: { lte: prisma.inventory.fields.minStock } },
  });

  const recentOrders = await prisma.order.findMany({
    where: { supplierId: companyId },
    include: { buyer: { select: { name: true } }, _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const revenue = await prisma.order.aggregate({
    where: { supplierId: companyId, status: { not: 'CANCELLED' } },
    _sum: { totalAmount: true },
  });

  return {
    stats: { products, inventory, orders, inquiries, customers, lowStock, revenue: revenue._sum.totalAmount || 0 },
    recentOrders,
  };
}

export async function getProductAnalytics(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId },
    include: {
      _count: { select: { inquiries: true, reviews: true, orderItems: true } },
      inventory: { select: { availableQty: true, reservedQty: true } },
      reviews: { select: { rating: true } },
    },
  });

  return products.map(p => ({
    id: p.id,
    title: p.title,
    totalInquiries: p._count.inquiries,
    totalOrders: p._count.orderItems,
    totalReviews: p._count.reviews,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    totalStock: p.inventory.reduce((s, i) => s + Number(i.availableQty), 0),
    reservedStock: p.inventory.reduce((s, i) => s + Number(i.reservedQty), 0),
  }));
}

export async function getTopCustomers(companyId: string, limit = 10) {
  const orders = await prisma.order.findMany({
    where: { supplierId: companyId },
    include: { buyer: { select: { id: true, name: true, email: true } } },
  });

  const customerMap = new Map<string, { name: string; email: string; orders: number; total: number }>();
  for (const o of orders) {
    const key = o.buyerId;
    const existing = customerMap.get(key) || { name: o.buyer.name, email: o.buyer.email || '', orders: 0, total: 0 };
    existing.orders++;
    existing.total += Number(o.totalAmount);
    customerMap.set(key, existing);
  }

  return Array.from(customerMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function getMonthlySales(companyId: string, months = 12) {
  const orders = await prisma.order.findMany({
    where: { supplierId: companyId, status: { not: 'CANCELLED' } },
    select: { totalAmount: true, createdAt: true },
  });

  const monthly = new Map<string, number>();
  const now = new Date();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthly.set(key, 0);
  }

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthly.has(key)) monthly.set(key, monthly.get(key)! + Number(o.totalAmount));
  }

  return Array.from(monthly.entries()).map(([month, sales]) => ({ month, sales }));
}
