export interface CreateBOMDTO {
  name: string;
  description?: string;
  productId: string;
  outputQty: number;
  items: { componentId: string; quantity: number }[];
}

export interface BOMResponse {
  id: string;
  name: string;
  description?: string;
  productId: string;
  product?: { id: string; title: string };
  outputQty: number;
  items: {
    id: string;
    quantity: number;
    component: { id: string; title: string; unit: string };
  }[];
  createdAt: Date;
}
