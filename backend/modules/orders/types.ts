export interface CreateOrderDTO {
  items: { productId: string; qty: number; unitPrice: number }[];
  notes?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  items: any[];
  buyer: { id: string; name: string };
  supplier?: { id: string; name: string };
  invoices: any[];
  createdAt: Date;
}

export interface CreateCustomerDTO {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
}
