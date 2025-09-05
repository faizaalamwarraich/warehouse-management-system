import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useDebounce } from '../hooks/useDebounce';
import Modal from '../components/ui/Modal';
import ProductForm, { type ProductFormValues } from '../components/products/ProductForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/ToastProvider';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Products.css';

const Products: React.FC = () => {
  const { state, addProduct, updateProduct, deleteProduct, recordTransaction } = useAppState();
  const { user } = useAuth();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'sku' | 'price' | 'stock'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(state.ui.pageSize);
  const [page, setPage] = useState(1);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  // reset to page 1 when key filters/search change
  useEffect(() => { setPage(1); }, [debouncedQuery, categoryId, sortKey, sortDir, pageSize]);

  const filtered = useMemo(() => {
    let items = state.products.filter(p => {
      const q = debouncedQuery.trim().toLowerCase();
      const matches = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const catOk = !categoryId || p.categoryId === categoryId;
      return matches && catOk;
    });
    items = items.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const aVal: any = a[sortKey];
      const bVal: any = b[sortKey];
      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
    return items;
  }, [state.products, query, categoryId, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const totalStock = useMemo(() => state.products.reduce((sum, p) => sum + p.stock, 0), [state.products]);

  const onCreate = async (values: ProductFormValues) => {
    try {
      const created = addProduct({
        name: values.name,
        sku: values.sku,
        categoryId: values.categoryId,
        price: values.price,
        stock: values.stock ?? 0,
        status: values.status,
      } as any);
      // Log creation transaction if initial stock > 0
      const init = values.stock ?? 0;
      if (init > 0) {
        recordTransaction({
          productId: created.id,
          delta: init,
          reason: 'creation',
          note: 'Initial stock',
          user: user?.username,
        });
      }
      setShowCreate(false);
      toast.push('success', 'Product created');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to create product');
    }
  };

  const onEdit = async (values: ProductFormValues) => {
    if (!editingId) return;
    try {
      updateProduct(editingId, {
        name: values.name,
        sku: values.sku,
        categoryId: values.categoryId,
        price: values.price,
        status: values.status,
      });
      setShowEdit(false);
      setEditingId(null);
      toast.push('success', 'Product updated');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to update product');
    }
  };

  const onDelete = () => {
    if (!deletingId) return;
    try {
      deleteProduct(deletingId);
      setDeletingId(null);
      toast.push('success', 'Product deleted');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to delete product');
    }
  };

  return (
    <div className="page-products">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h1 className="h3 m-0">Products</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Product</button>
      </div>
      <div className="alert alert-info py-2 mb-3">
        <strong>Total stock:</strong> {totalStock}
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-4">
          <input
            className="form-control"
            placeholder="Search by name or SKU..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} aria-label="Filter by category">
            <option value="">All Categories</option>
            {state.categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <div className="input-group">
            <label className="input-group-text" htmlFor="sortKey">Sort</label>
            <select id="sortKey" className="form-select" value={sortKey} onChange={e => setSortKey(e.target.value as any)}>
              <option value="name">Name</option>
              <option value="sku">SKU</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
            <button className="btn btn-outline-secondary" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} aria-label="Toggle sort direction">
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
        <div className="col-12 col-md-2">
          <div className="input-group">
            <label className="input-group-text" htmlFor="pageSize">Per page</label>
            <select id="pageSize" className="form-select" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th className="text-end">Price</th>
                <th className="text-end">Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">No products found.</td></tr>
              )}
              {pageItems.map(p => {
                const cat = state.categories.find(c => c.id === p.categoryId)?.name || '-';
                const low = p.stock < state.ui.lowStockThreshold;
                return (
                  <tr key={p.id}>
                    <td><Link to={`/products/${p.id}`} className="text-decoration-none">{p.name}</Link></td>
                    <td>{p.sku}</td>
                    <td>{cat}</td>
                    <td className="text-end">${p.price.toFixed(2)}</td>
                    <td className={`text-end ${low ? 'text-danger fw-semibold' : ''}`}>{p.stock}{low && <span className="badge bg-danger-subtle text-danger ms-2">Low</span>}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setEditingId(p.id); setShowEdit(true); }}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeletingId(p.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-top bg-light-subtle">
          <div className="small text-muted">Page {currentPage} of {totalPages} · {filtered.length} items</div>
          <div className="btn-group">
            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage <= 1} onClick={() => setPage(1)}>First</button>
            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage >= totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal title="Create Product" show={showCreate} onClose={() => setShowCreate(false)} size="lg">
        <ProductForm
          categories={state.categories}
          mode="create"
          onCancel={() => setShowCreate(false)}
          onSubmit={onCreate}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Product" show={showEdit} onClose={() => { setShowEdit(false); setEditingId(null); }} size="lg">
        {editingId && (
          <ProductForm
            categories={state.categories}
            mode="edit"
            initial={state.products.find(p => p.id === editingId)}
            onCancel={() => { setShowEdit(false); setEditingId(null); }}
            onSubmit={onEdit}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        show={!!deletingId}
        title="Delete Product"
        message={<span>Are you sure you want to delete this product? <br/>This will not remove historical logs.</span>}
        confirmText="Delete"
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default Products;
