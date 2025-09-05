import React, { useMemo, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import Modal from '../components/ui/Modal';
import SalesmanForm, { type SalesmanFormValues } from '../components/salesmen/SalesmanForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/ToastProvider';
import '../styles/pages/Salesmen.css';

const Salesmen: React.FC = () => {
  const { state, addSalesman, updateSalesman, deleteSalesman } = useAppState();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const assignedTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of state.assignments) {
      const prev = map.get(a.salesmanId) || 0;
      const sum = a.items.reduce((s, it) => s + it.qty, 0);
      map.set(a.salesmanId, prev + sum);
    }
    return map; // total assigned items count per salesman (across products)
  }, [state.assignments]);

  const onCreate = (values: SalesmanFormValues) => {
    try {
      addSalesman({ name: values.name, phone: values.phone, region: values.region, status: values.status });
      setShowCreate(false);
      toast.push('success', 'Salesman created');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to create salesman');
    }
  };

  const onEdit = (values: SalesmanFormValues) => {
    if (!editingId) return;
    try {
      updateSalesman(editingId, { name: values.name, phone: values.phone, region: values.region, status: values.status });
      setShowEdit(false);
      setEditingId(null);
      toast.push('success', 'Salesman updated');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to update salesman');
    }
  };

  const onDelete = () => {
    if (!deletingId) return;
    try {
      deleteSalesman(deletingId);
      setDeletingId(null);
      toast.push('success', 'Salesman deleted');
    } catch (e: any) {
      toast.push('error', e.message || 'Failed to delete salesman');
    }
  };

  return (
    <div className="page-salesmen">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Salesmen</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Salesman</button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Status</th>
                <th className="text-end">Assigned Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.salesmen.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted py-4">No salesmen yet.</td></tr>
              )}
              {state.salesmen.map(sm => (
                <tr key={sm.id}>
                  <td>{sm.name}</td>
                  <td>{sm.phone}</td>
                  <td>{sm.region}</td>
                  <td className="text-capitalize">{sm.status}</td>
                  <td className="text-end">{assignedTotals.get(sm.id) || 0}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setEditingId(sm.id); setShowEdit(true); }}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeletingId(sm.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal title="Create Salesman" show={showCreate} onClose={() => setShowCreate(false)}>
        <SalesmanForm mode="create" onCancel={() => setShowCreate(false)} onSubmit={onCreate} />
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Salesman" show={showEdit} onClose={() => { setShowEdit(false); setEditingId(null); }}>
        {editingId && (
          <SalesmanForm mode="edit" initial={state.salesmen.find(s => s.id === editingId)} onCancel={() => { setShowEdit(false); setEditingId(null); }} onSubmit={onEdit} />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        show={!!deletingId}
        title="Delete Salesman"
        message={<span>Are you sure you want to delete this salesman?</span>}
        confirmText="Delete"
        onCancel={() => setDeletingId(null)}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default Salesmen;
