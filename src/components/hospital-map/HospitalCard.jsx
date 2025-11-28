import React from 'react';

function HospitalCard({
  hospital,
  alphabet,
  isSelected,
  onClick,
  onDetailClick
}) {
  return (
    <div
      className={`hospital-card ${isSelected ? 'selected' : ''}`}
      data-hospital-id={hospital.hospitalId}
      onClick={onClick}
    >
      <div className="hospital-card-header">
        <h4 className="hospital-name">
          <span className="hospital-alphabet">{alphabet}</span>
          {hospital.hospitalName}
        </h4>
        {hospital.emergencyYn === 'Y' && (
          <span className="hospital-type-badge emergency">응급실</span>
        )}
      </div>
      <div className="hospital-info">
        <div className="info-row">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="info-text">{hospital.address || '주소 정보 없음'}</span>
        </div>
        {hospital.phone && (
          <div className="info-row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
            </svg>
            <span className="info-text">{hospital.phone}</span>
          </div>
        )}
        {hospital.operatingHours && (
          <div className="info-row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span className="info-text">{hospital.operatingHours}</span>
          </div>
        )}
      </div>
      <div className="hospital-card-footer">
        {hospital.hospitalType && (
          <div className="hospital-tags">
            <span className="tag">{hospital.hospitalType}</span>
          </div>
        )}
        <button
          className="card-detail-btn"
          onClick={onDetailClick}
        >
          상세보기
        </button>
      </div>
    </div>
  );
}

export default HospitalCard;
