import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.aIPrediction.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.warehouseLocation.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.message.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.bOMItem.deleteMany();
  await prisma.bOM.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashed = await bcrypt.hash('admin123', 12);

  // Users
  const admin = await prisma.user.create({
    data: { email: 'admin@marketplace.com', password: hashed, name: 'Admin', role: 'ADMIN', isVerified: true },
  });
  const seller = await prisma.user.create({
    data: { email: 'seller@example.com', password: hashed, name: 'Acme Corp', role: 'SELLER', isVerified: true },
  });
  const buyer = await prisma.user.create({
    data: { email: 'buyer@example.com', password: hashed, name: 'Rajesh Sharma', role: 'BUYER', isVerified: true },
  });

  // Company
  const company = await prisma.company.create({
    data: {
      ownerId: seller.id, name: 'Acme Corporation', description: 'Leading manufacturer of industrial components and supplies',
      city: 'Mumbai', state: 'Maharashtra', gstin: '27AABCU9603R1ZM', isVerified: true,
    },
  });

  // Categories
  const electronics = await prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } });
  const industrial = await prisma.category.create({ data: { name: 'Industrial Supplies', slug: 'industrial-supplies' } });
  const automotive = await prisma.category.create({ data: { name: 'Automotive', slug: 'automotive' } });
  const textile = await prisma.category.create({ data: { name: 'Textile & Garments', slug: 'textile' } });
  const packaging = await prisma.category.create({ data: { name: 'Packaging', slug: 'packaging' } });

  // Sub-categories
  await prisma.category.create({ data: { name: 'LED Lighting', slug: 'led-lighting', parentId: electronics.id } });
  await prisma.category.create({ data: { name: 'Cables & Wires', slug: 'cables-wires', parentId: electronics.id } });
  await prisma.category.create({ data: { name: 'Fasteners', slug: 'fasteners', parentId: industrial.id } });
  await prisma.category.create({ data: { name: 'Bearings', slug: 'bearings', parentId: industrial.id } });

  // Brands
  const bosch = await prisma.brand.create({ data: { name: 'Bosch', slug: 'bosch' } });
  const philips = await prisma.brand.create({ data: { name: 'Philips', slug: 'philips' } });
  const acme = await prisma.brand.create({ data: { name: 'AcmePro', slug: 'acmepro' } });

  // Products
  const products = [
    { title: 'Industrial Grade Steel Bolts M12', price: 15.50, minOrderQty: 100, unit: 'Piece', categoryId: industrial.id, brandId: acme.id, hsnCode: '73181500', gstRate: 18, tags: ['industrial', 'fasteners', 'steel'] },
    { title: 'LED Panel Light 18W', price: 349, minOrderQty: 10, unit: 'Piece', categoryId: electronics.id, brandId: philips.id, hsnCode: '94051100', gstRate: 12, tags: ['lighting', 'led', 'electronics'] },
    { title: 'Automotive Brake Pads Set', price: 1250, minOrderQty: 5, unit: 'Set', categoryId: automotive.id, brandId: bosch.id, hsnCode: '87083000', gstRate: 18, tags: ['automotive', 'brake', 'safety'] },
    { title: 'Cotton Fabric Roll 100m', price: 4500, minOrderQty: 1, unit: 'Roll', categoryId: textile.id, hsnCode: '52085200', gstRate: 5, tags: ['textile', 'cotton', 'fabric'] },
    { title: 'Ball Bearing 6205-2RS', price: 85, minOrderQty: 50, unit: 'Piece', categoryId: industrial.id, brandId: bosch.id, hsnCode: '84821020', gstRate: 18, tags: ['bearing', 'industrial'] },
    { title: 'PVC Insulated Cable 2.5mm 100m', price: 2890, minOrderQty: 1, unit: 'Roll', categoryId: electronics.id, hsnCode: '85444920', gstRate: 12, tags: ['cable', 'electrical', 'pvc'] },
    { title: 'Engine Oil 5W-30 5L', price: 3200, minOrderQty: 2, unit: 'Bucket', categoryId: automotive.id, brandId: bosch.id, hsnCode: '27101971', gstRate: 18, tags: ['automotive', 'oil', 'engine'] },
    { title: 'Polyester Fabric Roll 50m', price: 2800, minOrderQty: 1, unit: 'Roll', categoryId: textile.id, hsnCode: '54076100', gstRate: 5, tags: ['textile', 'polyester', 'fabric'] },
    { title: 'Corrugated Box 12x12x12 (Pack of 25)', price: 450, minOrderQty: 10, unit: 'Pack', categoryId: packaging.id, hsnCode: '48191000', gstRate: 12, tags: ['packaging', 'boxes'] },
    { title: 'Industrial Safety Gloves (Pack of 12)', price: 890, minOrderQty: 5, unit: 'Pack', categoryId: industrial.id, hsnCode: '40151900', gstRate: 12, tags: ['safety', 'gloves', 'industrial'] },
  ];

  for (const p of products) {
    const slug = p.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-') + '-' + Math.random().toString(36).substring(2, 5);
    await prisma.product.create({
      data: {
        ...p,
        slug,
        companyId: company.id,
        images: JSON.stringify([]),
        tags: JSON.stringify(p.tags),
        specs: JSON.stringify({}),
        description: `High quality ${p.title.toLowerCase()} suitable for industrial and commercial applications.`,
      },
    });
  }

  // Warehouse
  const warehouse = await prisma.warehouse.create({
    data: { name: 'Main Warehouse - Mumbai', companyId: company.id, city: 'Mumbai', state: 'Maharashtra', contact: '+91-9876543210' },
  });
  const warehouse2 = await prisma.warehouse.create({
    data: { name: 'Distribution Center - Delhi', companyId: company.id, city: 'Delhi', state: 'Delhi', contact: '+91-9876543211' },
  });

  // Warehouse Locations
  await prisma.warehouseLocation.create({ data: { warehouseId: warehouse.id, rack: 'A', shelf: '1', bin: 'A1-01', barcode: 'WH1-A1-01' } });
  await prisma.warehouseLocation.create({ data: { warehouseId: warehouse.id, rack: 'A', shelf: '1', bin: 'A1-02', barcode: 'WH1-A1-02' } });
  await prisma.warehouseLocation.create({ data: { warehouseId: warehouse.id, rack: 'B', shelf: '2', bin: 'B2-01', barcode: 'WH1-B2-01' } });

  // Inventory
  const allProducts = await prisma.product.findMany({ where: { companyId: company.id } });
  for (const p of allProducts) {
    await prisma.inventory.create({
      data: {
        productId: p.id,
        warehouseId: warehouse.id,
        availableQty: Math.floor(Math.random() * 500) + 50,
        reservedQty: Math.floor(Math.random() * 20),
        minStock: 50,
        maxStock: 1000,
        leadTimeDays: Math.floor(Math.random() * 14) + 3,
        stockVisibility: 'EXACT',
      },
    });
    // Some products in second warehouse
    if (Math.random() > 0.5) {
      await prisma.inventory.create({
        data: {
          productId: p.id, warehouseId: warehouse2.id,
          availableQty: Math.floor(Math.random() * 200) + 20,
          minStock: 20, stockVisibility: 'APPROXIMATE',
        },
      });
    }
  }

  // Customers
  const customer = await prisma.customer.create({
    data: { name: 'Priya Enterprises', email: 'priya@example.com', phone: '+91-9988776655', companyName: 'Priya Enterprises', city: 'Mumbai', state: 'Maharashtra', companyId: company.id, createdBy: seller.id },
  });
  await prisma.customer.create({
    data: { name: 'Delhi Traders', email: 'info@delhitraders.com', phone: '+91-8877665544', companyName: 'Delhi Traders', city: 'Delhi', state: 'Delhi', companyId: company.id, createdBy: seller.id },
  });

  // Sample Order
  const firstProduct = allProducts[0];
  const order = await prisma.order.create({
    data: { orderNumber: 'ORD-001', buyerId: buyer.id, supplierId: company.id, subtotal: 1550, totalAmount: 1829, taxAmount: 279, status: 'DELIVERED' },
  });
  await prisma.orderItem.create({
    data: { orderId: order.id, productId: firstProduct.id, qty: 100, unitPrice: 15.50, subtotal: 1550 },
  });

  // Sample Invoice
  await prisma.invoice.create({
    data: { invoiceNumber: 'INV-001', orderId: order.id, companyId: company.id, amount: 1829, taxAmount: 279, status: 'PAID', dueDate: new Date(Date.now() + 30 * 86400000).toISOString() },
  });

  // Sample BOM
  const kitProduct = await prisma.product.create({
    data: { title: 'Hardware Kit (Bolts + Nuts + Washers)', slug: 'hardware-kit-' + Date.now(), price: 250, minOrderQty: 1, unit: 'Kit', companyId: company.id, categoryId: industrial.id, images: JSON.stringify([]), tags: JSON.stringify(['kit', 'hardware']), specs: JSON.stringify({}), description: 'Assorted hardware kit with bolts, nuts, and washers.' },
  });

  const bom = await prisma.bOM.create({ data: { name: 'Hardware Kit Assembly', productId: kitProduct.id, outputQty: 1 } });
  const boltProduct = allProducts.find(p => p.title.includes('Bolts'));
  if (boltProduct) {
    await prisma.bOMItem.create({ data: { bomId: bom.id, componentId: boltProduct.id, quantity: 10 } });
  }

  // Sample Inquiry
  const inquiry = await prisma.inquiry.create({
    data: { productId: firstProduct.id, buyerId: buyer.id, sellerId: seller.id, quantity: 500, message: 'Need bulk pricing for 500 pieces', status: 'RESPONDED' },
  });
  await prisma.quote.create({
    data: { inquiryId: inquiry.id, price: 12.50, moq: 500, notes: 'Bulk discount applied' },
  });

  console.log('\n=== Seed Complete ===');
  console.log('Admin: admin@marketplace.com / admin123');
  console.log('Seller: seller@example.com / admin123');
  console.log('Buyer: buyer@example.com / admin123');
  console.log(`Products: ${allProducts.length}`);
  console.log(`Warehouses: 2`);
  console.log(`Inventory records: ${allProducts.length + Math.floor(allProducts.length * 0.5)}`);
  console.log(`Orders: 1, Customers: 2, BOMs: 1`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
