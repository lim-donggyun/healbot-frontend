import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import { getAllHospitals, searchHospitals, getEmergencyHospitals, getHospitalsByBounds } from '../utils/hospitalApi';
import { getProfile } from '../utils/memberApi';
import './HospitalMap.css';

function HospitalMap() {
  const [hospitals, setHospitals] = useState([]); // 사이드바에 표시할 병원 리스트
  const [mapMarkers, setMapMarkers] = useState([]); // 지도에 표시할 마커용 병원 데이터
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, emergency, night, weekend
  const [userAddress, setUserAddress] = useState(null); // 사용자 등록 주소
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // 표시할 병원 개수
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);
  const currentZoomLevel = useRef(5);
  const myLocationMarkerRef = useRef(null); // 내 위치 마커

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

      // 줌 레벨 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        currentZoomLevel.current = level;
        updateMarkerStyles(level);
      });

      // 지도 이동/줌 완료 시 이벤트 리스너 - 마커만 업데이트
      window.kakao.maps.event.addListener(map, 'idle', () => {
        loadMarkersInView();
      });

      // 초기 로딩 - 사이드바와 마커 모두 로드
      loadHospitalsAndMarkers();
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

  // 줌 레벨에 따라 마커 스타일 업데이트 (크기는 고정)
  const updateMarkerStyles = (zoomLevel) => {
    // 마커 크기는 줌 레벨과 상관없이 고정
    // 카카오맵처럼 항상 같은 크기 유지
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      // 검색어가 없으면 현재 지도 영역의 병원 조회
      loadHospitalsAndMarkers();
      return;
    }

    // 검색어가 있으면 검색 API 호출
    try {
      setLoading(true);
      const searchRequest = {
        departments: [searchKeyword],
      };
      const results = await searchHospitals(searchRequest);
      setHospitals(results);
      setMapMarkers(results);
    } catch (error) {
      console.error('병원 검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setDisplayCount(10); // 필터 변경 시 표시 개수 초기화
    // 필터 변경 시 사이드바와 마커 모두 재로드
    setTimeout(() => {
      loadHospitalsAndMarkers();
    }, 100);
  };

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  // 사용자 주소 가져오기
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const profileData = await getProfile();
        console.log('프로필 데이터:', profileData); // 디버깅용
        if (profileData.address) {
          setUserAddress(profileData.address);
          console.log('주소 설정됨:', profileData.address); // 디버깅용
        } else {
          console.log('주소 없음'); // 디버깅용
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    fetchUserAddress();
  }, []);

  // 사이드바와 마커 모두 로드 (초기 로딩, 검색, 필터 변경 시)
  const loadHospitalsAndMarkers = async () => {
    if (!kakaoMapRef.current) return;

    try {
      setLoading(true);

      // 지도 영역 가져오기
      const bounds = kakaoMapRef.current.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      const emergencyOnly = filterType === 'emergency';

      // 지도 영역 기반 병원 조회
      const hospitalData = await getHospitalsByBounds(
        swLatLng.getLat(),
        swLatLng.getLng(),
        neLatLng.getLat(),
        neLatLng.getLng(),
        emergencyOnly
      );

      setHospitals(hospitalData); // 사이드바 업데이트
      setMapMarkers(hospitalData); // 마커도 업데이트
      setDisplayCount(10); // 표시 개수 초기화
    } catch (error) {
      console.error('병원 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 지도 이동 시 마커만 업데이트 (사이드바는 업데이트 안 함)
  const loadMarkersInView = async () => {
    if (!kakaoMapRef.current) return;

    try {
      // 지도 영역 가져오기
      const bounds = kakaoMapRef.current.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      const emergencyOnly = filterType === 'emergency';

      // 지도 영역 기반 병원 조회
      const hospitalData = await getHospitalsByBounds(
        swLatLng.getLat(),
        swLatLng.getLng(),
        neLatLng.getLat(),
        neLatLng.getLng(),
        emergencyOnly
      );

      setMapMarkers(hospitalData); // 마커만 업데이트 (사이드바는 그대로)
    } catch (error) {
      console.error('마커 로드 실패:', error);
    }
  };

  // 내 위치 마커 표시
  const showMyLocationMarker = (lat, lng) => {
    if (!kakaoMapRef.current) return;

    // 기존 내 위치 마커 제거
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 내 위치 마커 생성 (커스텀 오버레이)
    const markerContent = document.createElement('div');
    markerContent.style.position = 'relative';
    markerContent.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #10b981;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #10b981, 0 2px 8px rgba(16, 185, 129, 0.5);
        position: relative;
      ">
        <div style="
          width: 100%;
          height: 100%;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `;

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: markerContent,
      zIndex: 200
    });

    customOverlay.setMap(kakaoMapRef.current);
    myLocationMarkerRef.current = customOverlay;

    // CSS 애니메이션 추가
    if (!document.getElementById('my-location-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'my-location-pulse-style';
      style.textContent = `
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

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
        kakaoMapRef.current.setLevel(3); // 줄 레벨 3으로 설정

        // 내 위치 마커 표시
        showMyLocationMarker(result[0].y, result[0].x);
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

          // 내 위치 마커 표시
          showMyLocationMarker(lat, lng);
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

  // 지도에 점 형태 마커 표시 (mapMarkers 사용)
  useEffect(() => {
    if (!kakaoMapRef.current || !window.kakao || mapMarkers.length === 0) return;

    // 기존 마커 제거
    markersRef.current.forEach(({ customOverlay }) => {
      if (customOverlay) {
        customOverlay.setMap(null);
      }
    });
    markersRef.current = [];

    const maxMarkers = 100; // 최대 표시할 마커 수
    const dotSize = '10px'; // 고정 크기 (카카오맵처럼)

    // 성능 최적화: 표시할 병원 수 제한 (최대 100개)
    const hospitalsToShow = mapMarkers.slice(0, maxMarkers);

    // 새 마커 생성 (점 형태)
    hospitalsToShow.forEach((hospital) => {
      if (!hospital.latitude || !hospital.longitude) return;

      const position = new window.kakao.maps.LatLng(
        parseFloat(hospital.latitude),
        parseFloat(hospital.longitude)
      );

      // 응급실 여부에 따라 색상 결정 (불투명하게)
      const isEmergency = hospital.emergencyYn === 'Y';
      const dotColor = isEmergency ? '#ef4444' : '#3b82f6';
      const dotColorHover = isEmergency ? '#dc2626' : '#2563eb';

      // 커스텀 오버레이로 점 표시
      const dotContent = document.createElement('div');
      dotContent.className = 'hospital-dot';
      dotContent.style.width = dotSize;
      dotContent.style.height = dotSize;
      dotContent.style.backgroundColor = dotColor;
      dotContent.style.borderRadius = '50%';
      dotContent.style.cursor = 'pointer';
      dotContent.style.transition = 'background-color 0.2s';

      // 호버 효과 - 색깔만 진하게
      dotContent.addEventListener('mouseenter', () => {
        dotContent.style.backgroundColor = dotColorHover;
      });

      dotContent.addEventListener('mouseleave', () => {
        dotContent.style.backgroundColor = dotColor;
      });

      // 클릭 이벤트
      dotContent.addEventListener('click', () => {
        setSelectedHospital(hospital);
        kakaoMapRef.current.setCenter(position);
      });

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: dotContent,
        zIndex: 1
      });

      customOverlay.setMap(kakaoMapRef.current);

      markersRef.current.push({
        hospital,
        customOverlay,
        position
      });
    });
  }, [mapMarkers]);

  return (
    <div className="hospital-map-page">
      <Header />

      <div className="hospital-map-main">
        <div className="map-content-wrapper">
          {/* 병원 리스트 사이드바 */}
          <div className="hospital-list-sidebar">
            {/* 검색창 (사이드바 최상단) */}
            <div className="sidebar-search-container">
              <div className="sidebar-search-box">
                <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="병원명, 진료과목 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="sidebar-search-btn" onClick={handleSearch}>
                  검색
                </button>
              </div>
            </div>

            <div className="sidebar-header">
              <h3>검색 결과</h3>
              <span className="result-count">총 <strong>{hospitals.length}</strong>개</span>
            </div>

            {/* 현재 지역 재검색 버튼 */}
            <div className="refresh-area-container">
              <button className="refresh-area-btn" onClick={loadHospitalsAndMarkers}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                현재 지역 재검색
              </button>
            </div>

            <div className="hospital-cards">
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
                  {hospitals.slice(0, displayCount).map((hospital) => (
                    <div
                      key={hospital.hospitalId}
                      className="hospital-card"
                      onClick={() => {
                        setSelectedHospital(hospital);
                        if (hospital.latitude && hospital.longitude) {
                          const position = new window.kakao.maps.LatLng(
                            parseFloat(hospital.latitude),
                            parseFloat(hospital.longitude)
                          );
                          kakaoMapRef.current.setCenter(position);
                        }
                      }}
                    >
                      <div className="hospital-card-header">
                        <h4 className="hospital-name">{hospital.hospitalName}</h4>
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
                      {hospital.hospitalType && (
                        <div className="hospital-tags">
                          <span className="tag">{hospital.hospitalType}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 더보기 버튼 */}
                  {displayCount < hospitals.length && (
                    <div className="load-more-container">
                      <button className="load-more-btn" onClick={handleLoadMore}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                        장소 더보기 ({displayCount}/{hospitals.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="map-section">
            <div ref={mapRef} className="kakao-map"></div>

            {/* 필터 버튼들 (지도 왼쪽 상단) */}
            <div className="map-filter-controls">
              <button
                className={`map-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                전체
              </button>
              <button
                className={`map-filter-btn ${filterType === 'emergency' ? 'active' : ''}`}
                onClick={() => handleFilterChange('emergency')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z"/>
                </svg>
                응급실
              </button>
              <button
                className={`map-filter-btn ${filterType === 'night' ? 'active' : ''}`}
                onClick={() => handleFilterChange('night')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                야간진료
              </button>
              <button
                className={`map-filter-btn ${filterType === 'weekend' ? 'active' : ''}`}
                onClick={() => handleFilterChange('weekend')}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
                주말진료
              </button>
            </div>

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
