import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import Modal from '../components/ui/Modal';
import AssignmentForm, { type AssignmentFormValues } from '../components/assignments/AssignmentForm';
import { useToast } from '../components/ui/ToastProvider';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Assignments.css';

const Assignments: React.FC = () => {
  const { state, createAssignment } = useAppState();
  const { user } = useAuth();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="page-assignments">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Assignments</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Assignment</button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Date</th>
                <th>Salesman</th>
                <th>Items</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {state.assignments.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted py-4">No assignments yet.</td></tr>
              )}
              {state.assignments.map(a => {
                const sm = state.salesmen.find(s => s.id === a.salesmanId)?.name || a.salesmanId;
                const items = a.items.map(it => {
                  const prod = state.products.find(p => p.id === it.productId)?.name || it.productId;
                  return `${prod} × ${it.qty}`;
                }).join(', ');
                return (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt).toLocaleString()}</td>
                    <td>{sm}</td>
                    <td>{items}</td>
                    <td>{a.note || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal title="Create Assignment" show={showCreate} onClose={() => setShowCreate(false)} size="xl">
        <AssignmentForm
          salesmen={state.salesmen}
          products={state.products}
          onCancel={() => setShowCreate(false)}
          onSubmit={(values: AssignmentFormValues) => {
            try {
              createAssignment({ salesmanId: values.salesmanId, items: values.items, note: values.note }, user?.username);
              setShowCreate(false);
              toast.push('success', 'Assignment created');
            } catch (e: any) {
              toast.push('error', e.message || 'Failed to create assignment');
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default Assignments;
