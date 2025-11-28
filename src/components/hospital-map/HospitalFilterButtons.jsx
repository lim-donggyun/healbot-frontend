import React from 'react';

function HospitalFilterButtons({
  filterType,
  onFilterChange,
  userAddress,
  onMoveToMyAddress,
  onMoveToCurrentLocation
}) {
  return (
    <>
      {/* 필터 버튼들 (지도 왼쪽 상단) */}
      <div className="map-filter-controls">
        <button
          className={`map-filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          전체
        </button>
        <button
          className={`map-filter-btn ${filterType === 'emergency' ? 'active' : ''}`}
          onClick={() => onFilterChange('emergency')}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
          </svg>
          응급실
        </button>
      </div>

      {/* 위치 이동 버튼들 */}
      <div className="location-controls">
        {/* 내 주소로 이동 */}
        <button
          className="location-btn my-address-btn"
          title="내 주소로 이동"
          onClick={onMoveToMyAddress}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>내 주소</span>
        </button>

        {/* 현재 위치로 이동 */}
        <button
          className="location-btn current-location-btn"
          title="현재 위치로 이동"
          onClick={onMoveToCurrentLocation}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
          <span>현위치</span>
        </button>
      </div>
    </>
  );
}

export default HospitalFilterButtons;
