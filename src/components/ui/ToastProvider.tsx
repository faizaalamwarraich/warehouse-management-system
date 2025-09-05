import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import '../../styles/components/ui/ToastProvider.css';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';
export type Toast = { id: string; kind: ToastKind; message: string };

type ToastContextType = {
  toasts: Toast[];
  push: (kind: ToastKind, message: string) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function uid() { return Math.random().toString(36).slice(2, 10); }

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => setToasts(ts => ts.filter(t => t.id !== id)), []);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = uid();
    setToasts(ts => [...ts, { id, kind, message }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="toast-container position-fixed top-0 end-0 p-3 wms-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast align-items-center text-bg-${t.kind === 'error' ? 'danger' : t.kind === 'success' ? 'success' : t.kind === 'warning' ? 'warning' : 'primary'} show`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => remove(t.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
