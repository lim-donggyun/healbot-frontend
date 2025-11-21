import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import './HospitalMap.css';

function HospitalMap() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, emergency, night, weekend
  const [userAddress, setUserAddress] = useState(null); // 사용자 등록 주소
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);

  useEffect(() => {
    // 이미 지도가 초기화되어 있으면 리턴
    if (kakaoMapRef.current) return;

    const initializeMap = () => {
      if (!mapRef.current) return;
      if (kakaoMapRef.current) return; // 이중 초기화 방지

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      kakaoMapRef.current = map;
    };

    // 카카오맵 스크립트 로드
    if (window.kakao && window.kakao.maps) {
      // 이미 로드되어 있으면 바로 초기화
      window.kakao.maps.load(initializeMap);
    } else {
      // 스크립트가 없으면 추가
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_JS_KEY
      }&libraries=services&autoload=false`;
      script.async = false;
      script.onload = () => {
        window.kakao.maps.load(initializeMap);
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleSearch = () => {
    // TODO: 병원 검색 API 연동
    console.log('검색어:', searchKeyword);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    // TODO: 필터링된 병원 데이터 가져오기
  };

  // 사용자 등록 주소 가져오기
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        // TODO: 사용자 주소 API 연동
        // const response = await fetch('/api/member/address');
        // const data = await response.json();
        // setUserAddress(data.address);

        // 임시 데이터 (나중에 실제 API로 교체)
        setUserAddress('서울특별시 강남구 테헤란로 123');
      } catch (error) {
        console.error('주소 가져오기 실패:', error);
      }
    };

    fetchUserAddress();
  }, []);

  // 내 주소로 이동
  const moveToMyAddress = () => {
    if (!kakaoMapRef.current || !userAddress) {
      alert('등록된 주소가 없습니다.');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(userAddress, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        kakaoMapRef.current.setCenter(coords);
        kakaoMapRef.current.setLevel(3); // 줌 레벨 3으로 설정
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    });
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!kakaoMapRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coords = new window.kakao.maps.LatLng(lat, lng);

          kakaoMapRef.current.setCenter(coords);
          kakaoMapRef.current.setLevel(3); // 줌 레벨 3으로 설정
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  return (
    <div className="hospital-map-page">
      <Header />

      <div className="hospital-map-main">
        {/* 검색 및 필터 영역 */}
        <div className="search-filter-section">
          <div className="search-container">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <input
                type="text"
                placeholder="병원명, 진료과목, 지역으로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>
                검색
              </button>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                전체
              </button>
              <button
                className={`filter-btn ${filterType === 'emergency' ? 'active' : ''}`}
                onClick={() => handleFilterChange('emergency')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
                </svg>
                응급실
              </button>
              <button
                className={`filter-btn ${filterType === 'night' ? 'active' : ''}`}
                onClick={() => handleFilterChange('night')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                야간진료
              </button>
              <button
                className={`filter-btn ${filterType === 'weekend' ? 'active' : ''}`}
                onClick={() => handleFilterChange('weekend')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                주말진료
              </button>
            </div>
          </div>
        </div>

        <div className="map-content-wrapper">
          {/* 병원 리스트 사이드바 */}
          <div className="hospital-list-sidebar">
            <div className="sidebar-header">
              <h3>검색 결과</h3>
              <span className="result-count">총 <strong>{hospitals.length}</strong>개</span>
            </div>

            <div className="hospital-cards">
              {/* 와이어프레임 카드들 */}
              {[1, 2, 3, 4, 5].map((item) => (
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
              ))}
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="map-section">
            <div ref={mapRef} className="kakao-map"></div>

            {/* 위치 이동 버튼들 */}
            <div className="location-controls">
              {/* 내 주소로 이동 */}
              <button
                className="location-btn my-address-btn"
                title="내 주소로 이동"
                onClick={moveToMyAddress}
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
                onClick={moveToCurrentLocation}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                </svg>
                <span>현위치</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalMap;
