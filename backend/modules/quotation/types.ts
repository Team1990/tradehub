export interface CreateInquiryDTO {
  productId: string;
  quantity: number;
  message?: string;
}

export interface InquiryResponse {
  id: string;
  quantity: number;
  message?: string;
  status: string;
  product?: { id: string; title: string; images: string[] };
  buyer?: { id: string; name: string };
  seller?: { id: string; name: string; company?: { name: string } };
  messages?: any[];
  quotes?: any[];
  createdAt: Date;
}

export interface CreateQuoteDTO {
  inquiryId: string;
  price: number;
  moq?: number;
  validUntil?: string;
  notes?: string;
  items?: { productId: string; qty: number; unitPrice: number }[];
}
