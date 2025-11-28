import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DiseaseResultModal.css';

const DiseaseResultModal = ({ isOpen, onClose, disease, searchedSymptoms = [] }) => {
  const navigate = useNavigate();

  if (!isOpen || !disease) {
    return null;
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-top" onClick={onClose}>
          ✕
        </button>
        <div className="detail-modal-body">
          <div className="detail-content-grid">
            {/* 왼쪽: 이미지 */}
            <div className="detail-left">
              {(disease.이미지 || disease.image_url) && (
                <div className="detail-image-container">
                  <img
                    src={disease.이미지 || disease.image_url}
                    alt={disease.질환명 || disease.disease_name}
                    className="detail-image"
                  />
                </div>
              )}
              <button
                className="find-department-btn"
                onClick={() => {
                  const department = disease.진료과 || disease.department;
                  if (department) {
                    navigate(`/hospitals?dept=${encodeURIComponent(department)}`);
                  } else {
                    alert('진료과 정보가 없습니다.');
                  }
                }}
              >
                병원 찾기
              </button>
            </div>

            {/* 오른쪽: 정보 */}
            <div className="detail-right">
              <div className="detail-section">
                <h3 className="detail-section-title">질환명</h3>
                <p className="detail-text">
                  {disease.질환명 || disease.disease_name || "정보 없음"}
                </p>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">진료과</h3>
                <p className="detail-text">{disease.진료과 || disease.department || "정보 없음"}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">설명</h3>
                <p className="detail-text">{disease.설명 || disease.description || "정보 없음"}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-section-title">증상</h3>
                <div className="detail-symptoms-list">
                  {(typeof (disease.전체증상목록 || disease.all_symptoms) === "string"
                    ? (disease.전체증상목록 || disease.all_symptoms).split(",").map((s) => s.trim())
                    : []
                  ).map((symptom, idx) => {
                    const isMatched = searchedSymptoms.includes(symptom);
                    return (
                      <span key={idx} className={`detail-symptom-badge ${isMatched ? "matched" : ""}`}>
                        {symptom}
                      </span>
                    );
                  })}
                </div>
              </div>

              {(disease.일치도 || disease.score) !== undefined && (
                <div className="detail-section">
                  <h3 className="detail-section-title">일치도</h3>
                  <div className="detail-score-container">
                    <div className="detail-score-bar">
                      <div
                        className="score-bar"
                        style={{ width: `${(disease.일치도 || disease.score) * 10}%` }}>
                        <span className="detail-score-text">
                          {(disease.일치도 || disease.score).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseResultModal;