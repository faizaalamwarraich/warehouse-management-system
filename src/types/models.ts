// Global data models for the WMS app

export type ID = string;

export type Category = {
  id: ID;
  name: string;
};

export type ProductStatus = 'active' | 'inactive';
export type SalesmanStatus = 'active' | 'inactive';

export type Product = {
  id: ID;
  name: string;
  sku: string;
  categoryId: ID;
  price: number;
  stock: number; // available stock
  status: ProductStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type Salesman = {
  id: ID;
  name: string;
  phone: string;
  region: string;
  status: SalesmanStatus;
  createdAt: string; // ISO
};

export type AssignmentItem = {
  productId: ID;
  qty: number;
};

export type Assignment = {
  id: ID;
  salesmanId: ID;
  items: AssignmentItem[];
  note?: string;
  createdAt: string; // ISO
};

export type StockTransactionReason =
  | 'creation'
  | 'adjustment'
  | 'assignment';

export type StockTransaction = {
  id: ID;
  productId: ID;
  delta: number; // +/-
  reason: StockTransactionReason;
  refId?: ID; // e.g., assignment id
  note?: string;
  user?: string; // from auth stub
  createdAt: string; // ISO
};

export type UISettings = {
  lowStockThreshold: number; // default 5
  pageSize: number; // default 10
};

export type AppState = {
  categories: Category[];
  products: Product[];
  salesmen: Salesman[];
  assignments: Assignment[];
  transactions: StockTransaction[];
  ui: UISettings;
};
