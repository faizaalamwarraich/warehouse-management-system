import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/ToastProvider';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { state, updateProduct, recordTransaction } = useAppState();
  const { user } = useAuth();
  const toast = useToast();
  const product = state.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="alert alert-warning">
        Product not found. <Link to="/products" className="alert-link">Back to list</Link>
      </div>
    );
  }

  const category = state.categories.find(c => c.id === product.categoryId)?.name || '-';

  const [showAdjust, setShowAdjust] = useState(false);
  const [delta, setDelta] = useState<number>(0);
  const [note, setNote] = useState('');
  const invalid = useMemo(() => {
    if (!Number.isFinite(delta)) return true;
    if (!note.trim()) return true;
    const result = product.stock + delta;
    return result < 0;
  }, [delta, note, product.stock]);

  const submitAdjust = () => {
    if (invalid) return;
    try {
      updateProduct(product.id, { stock: product.stock + delta });
      recordTransaction({ productId: product.id, delta, reason: 'adjustment', note: note.trim(), user: user?.username });
      setShowAdjust(false);
      setDelta(0);
      setNote('');
      toast.push('success', 'Stock adjusted');
    } catch (e: any) {
      toast.push('error', e.message || 'Adjustment failed');
    }
  };

  return (
    <div className="page-product-detail">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">{product.name}</h1>
        <Link to="/products" className="btn btn-outline-secondary">Back</Link>
      </div>
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-3">SKU</dt>
                <dd className="col-sm-9">{product.sku}</dd>
                <dt className="col-sm-3">Category</dt>
                <dd className="col-sm-9">{category}</dd>
                <dt className="col-sm-3">Price</dt>
                <dd className="col-sm-9">${product.price.toFixed(2)}</dd>
                <dt className="col-sm-3">Stock</dt>
                <dd className="col-sm-9">{product.stock}</dd>
                <dt className="col-sm-3">Status</dt>
                <dd className="col-sm-9 text-capitalize">{product.status}</dd>
                <dt className="col-sm-3">Updated</dt>
                <dd className="col-sm-9">{new Date(product.updatedAt).toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white"><strong>Actions</strong></div>
            <div className="card-body d-grid gap-2">
              <button className="btn btn-primary" disabled>Edit</button>
              <button className="btn btn-outline-secondary" onClick={() => setShowAdjust(true)}>Adjust Stock</button>
              <button className="btn btn-outline-danger" disabled>Delete</button>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Adjust Stock" show={showAdjust} onClose={() => setShowAdjust(false)}>
        <div className="mb-3">
          <label htmlFor="adj-delta" className="form-label">Delta (use negative to subtract)</label>
          <input id="adj-delta" type="number" className="form-control" value={delta} onChange={e => setDelta(Number(e.target.value))} />
        </div>
        <div className="mb-2">
          <label htmlFor="adj-note" className="form-label">Note</label>
          <input id="adj-note" className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g., Manual correction" />
        </div>
        <div className="small text-muted">Current stock: {product.stock}. Result: {product.stock + (Number.isFinite(delta) ? delta : 0)}</div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowAdjust(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={submitAdjust} disabled={invalid}>Apply</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
