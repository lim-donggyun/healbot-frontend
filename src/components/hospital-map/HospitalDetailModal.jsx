import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HospitalDetailModal({
  isOpen,
  selectedHospital,
  modalDepartments,
  onClose
}) {
  const navigate = useNavigate();
  // 상세 모달이 열릴 때 작은 지도 렌더링
  useEffect(() => {
    if (isOpen && selectedHospital && selectedHospital.latitude && selectedHospital.longitude) {
      const container = document.getElementById('detail-kakao-map');
      if (container && window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(
            parseFloat(selectedHospital.latitude),
            parseFloat(selectedHospital.longitude)
          ),
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          parseFloat(selectedHospital.latitude),
          parseFloat(selectedHospital.longitude)
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      }
    }
  }, [isOpen, selectedHospital]);

  if (!isOpen || !selectedHospital) {
    return null;
  }

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="map-modal-header">
          <h3>병원 상세 정보</h3>
          <button className="map-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="map-detail-content">
          <div className="map-detail-section">
            <h4>기본 정보</h4>
            <div className="map-detail-grid">
              <div className="map-detail-item">
                <span className="map-detail-label">병원명:</span>
                <span className="map-detail-value">{selectedHospital.hospitalName}</span>
              </div>
              <div className="map-detail-item map-full-width">
                <span className="map-detail-label">정보:</span>
                <span className="map-detail-value">{selectedHospital.details}</span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">병원 유형:</span>
                <span className="map-detail-value">{selectedHospital.hospitalType || '-'}</span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">전화번호:</span>
                <span className="map-detail-value">{selectedHospital.phone || '-'}</span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">응급실 전화:</span>
                <span className="map-detail-value">{selectedHospital.erPhone || '-'}</span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">응급실:</span>
                <span className="map-detail-value">{selectedHospital.emergencyYn === 'Y' ? '있음' : '없음'}</span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">운영시간:</span>
                <span className="map-detail-value">
                  {selectedHospital.operatingHours
                    ? selectedHospital.operatingHours
                        .split('|')
                        .map((time, idx) => <div key={idx}>{time.trim()}</div>)
                    : '-'}
                </span>
              </div>
              <div className="map-detail-item">
                <span className="map-detail-label">점심시간:</span>
                <span className="map-detail-value">{selectedHospital.lunchTime || '-'}</span>
              </div>
            </div>
          </div>

          <div className="map-detail-section">
            <h4>진료과 목록</h4>
            <div className="map-departments-list">
              {modalDepartments.length > 0 ? (
                modalDepartments.map((dept, index) => (
                  <span key={index} className="map-department-tag">
                    {dept}
                  </span>
                ))
              ) : (
                <p className="map-no-data">등록된 진료과가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="map-detail-section">
            <h4>병원 위치</h4>
            <div className="map-detail-info">
              {selectedHospital.latitude && selectedHospital.longitude && (
                <div className="map-hospital-map-box">
                  <div
                    id="detail-kakao-map"
                    style={{
                      width: '100%',
                      height: '250px',
                      borderRadius: '8px',
                      border: '2px solid #dee2e6',
                      marginBottom: '8px'
                    }}
                  ></div>
                  <div className="map-detail-item-single">
                    <span className="map-detail-label">주소:</span>
                    <span className="map-detail-value">{selectedHospital.address || '-'}</span>
                  </div>
                  <div className="map-action-buttons">
                    <button
                      className="kakao-map-navigate-btn"
                      onClick={() => {
                        const lat = selectedHospital.latitude;
                        const lng = selectedHospital.longitude;
                        const name = selectedHospital.hospitalName;
                        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`, '_blank');
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '6px' }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      카카오맵에서 길찾기
                    </button>
                    <button
                      className="hospital-review-btn"
                      onClick={() => {
                        navigate(`/review?hospitalId=${selectedHospital.hospitalId}&hospitalName=${encodeURIComponent(selectedHospital.hospitalName)}`);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      리뷰 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalDetailModal;
