import React, { useState } from "react";
import "./DiseaseResultModal.css";

const DiseaseResultModal = ({ isOpen, onClose, diseases }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // diseases가 객체이고 data 속성이 배열인 경우 처리
  const diseaseList = diseases?.data || [];
  const totalPages = Math.ceil(diseaseList.length / itemsPerPage);

  if (!isOpen) return null;

  // 현재 페이지의 질병 데이터
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDiseases = diseaseList.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="disease-result-modal-overlay" onClick={handleOverlayClick}>
      <div className="disease-result-modal">
        {/* 모달 헤더 */}
        <div className="disease-modal-header">
          <h2>질병 검색 결과</h2>
          <button className="disease-modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="disease-modal-content">
          {diseaseList.length === 0 ? (
            <div className="no-results">
              <svg
                viewBox="0 0 24 24"
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <p>검색 결과가 없습니다.</p>
              <p className="no-results-hint">다른 증상으로 검색해보세요.</p>
            </div>
          ) : (
            <>
              <div className="results-summary">
                총 <strong>{diseaseList.length}개</strong>의 질병이 검색되었습니다. (현재 {currentPage}/{totalPages} 페이지)
              </div>

              <div className="disease-list">
                {currentDiseases.map((disease, index) => {
                  // 한국어 필드명 매핑
                  const diseaseName = disease.질환명 || disease.disease_name || "정보 없음";
                  const imageUrl = disease.이미지 || disease.image_url;
                  const description = disease.설명 || disease.description;
                  const department = disease.진료과 || disease.department;
                  const allSymptoms = disease.전체증상목록 || disease.all_symptoms || "";
                  const score = disease.일치도 || disease.score;

                  // 전체증상목록을 배열로 변환 (쉼표로 구분되어 있음)
                  const symptomsArray = typeof allSymptoms === "string" ? allSymptoms.split(",").map((s) => s.trim()) : [];

                  return (
                    <div key={index} className="disease-card">
                      <div className="disease-card-header">
                        <div className="disease-rank">{startIndex + index + 1}</div>
                        <h3 className="disease-name">{diseaseName}</h3>
                      </div>
                      <div className="disease-card-body">
                        {imageUrl && (
                          <div className="disease-image-container">
                            <img src={imageUrl} alt={diseaseName} className="disease-image" />
                          </div>
                        )}
                        <div className="disease-info">
                          {department && (
                            <div className="disease-info-item">
                              <span className="info-label">진료과:</span>
                              <p className="department-text">{department}</p>
                            </div>
                          )}
                          <div className="disease-info-item">
                            <span className="info-label">증상:</span>
                            <div className="matched-symptoms">
                              {symptomsArray.length > 0 ? (
                                symptomsArray.map((symptom, idx) => (
                                  <span key={idx} className="symptom-badge">
                                    {symptom}
                                  </span>
                                ))
                              ) : (
                                <span className="no-data">정보 없음</span>
                              )}
                            </div>
                          </div>
                          {description && (
                            <div className="disease-info-item">
                              <span className="info-label">설명:</span>
                              <p className="disease-description">{description}</p>
                            </div>
                          )}
                          {score !== undefined && (
                            <div className="disease-info-item">
                              <span className="info-label">일치도:</span>
                              <div className="score-bar-container">
                                <div className="score-bar" style={{ width: `${score * 10}%` }}>
                                  <span className="score-text">{score.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="disease-pagination">
                  <button
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    aria-label="이전 페이지">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => handlePageClick(pageNum)}>
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="disease-modal-footer">
          <button className="disease-modal-close-footer-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseResultModal;
