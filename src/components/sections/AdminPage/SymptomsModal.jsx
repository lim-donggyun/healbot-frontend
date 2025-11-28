import React, { useState, useEffect } from 'react';
import './DepartmentsModal.css';

const SymptomsModal = ({ isOpen, onClose, value, onChange, symptomsByBodyPart }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('머리');

  useEffect(() => {
    if (isOpen) {
      if (value && typeof value === 'string') {
        const symptoms = value.split(',').map(s => s.trim()).filter(s => s);
        setSelectedSymptoms(symptoms);
      } else if (Array.isArray(value)) {
        setSelectedSymptoms(value);
      } else {
        setSelectedSymptoms([]);
      }
    }
  }, [isOpen, value]);

  if (!isOpen) {
    return null;
  }

  const handleToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleConfirm = () => {
    onChange(selectedSymptoms.join(', '));
    onClose();
  };

  const categories = Object.keys(symptomsByBodyPart);
  const currentSymptoms = symptomsByBodyPart[selectedCategory] || [];

  return (
    <div className="departments-modal-overlay" onClick={onClose}>
      <div className="departments-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="departments-modal-header">
          <h3>증상 선택 ({selectedSymptoms.length}개 선택됨)</h3>
        </div>
        <div className="departments-modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* 왼쪽: 신체 부위 카테고리 */}
            <div style={{ width: '150px', borderRight: '1px solid #e0e0e0', paddingRight: '15px', flexShrink: 0 }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>신체 부위</h4>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: '5px',
                    border: 'none',
                    background: selectedCategory === category ? '#3284b1' : 'transparent',
                    color: selectedCategory === category ? 'white' : '#333',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    textAlign: 'left',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            {/* 오른쪽: 증상 목록 */}
            <div style={{ flex: 1 }}>
              <div className="departments-grid">
                {currentSymptoms.map((symptom) => (
                  <label key={symptom} className="department-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => handleToggle(symptom)}
                    />
                    <span className="department-label">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="departments-modal-footer">
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

export default SymptomsModal;
