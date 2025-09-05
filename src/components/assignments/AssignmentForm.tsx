import React, { useMemo, useState } from 'react';
import type { Product, Salesman } from '../../types/models';
import '../../styles/components/assignments/AssignmentForm.css';

export type AssignmentFormValues = {
  salesmanId: string;
  items: { productId: string; qty: number }[];
  note?: string;
};

type Props = {
  salesmen: Salesman[];
  products: Product[];
  onCancel: () => void;
  onSubmit: (values: AssignmentFormValues) => void;
  submitting?: boolean;
};

const AssignmentForm: React.FC<Props> = ({ salesmen, products, onCancel, onSubmit, submitting }) => {
  const [salesmanId, setSalesmanId] = useState(salesmen[0]?.id ?? '');
  const [note, setNote] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const items = useMemo(() => Object.entries(quantities)
    .filter(([, qty]) => qty && qty > 0)
    .map(([productId, qty]) => ({ productId, qty: Number(qty) })), [quantities]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!salesmanId) e.salesmanId = 'Salesman is required';
    // validate each qty <= stock
    for (const it of items) {
      const p = products.find(x => x.id === it.productId);
      if (!p) continue;
      if (it.qty > p.stock) {
        e[it.productId] = `Qty exceeds stock (${p.stock})`;
      }
    }
    if (items.length === 0) e.items = 'Add at least one product with qty';
    return e;
  }, [salesmanId, items, products]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    onSubmit({ salesmanId, items, note: note.trim() || undefined });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label htmlFor="af-salesman" className="form-label">Salesman</label>
          <select id="af-salesman" className={`form-select ${errors.salesmanId ? 'is-invalid' : ''}`} value={salesmanId} onChange={e=>setSalesmanId(e.target.value)}>
            {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.salesmanId && <div className="invalid-feedback">{errors.salesmanId}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="af-note" className="form-label">Note (optional)</label>
          <input id="af-note" className="form-control" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g., Order #123" />
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-sm align-middle">
          <thead className="table-light sticky-top">
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th className="af-col-qty">Assign Qty</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const val = quantities[p.id] ?? 0;
              const err = (errors as any)[p.id];
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.stock}</td>
                  <td>
                    <input type="number" min={0} max={p.stock} className={`form-control form-control-sm ${err ? 'is-invalid' : ''}`}
                      value={val}
                      onChange={e => setQuantities(q => ({ ...q, [p.id]: Number(e.target.value) }))}
                    />
                    {err && <div className="invalid-feedback">{err}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {errors.items && <div className="text-danger small mb-2">{errors.items}</div>}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={!!submitting}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!!submitting || Object.keys(errors).length > 0}>{submitting ? 'Assigning...' : 'Assign'}</button>
      </div>
    </form>
  );
};

export default AssignmentForm;
