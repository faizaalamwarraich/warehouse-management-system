import React from 'react';
import { useAppState } from '../context/AppStateContext';
import '../styles/pages/Dashboard.css';

const StatsCard: React.FC<{ title: string; value: string | number; variant?: string }> = ({ title, value, variant }) => (
  <div className="col">
    <div className={`card border-0 shadow-sm ${variant ? `bg-${variant} text-white` : ''}`}>
      <div className="card-body">
        <div className="small text-uppercase fw-semibold opacity-75">{title}</div>
        <div className="display-6 fw-bold">{value}</div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { state } = useAppState();
  const totalSKUs = state.products.length;
  const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = state.products.filter(p => p.stock < state.ui.lowStockThreshold).length;
  const assignmentsThisWeek = state.assignments.filter(a => {
    const d = new Date(a.createdAt);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const recentTx = state.transactions.slice(0, 10);

  return (
    <div className="page-dashboard">
      <h1 className="h3 mb-4">Dashboard</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
        <StatsCard title="Total SKUs" value={totalSKUs} />
        <StatsCard title="Total Stock" value={totalStock} />
        <StatsCard title={`Low Stock (< ${state.ui.lowStockThreshold})`} value={lowStockCount} variant="warning" />
        <StatsCard title="Assignments (7d)" value={assignmentsThisWeek} variant="info" />
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white"><strong>Recent Transactions</strong></div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Delta</th>
                <th>Reason</th>
                <th>Ref</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">No transactions yet.</td>
                </tr>
              )}
              {recentTx.map(tx => {
                const prod = state.products.find(p => p.id === tx.productId);
                return (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>{prod?.name || tx.productId}</td>
                    <td className={tx.delta < 0 ? 'text-danger' : 'text-success'}>{tx.delta}</td>
                    <td>{tx.reason}</td>
                    <td>{tx.refId || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
