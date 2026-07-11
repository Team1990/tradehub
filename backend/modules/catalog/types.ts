export interface CreateProductDTO {
  title: string;
  description?: string;
  shortDesc?: string;
  minOrderQty: number;
  price: number;
  moqPrice?: number;
  unit: string;
  categoryId: string;
  brandId?: string;
  tags: string[];
  gstRate?: number;
  hsnCode?: string;
  specs?: Record<string, string>;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: string;
}

export interface ProductResponse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  unit: string;
  images: string[];
  status: string;
  tags: string[];
  gstRate?: number;
  hsnCode?: string;
  specs: Record<string, string>;
  company?: { id: string; name: string; city?: string; state?: string; logoUrl?: string; isVerified: boolean };
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string };
  minOrderQty: number;
  moqPrice?: number;
  createdAt: Date;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: CategoryResponse[];
  _count?: { products: number };
}
