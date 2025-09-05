import React, { useMemo, useState } from 'react';
import type { Salesman, SalesmanStatus } from '../../types/models';

export type SalesmanFormValues = {
  name: string;
  phone: string;
  region: string;
  status: SalesmanStatus;
};

type Props = {
  initial?: Salesman;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSubmit: (values: SalesmanFormValues) => void;
  submitting?: boolean;
};

const SalesmanForm: React.FC<Props> = ({ initial, mode, onCancel, onSubmit, submitting }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [region, setRegion] = useState(initial?.region ?? '');
  const [status, setStatus] = useState<SalesmanStatus>(initial?.status ?? 'active');

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!phone.trim()) e.phone = 'Phone is required';
    if (!region.trim()) e.region = 'Region is required';
    return e;
  }, [name, phone, region]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    onSubmit({ name: name.trim(), phone: phone.trim(), region: region.trim(), status });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="sf-name">Name</label>
        <input id="sf-name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={name} onChange={e=>setName(e.target.value)} />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="sf-phone">Phone</label>
          <input id="sf-phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={phone} onChange={e=>setPhone(e.target.value)} />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="sf-region">Region</label>
          <input id="sf-region" className={`form-control ${errors.region ? 'is-invalid' : ''}`} value={region} onChange={e=>setRegion(e.target.value)} />
          {errors.region && <div className="invalid-feedback">{errors.region}</div>}
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label" htmlFor="sf-status">Status</label>
        <select id="sf-status" className="form-select" value={status} onChange={e=>setStatus(e.target.value as SalesmanStatus)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={!!submitting}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!!submitting || Object.keys(errors).length > 0}>{submitting ? 'Saving...' : (mode === 'create' ? 'Create' : 'Save')}</button>
      </div>
    </form>
  );
};

export default SalesmanForm;
