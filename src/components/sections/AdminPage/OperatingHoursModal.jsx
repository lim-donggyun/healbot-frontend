import React, { useState, useEffect } from 'react';
import OperatingHoursInput from './OperatingHoursInput';
import './OperatingHoursModal.css';

const OperatingHoursModal = ({ isOpen, onClose, value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (isOpen) {
      setInternalValue(value);
    }
  }, [isOpen, value]);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onChange(internalValue);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>운영시간 설정</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <OperatingHoursInput value={internalValue} onChange={setInternalValue} />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperatingHoursModal;
