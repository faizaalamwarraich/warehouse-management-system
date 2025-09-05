import React from 'react';
import '../../styles/components/ui/ConfirmDialog.css';

type Props = {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  show: boolean;
};

const ConfirmDialog: React.FC<Props> = ({ title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, show }) => {
  if (!show) return null;
  return (
    <div className="modal fade show wms-confirm-modal" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div>{message}</div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onCancel}></div>
    </div>
  );
};

export default ConfirmDialog;
