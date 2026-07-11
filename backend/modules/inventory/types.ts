export interface CreateWarehouseDTO {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact?: string;
  locations?: CreateLocationDTO[];
}

export interface CreateLocationDTO {
  rack?: string;
  shelf?: string;
  bin?: string;
  barcode?: string;
}

export interface UpdateInventoryDTO {
  availableQty?: number;
  minStock?: number;
  maxStock?: number;
  leadTimeDays?: number;
  stockVisibility?: 'EXACT' | 'APPROXIMATE' | 'READY_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK';
  approximateQty?: string;
  warehouseId?: string;
  locationId?: string;
}

export interface StockTransactionDTO {
  type: 'PURCHASE' | 'STOCK_IN' | 'SALE' | 'STOCK_OUT' | 'RETURN' | 'DAMAGE' | 'TRANSFER' | 'ADJUSTMENT';
  productId: string;
  warehouseId: string;
  locationId?: string;
  qty: number;
  direction: 'IN' | 'OUT';
  refType?: string;
  refId?: string;
  notes?: string;
}

export interface BulkStockDTO {
  transactions: StockTransactionDTO[];
}

export type StockVisibility = 'EXACT' | 'APPROXIMATE' | 'READY_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK';
