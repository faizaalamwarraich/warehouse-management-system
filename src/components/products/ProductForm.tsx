import React, { useMemo, useState } from 'react';
import type { Category, Product, ProductStatus } from '../../types/models';

export type ProductFormValues = {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  status: ProductStatus;
  stock?: number; // only for create
};

type Props = {
  categories: Category[];
  mode: 'create' | 'edit';
  initial?: Product;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void;
  submitting?: boolean;
};

const ProductForm: React.FC<Props> = ({ categories, mode, initial, onCancel, onSubmit, submitting }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? (categories[0]?.id ?? ''));
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [status, setStatus] = useState<ProductStatus>(initial?.status ?? 'active');
  const [stock, setStock] = useState<number>(0);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!sku.trim()) e.sku = 'SKU is required';
    if (!categoryId) e.categoryId = 'Category is required';
    if (!(price >= 0)) e.price = 'Price must be >= 0';
    if (mode === 'create' && !(stock >= 0)) e.stock = 'Initial stock must be >= 0';
    return e;
  }, [name, sku, categoryId, price, stock, mode]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    const values: ProductFormValues = { name: name.trim(), sku: sku.trim(), categoryId, price: Number(price), status };
    if (mode === 'create') values.stock = Number(stock);
    onSubmit(values);
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="pf-name">Name</label>
        <input id="pf-name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={name} onChange={e=>setName(e.target.value)} required />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="pf-sku">SKU</label>
        <input id="pf-sku" className={`form-control ${errors.sku ? 'is-invalid' : ''}`} value={sku} onChange={e=>setSku(e.target.value)} required />
        {errors.sku && <div className="invalid-feedback">{errors.sku}</div>}
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="pf-category">Category</label>
          <select id="pf-category" className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`} value={categoryId} onChange={e=>setCategoryId(e.target.value)} required>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="pf-price">Price</label>
          <input id="pf-price" type="number" step="0.01" min={0} className={`form-control ${errors.price ? 'is-invalid' : ''}`} value={price} onChange={e=>setPrice(Number(e.target.value))} required />
          {errors.price && <div className="invalid-feedback">{errors.price}</div>}
        </div>
      </div>
      <div className="row g-3 mt-0">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="pf-status">Status</label>
          <select id="pf-status" className="form-select" value={status} onChange={e=>setStatus(e.target.value as ProductStatus)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {mode === 'create' && (
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="pf-stock">Initial Stock</label>
            <input id="pf-stock" type="number" min={0} className={`form-control ${errors.stock ? 'is-invalid' : ''}`} value={stock} onChange={e=>setStock(Number(e.target.value))} required />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={!!submitting}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!!submitting || Object.keys(errors).length > 0}>{submitting ? 'Saving...' : (mode === 'create' ? 'Create' : 'Save')}</button>
      </div>
    </form>
  );
};

export default ProductForm;
