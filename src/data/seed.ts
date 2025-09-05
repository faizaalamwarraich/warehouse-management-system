import type { AppState, Category, Product, Salesman, UISettings } from '../types/models';

const nowIso = () => new Date().toISOString();

export const seededCategories: Category[] = [
  'Electronics','Apparel','Home','Beauty','Sports','Automotive','Books','Toys','Grocery','Office'
].map((name, idx) => ({ id: String(idx + 1), name }));

function makeProduct(i: number): Product {
  const categoryId = seededCategories[(i % seededCategories.length)].id;
  return {
    id: String(i),
    name: `Sample Product ${i}`,
    sku: `SKU-${1000 + i}`,
    categoryId,
    price: Number((Math.random() * 100 + 10).toFixed(2)),
    stock: Math.floor(Math.random() * 50) + 5,
    status: 'active',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function makeSalesman(i: number): Salesman {
  return {
    id: String(i),
    name: `Salesman ${i}`,
    phone: `+1-555-010${i}`,
    region: ['North', 'South', 'East', 'West'][i % 4],
    status: 'active',
    createdAt: nowIso(),
  };
}

export const defaultUI: UISettings = {
  lowStockThreshold: 5,
  pageSize: 10,
};

export const seedState: AppState = {
  categories: seededCategories,
  products: Array.from({ length: 24 }, (_, i) => makeProduct(i + 1)),
  salesmen: Array.from({ length: 5 }, (_, i) => makeSalesman(i + 1)),
  assignments: [],
  transactions: [],
  ui: defaultUI,
};
