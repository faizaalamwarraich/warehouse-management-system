import React from 'react';
import '../../styles/components/ui/Modal.css';

type Props = {
  title?: string;
  show: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const Modal: React.FC<Props> = ({ title, show, onClose, footer, children, size = 'md' }) => {
  if (!show) return null;
  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : size === 'xl' ? 'modal-xl' : '';
  return (
    <>
      {/* Backdrop behind modal */}
      <div className="modal-backdrop fade show wms-modal-backdrop" onClick={onClose} />

      {/* Modal content above backdrop */}
      <div className="modal fade show wms-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div className={`modal-dialog ${sizeClass}`} role="document">
          <div className="modal-content">
            <div className="modal-header">
              {title && <h5 id="modalTitle" className="modal-title">{title}</h5>}
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
