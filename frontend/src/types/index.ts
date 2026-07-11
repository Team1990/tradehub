export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  avatarUrl?: string;
  isVerified?: boolean;
  company?: Company;
  createdAt?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  isVerified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: { products: number };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDesc?: string;
  minOrderQty: number;
  price: number;
  moqPrice?: number;
  unit: string;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  tags: string[];
  gstRate?: number;
  hsnCode?: string;
  specs?: Record<string, unknown>;
  companyId: string;
  categoryId: string;
  company?: { id: string; name: string; city?: string; state?: string; logoUrl?: string; isVerified?: boolean };
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string };
  reviews?: Review[];
  createdAt: string;
}

export interface Inquiry {
  id: string;
  quantity: number;
  message?: string;
  status: 'OPEN' | 'RESPONDED' | 'CLOSED';
  buyerId: string;
  sellerId: string;
  productId: string;
  product?: { id: string; title: string; images: string[] };
  buyer?: { id: string; name: string };
  seller?: { id: string; name: string; company?: { name: string } };
  messages?: Message[];
  quotes?: Quote[];
  createdAt: string;
}

export interface Quote {
  id: string;
  price: number;
  moq?: number;
  validUntil?: string;
  notes?: string;
  status: string;
  inquiryId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  read: boolean;
  senderId: string;
  sender?: { id: string; name: string; role: string };
  inquiryId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerId: string;
  reviewer?: { id: string; name: string; avatarUrl?: string };
  productId: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact?: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  locations?: WarehouseLocation[];
  _count?: { locations: number; inventory: number };
}

export interface WarehouseLocation {
  id: string;
  rack?: string;
  shelf?: string;
  bin?: string;
  barcode?: string;
  warehouseId: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  availableQty: number;
  reservedQty: number;
  minStock?: number;
  maxStock?: number;
  leadTimeDays?: number;
  stockVisibility: string;
  approximateQty?: string;
  productId: string;
  warehouseId: string;
  locationId?: string;
  lastUpdatedAt: string;
  product?: { id: string; title: string; unit: string; price: number; images: string };
  warehouse?: { id: string; name: string; city?: string };
  location?: WarehouseLocation | null;
}

export interface StockTransaction {
  id: string;
  type: string;
  qty: number;
  direction: string;
  refType?: string;
  refId?: string;
  notes?: string;
  productId: string;
  warehouseId: string;
  locationId?: string;
  createdById?: string;
  createdAt: string;
  product?: { id: string; title: string };
  warehouse?: { id: string; name: string };
  createdBy?: { id: string; name: string };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  buyerId: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  buyer?: { id: string; name: string; email?: string };
  supplier?: { id: string; name: string };
  invoices?: Invoice[];
  _count?: { items: number };
}

export interface OrderItem {
  id: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  productId: string;
  product: { id: string; title: string; images?: string };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  orderId: string;
  companyId: string;
  createdAt: string;
  order?: { orderNumber: string; buyer?: { name: string } };
}

export interface BOM {
  id: string;
  name: string;
  description?: string;
  outputQty: number;
  productId: string;
  createdAt: string;
  product?: { id: string; title: string };
  items: BOMItem[];
}

export interface BOMItem {
  id: string;
  quantity: number;
  componentId: string;
  componentProduct?: { id: string; title: string; unit: string };
}

export interface DashboardStats {
  stats: {
    products: number;
    inventory: number;
    orders: number;
    inquiries: number;
    customers: number;
    lowStock: number;
    revenue: number;
  };
  recentOrders: Order[];
}

export interface ProductAnalytics {
  id: string;
  title: string;
  totalInquiries: number;
  totalOrders: number;
  totalReviews: number;
  avgRating: number;
  totalStock: number;
  reservedStock: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  total: number;
}

export interface MonthlySales {
  month: string;
  sales: number;
}

export interface DemandForecast {
  productId: string;
  title: string;
  currentStock: number;
  totalOrders: number;
  needsRestock: boolean;
  suggestedReorderQty: number;
  confidence: number;
}

export interface PriceSuggestion {
  productId: string;
  title: string;
  currentPrice: number;
  suggestedPrice: number;
  marketAvgPrice: number | null;
  changePercent: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code?: string };
}
