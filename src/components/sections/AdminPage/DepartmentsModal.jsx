import React, { useState, useEffect } from "react";
import "./DepartmentsModal.css";

const DEPARTMENTS_LIST = [
  "가정의학과",
  "내과",
  "마취통증의학과",
  "방사선종양학과",
  "비뇨의학과",
  "산부인과",
  "성형외과",
  "소아청소년과",
  "신경과",
  "신경외과",
  "심장혈관흉부외과",
  "안과",
  "영상의학과",
  "외과",
  "응급의학과",
  "이비인후과",
  "재활의학과",
  "정신건강의학과",
  "정형외과",
  "치과",
  "피부과",
  "한의학과",
  "핵의학과",
];

const DepartmentsModal = ({ isOpen, onClose, value, onChange }) => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // value가 문자열이면 배열로 변환
      if (value && typeof value === "string") {
        const depts = value
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d);
        setSelectedDepartments(depts);
      } else if (Array.isArray(value)) {
        setSelectedDepartments(value);
      } else {
        setSelectedDepartments([]);
      }
    }
  }, [isOpen, value]);

  if (!isOpen) {
    return null;
  }

  const handleToggle = (dept) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(dept)) {
        return prev.filter((d) => d !== dept);
      } else {
        return [...prev, dept];
      }
    });
  };

  const handleConfirm = () => {
    onChange(selectedDepartments.join(", "));
    onClose();
  };

  return (
    <div className="departments-modal-overlay" onClick={onClose}>
      <div className="departments-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="departments-modal-header">
          <h3>진료과 선택</h3>
        </div>
        <div className="departments-modal-body">
          <div className="departments-grid">
            {DEPARTMENTS_LIST.map((dept) => (
              <label key={dept} className="department-checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(dept)}
                  onChange={() => handleToggle(dept)}
                />
                <span className="department-label">{dept}</span>
              </label>
            ))}
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

export default DepartmentsModal;
