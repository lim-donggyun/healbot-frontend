import React from 'react';
import HospitalCard from './HospitalCard';

function HospitalSidebar({
  hospitals,
  loading,
  currentPage,
  itemsPerPage,
  selectedHospital,
  onCardClick,
  onDetailClick,
  onPrevPage,
  onNextPage,
  onPageClick,
  getPageNumbers,
  sidebarRef
}) {
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const maxPagesToShow = 5;
  const currentGroup = Math.ceil(currentPage / maxPagesToShow);
  const isFirstGroup = currentGroup === 1;
  const lastGroup = Math.ceil(totalPages / maxPagesToShow);
  const isLastGroup = currentGroup === lastGroup;

  return (
    <div className="hospital-cards" ref={sidebarRef}>
        {loading ? (
          // 로딩 중 스켈레톤
          [1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="hospital-card">
              <div className="hospital-card-header">
                <div className="hospital-name-skeleton"></div>
                <div className="hospital-type-badge skeleton-badge"></div>
              </div>
              <div className="hospital-info">
                <div className="info-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div className="info-skeleton"></div>
                </div>
                <div className="info-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                  </svg>
                  <div className="info-skeleton short"></div>
                </div>
                <div className="info-row">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <div className="info-skeleton medium"></div>
                </div>
              </div>
              <div className="hospital-tags">
                <span className="tag skeleton-tag"></span>
                <span className="tag skeleton-tag"></span>
              </div>
            </div>
          ))
        ) : hospitals.length === 0 ? (
          // 검색 결과 없음
          <div className="no-results">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style={{ color: '#9ca3af', marginBottom: '16px' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 병원 카드 표시 (페이지네이션) */}
            {hospitals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((hospital, index) => {
              const alphabet = String.fromCharCode(65 + index); // A, B, C, ...
              const isSelected = selectedHospital?.hospitalId === hospital.hospitalId;
              return (
                <HospitalCard
                  key={hospital.hospitalId}
                  hospital={hospital}
                  alphabet={alphabet}
                  isSelected={isSelected}
                  onClick={() => onCardClick(hospital)}
                  onDetailClick={(e) => onDetailClick(hospital, e)}
                />
              );
            })}

            {/* 페이징 컨트롤 */}
            {hospitals.length > itemsPerPage && (
              <div className="pagination-container">
                <button
                  className="pagination-btn pagination-arrow"
                  onClick={onPrevPage}
                  disabled={isFirstGroup}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>

                <div className="pagination-numbers">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`pagination-btn pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => onPageClick(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn pagination-arrow"
                  onClick={onNextPage}
                  disabled={isLastGroup}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
}

export default HospitalSidebar;
