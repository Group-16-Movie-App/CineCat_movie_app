import React from 'react';
import './ModalWindow.css';


const ModalWindow = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-background">
      
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;
