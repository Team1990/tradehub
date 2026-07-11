import prisma from '../../core/database';

export async function getDemandForecast(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId },
    include: {
      _count: { select: { orderItems: true } },
      inventory: { select: { availableQty: true, minStock: true } },
    },
  });

  return products.map(p => {
    const totalStock = p.inventory.reduce((s, i) => s + Number(i.availableQty), 0);
    const minStock = Math.min(...p.inventory.filter(i => i.minStock).map(i => Number(i.minStock)), 0);
    const orderCount = p._count.orderItems;
    const needsRestock = totalStock <= minStock && minStock > 0;

    return {
      productId: p.id,
      title: p.title,
      currentStock: totalStock,
      totalOrders: orderCount,
      needsRestock,
      suggestedReorderQty: needsRestock ? Math.max(minStock * 2 - totalStock, 10) : 0,
      confidence: orderCount > 0 ? Math.min(orderCount * 10, 95) : 30,
    };
  });
}

export async function getPriceSuggestions(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId, status: 'ACTIVE' },
    select: { id: true, title: true, price: true, categoryId: true },
  });

  const categoryIds = [...new Set(products.map(p => p.categoryId))];
  const categoryPrices = new Map<string, { count: number; sum: number }>();

  for (const catId of categoryIds) {
    const catProducts = await prisma.product.findMany({
      where: { categoryId: catId, companyId: { not: companyId }, status: 'ACTIVE' },
      select: { price: true },
    });
    if (catProducts.length > 0) {
      categoryPrices.set(catId, {
        count: catProducts.length,
        sum: catProducts.reduce((s, p) => s + p.price, 0),
      });
    }
  }

  return products.map(p => {
    const catData = categoryPrices.get(p.categoryId);
    const avgPrice = catData ? catData.sum / catData.count : null;
    const suggestion = avgPrice ? (avgPrice * 0.95) : p.price;
    const change = avgPrice ? ((p.price - suggestion) / suggestion * 100) : 0;

    return {
      productId: p.id,
      title: p.title,
      currentPrice: p.price,
      suggestedPrice: Math.round(suggestion * 100) / 100,
      marketAvgPrice: avgPrice ? Math.round(avgPrice * 100) / 100 : null,
      changePercent: Math.round(change * 100) / 100,
    };
  });
}

export async function autoCategorizeProduct(description: string): Promise<string | null> {
  const keywords: Record<string, string[]> = {
    'Electronics': ['electronic', 'led', 'circuit', 'battery', 'wire', 'cable', 'panel', 'light', 'power'],
    'Industrial': ['industrial', 'steel', 'bolt', 'bearing', 'valve', 'pump', 'motor', 'machinery'],
    'Automotive': ['automotive', 'brake', 'engine', 'oil', 'tyre', 'wheel', 'battery', 'car'],
    'Textile': ['fabric', 'textile', 'cotton', 'polyester', 'garment', 'cloth', 'yarn'],
    'Packaging': ['packaging', 'box', 'carton', 'wrap', 'bottle', 'container'],
  };

  const lower = description.toLowerCase();
  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const [cat, words] of Object.entries(keywords)) {
    const score = words.filter(w => lower.includes(w)).length;
    if (score > bestScore) { bestScore = score; bestCategory = cat; }
  }

  return bestCategory;
}
