import api from './client';
import type {
  ApiResponse, PaginatedResponse, Product, Category, Inquiry, Message, Review, User, Company,
  Warehouse, InventoryItem, StockTransaction, Order, Customer, Invoice, BOM, Quote,
  DashboardStats, ProductAnalytics, TopCustomer, MonthlySales, DemandForecast, PriceSuggestion,
} from '../types';

export const auth = {
  register: (data: { email: string; password: string; name: string; phone?: string; role: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data),
  profile: () => api.get<ApiResponse<User>>('/auth/profile'),
  updateProfile: (data: Partial<User>) => api.patch<ApiResponse<User>>('/auth/profile', data),
  getCompany: () => api.get<ApiResponse<Company>>('/auth/company'),
  updateCompany: (data: Partial<Company>) => api.put<ApiResponse<Company>>('/auth/company', data),
};

export const products = {
  list: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),
  get: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Product>>('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.patch<ApiResponse<Product>>(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete<ApiResponse<{ message: string }>>(`/products/${id}`),
  my: () => api.get<ApiResponse<Product[]>>('/products/my'),
};

export const categories = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
  get: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
};

export const inquiries = {
  create: (data: { productId: string; quantity: number; message?: string }) =>
    api.post<ApiResponse<Inquiry>>('/inquiries', data),
  my: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Inquiry>>('/inquiries/my', { params }),
  received: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Inquiry>>('/inquiries/received', { params }),
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Inquiry>>(`/inquiries/${id}/status`, { status }),
  quotes: (inquiryId: string) => api.get<ApiResponse<Quote[]>>(`/inquiries/${inquiryId}/quotes`),
};

export const quotes = {
  create: (data: { inquiryId: string; price: number; moq?: number; validUntil?: string; notes?: string }) =>
    api.post<ApiResponse<Quote>>('/quotes', data),
};

export const messages = {
  list: (inquiryId: string) => api.get<ApiResponse<Message[]>>(`/messages/${inquiryId}`),
  send: (inquiryId: string, content: string) =>
    api.post<ApiResponse<Message>>(`/messages/${inquiryId}`, { content }),
};

export const reviews = {
  list: (productId: string) => api.get<ApiResponse<{ reviews: Review[]; average: number; total: number }>>(`/reviews/${productId}`),
  create: (productId: string, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>(`/reviews/${productId}`, data),
};

export const warehouses = {
  list: () => api.get<ApiResponse<Warehouse[]>>('/inventory/warehouses'),
  get: (id: string) => api.get<ApiResponse<Warehouse>>(`/inventory/warehouses/${id}`),
  create: (data: Partial<Warehouse>) => api.post<ApiResponse<Warehouse>>('/inventory/warehouses', data),
};

export const inventory = {
  all: () => api.get<ApiResponse<InventoryItem[]>>('/inventory'),
  lowStock: () => api.get<ApiResponse<InventoryItem[]>>('/inventory/low-stock'),
  byProduct: (productId: string) => api.get<ApiResponse<InventoryItem[]>>(`/inventory/product/${productId}`),
  byWarehouse: (warehouseId: string) => api.get<ApiResponse<InventoryItem[]>>(`/inventory/warehouse/${warehouseId}`),
  update: (productId: string, data: Partial<InventoryItem>) =>
    api.patch<ApiResponse<InventoryItem>>(`/inventory/product/${productId}`, data),
  transactions: (params?: Record<string, string>) =>
    api.get<ApiResponse<StockTransaction[]>>('/inventory/transactions', { params }),
  recordTransaction: (data: {
    type: string; productId: string; warehouseId: string; qty: number; direction: string;
    locationId?: string; refType?: string; refId?: string; notes?: string;
  }) => api.post<ApiResponse<StockTransaction>>('/inventory/transactions', data),
};

export const orders = {
  create: (data: { items: Array<{ productId: string; qty: number }>; notes?: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
  my: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Order>>('/orders', { params }),
  supplier: (params?: Record<string, string>) =>
    api.get<ApiResponse<Order[]>>('/orders/supplier', { params }),
  get: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
};

export const customers = {
  list: () => api.get<ApiResponse<Customer[]>>('/orders/customers'),
  create: (data: { name: string; email?: string; phone?: string; companyName?: string; city?: string; state?: string }) =>
    api.post<ApiResponse<Customer>>('/orders/customers', data),
};

export const invoices = {
  list: () => api.get<ApiResponse<Invoice[]>>('/orders/invoices'),
  create: (data: { orderId: string; dueDate?: string; notes?: string }) =>
    api.post<ApiResponse<Invoice>>('/orders/invoices', data),
};

export const manufacturing = {
  list: () => api.get<ApiResponse<BOM[]>>('/manufacturing'),
  get: (id: string) => api.get<ApiResponse<BOM>>(`/manufacturing/${id}`),
  create: (data: { name: string; productId: string; description?: string; outputQty?: number; items: Array<{ componentId: string; quantity: number }> }) =>
    api.post<ApiResponse<BOM>>('/manufacturing', data),
  assemble: (data: { bomId: string; quantity: number; warehouseId: string }) =>
    api.post<ApiResponse<{ message: string; outputQty: number }>>('/manufacturing/assemble', data),
};

export const analytics = {
  dashboard: () => api.get<ApiResponse<DashboardStats>>('/analytics/dashboard'),
  products: () => api.get<ApiResponse<ProductAnalytics[]>>('/analytics/products'),
  customers: (limit?: number) =>
    api.get<ApiResponse<TopCustomer[]>>('/analytics/customers', { params: { limit: String(limit || 10) } }),
  sales: () => api.get<ApiResponse<MonthlySales[]>>('/analytics/sales'),
};

export const ai = {
  demandForecast: () => api.get<ApiResponse<DemandForecast[]>>('/ai/demand-forecast'),
  priceSuggestions: () => api.get<ApiResponse<PriceSuggestion[]>>('/ai/price-suggestions'),
  autoCategorize: (description: string) =>
    api.post<ApiResponse<{ suggestedCategory: string }>>('/ai/auto-categorize', { description }),
};
