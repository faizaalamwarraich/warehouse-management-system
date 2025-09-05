import React from 'react';
import { useAppState } from '../context/AppStateContext';
import '../styles/pages/Settings.css';

const Settings: React.FC = () => {
  const { state, setState } = useAppState();

  return (
    <div>
      <h1 className="h3 mb-3">Settings</h1>
      <div className="card shadow-sm settingsCard">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="lowStockThreshold" className="form-label">Low-stock threshold</label>
            <input
              id="lowStockThreshold"
              type="number"
              className="form-control"
              min={0}
              value={state.ui.lowStockThreshold}
              onChange={e => setState(s => ({ ...s, ui: { ...s.ui, lowStockThreshold: Number(e.target.value) } }))}
            />
            <div className="form-text">Products with stock below this value show a red low-stock badge.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="pageSize" className="form-label">Default page size</label>
            <select
              id="pageSize"
              className="form-select"
              value={state.ui.pageSize}
              onChange={e => setState(s => ({ ...s, ui: { ...s.ui, pageSize: Number(e.target.value) } }))}
            >
              {[10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
