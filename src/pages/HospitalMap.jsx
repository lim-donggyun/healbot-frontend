import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import { getAllHospitals, searchHospitals, getEmergencyHospitals, getHospitalsByBounds, getHospitalDepartments } from '../utils/hospitalApi';
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
  const [isSearchMode, setIsSearchMode] = useState(false); // 검색 모드 여부
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);
  const currentZoomLevel = useRef(5);
  const myLocationMarkerRef = useRef(null); // 내 위치 마커
  const currentInfoWindowRef = useRef(null); // 현재 열린 InfoWindow
  const sidebarRef = useRef(null); // 사이드바 참조
  const filterTypeRef = useRef(filterType); // 최신 filterType 값 참조
  const isSearchModeRef = useRef(false); // 최신 isSearchMode 값 참조

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

      // 지도 클릭 시 InfoWindow 닫기
      window.kakao.maps.event.addListener(map, 'click', () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.setMap(null);
          currentInfoWindowRef.current = null;
        }
      });

      // 줌 레벨 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        currentZoomLevel.current = level;
        updateMarkerStyles(level);
      });

      // 지도 이동/줌 완료 시 이벤트 리스너 - 마커만 업데이트 (검색 모드가 아닐 때만)
      window.kakao.maps.event.addListener(map, 'idle', async () => {
        if (!kakaoMapRef.current) return;

        // 검색 모드일 때는 자동 로드 하지 않음 (ref 사용)
        if (isSearchModeRef.current) return;

        try {
          // 지도 영역 가져오기
          const bounds = kakaoMapRef.current.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          // ref를 통해 최신 filterType 값 참조
          const emergencyOnly = filterTypeRef.current === 'emergency';

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
      // 검색어가 없으면 검색 모드 해제하고 현재 지도 영역의 병원 조회
      setIsSearchMode(false);
      loadHospitalsAndMarkers();
      return;
    }

    // 검색 모드 활성화
    setIsSearchMode(true);

    try {
      setLoading(true);
      const keyword = searchKeyword.trim();
      const keywordLower = keyword.toLowerCase();

      // 지역/역명 키워드 (이런 단어가 포함되면 장소 검색 우선)
      const locationKeywords = [
        '역', '동', '구', '시', '읍', '면', '리', '로', '길', '타운', '타워', '빌딩',
        '강남', '강북', '서초', '송파', '강서', '마포', '용산', '성동', '광진', '중구',
        '종로', '은평', '서대문', '동대문', '성북', '도봉', '노원', '관악', '영등포',
        '금천', '구로', '양천', '강동', '중랑'
      ];

      // 진료과목 목록 (단독으로 검색되면 진료과 검색)
      const departmentKeywords = [
        '내과', '외과', '정형외과', '신경외과', '성형외과', '흉부외과', '안과', '이비인후과',
        '산부인과', '소아청소년과', '피부과', '비뇨의학과', '비뇨기과', '정신건강의학과', '정신과',
        '재활의학과', '마취통증의학과', '영상의학과', '방사선과', '진단검사의학과', '병리과',
        '응급의학과', '핵의학과', '가정의학과', '치과', '한방', '한의원'
      ];

      // 병원명 키워드 (특정 병원명)
      const hospitalNameKeywords = [
        '연세', '고려', '경희', '서울대', '가톨릭', '이대', '아주대', '가천대',
        '성모', '세브란스', '삼성', 'asan', '아산'
      ];

      // 지역 키워드가 포함되어 있으면 장소 검색 우선
      const hasLocationKeyword = locationKeywords.some(loc =>
        keywordLower.includes(loc)
      );

      const isDepartmentOnly = !hasLocationKeyword && departmentKeywords.some(dept =>
        keywordLower.includes(dept) || dept.includes(keywordLower)
      );

      const isHospitalNameOnly = !hasLocationKeyword && hospitalNameKeywords.some(name =>
        keywordLower.includes(name)
      );

      // 지역 키워드가 없고 진료과목이나 특정 병원명만 있으면 장소 검색 건너뛰기
      const skipPlaceSearch = (isDepartmentOnly || isHospitalNameOnly) && !hasLocationKeyword;

      // 1단계: 주소 검색 시도
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(keyword, async (addressResult, addressStatus) => {
        try {
          let combinedResults = [];
          let searchLocation = null;

          // 주소 검색 성공 시
          if (addressStatus === window.kakao.maps.services.Status.OK && addressResult.length > 0) {
            searchLocation = {
              lat: addressResult[0].y,
              lng: addressResult[0].x
            };
          } else if (!skipPlaceSearch) {
            // 2단계: 진료과목/병원명이 아닌 경우에만 키워드(장소) 검색 시도 (예: "종각역", "강남역")
            const places = new window.kakao.maps.services.Places();

            await new Promise((resolve) => {
              places.keywordSearch(keyword, (placeResult, placeStatus) => {
                if (placeStatus === window.kakao.maps.services.Status.OK && placeResult.length > 0) {
                  // 첫 번째 검색 결과 사용
                  searchLocation = {
                    lat: placeResult[0].y,
                    lng: placeResult[0].x
                  };
                }
                resolve();
              });
            });
          }

          // 주소/장소 검색 성공 시 해당 위치 주변 병원 표시
          if (searchLocation) {
            const coords = new window.kakao.maps.LatLng(searchLocation.lat, searchLocation.lng);

            // 지도를 해당 위치로 이동
            kakaoMapRef.current.setCenter(coords);
            kakaoMapRef.current.setLevel(4);

            // 이동 후 잠시 대기 (지도 이동 완료 후 bounds 가져오기)
            await new Promise(resolve => setTimeout(resolve, 100));

            // 해당 위치 주변 병원 조회
            const bounds = kakaoMapRef.current.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            const nearbyHospitals = await getHospitalsByBounds(
              swLatLng.getLat(),
              swLatLng.getLng(),
              neLatLng.getLat(),
              neLatLng.getLng(),
              filterTypeRef.current === 'emergency'
            );

            combinedResults = nearbyHospitals;
          } else {
            // 3단계: 주소/장소 검색 실패 시 병원명/진료과목 검색

            // 진료과목 검색
            const departmentResults = await searchHospitals({
              departments: [keyword],
            });

            // 현재 지도 영역 내 병원명 검색
            const bounds = kakaoMapRef.current.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            const allHospitals = await getHospitalsByBounds(
              swLatLng.getLat(),
              swLatLng.getLng(),
              neLatLng.getLat(),
              neLatLng.getLng(),
              filterTypeRef.current === 'emergency'
            );

            // 병원명으로 필터링
            const nameResults = allHospitals.filter(hospital =>
              hospital.hospitalName && hospital.hospitalName.toLowerCase().includes(keywordLower)
            );

            // 진료과목 결과와 병원명 결과 합치기 (중복 제거)
            combinedResults = [...departmentResults];
            nameResults.forEach(hospital => {
              if (!combinedResults.some(h => h.hospitalId === hospital.hospitalId)) {
                combinedResults.push(hospital);
              }
            });
          }

          // 중복 제거 (혹시 모를 중복 hospitalId 제거)
          const uniqueResults = [];
          const seenIds = new Set();
          combinedResults.forEach(hospital => {
            if (hospital.hospitalId && !seenIds.has(hospital.hospitalId)) {
              seenIds.add(hospital.hospitalId);
              uniqueResults.push(hospital);
            }
          });

          // 결과 설정
          setHospitals(uniqueResults);
          setMapMarkers(uniqueResults);
          setDisplayCount(10);

          if (combinedResults.length === 0) {
            alert('검색 결과가 없습니다.');
          }

        } catch (error) {
          console.error('병원 검색 실패:', error);
          alert('검색 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      });

    } catch (error) {
      console.error('병원 검색 실패:', error);
      alert('검색 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setDisplayCount(10); // 필터 변경 시 표시 개수 초기화
  };

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  // filterType 변경 시 ref 업데이트 및 병원 목록과 마커 다시 로드
  useEffect(() => {
    filterTypeRef.current = filterType; // ref 업데이트
    if (kakaoMapRef.current) {
      loadHospitalsAndMarkers();
    }
  }, [filterType]);

  // isSearchMode 변경 시 ref 업데이트
  useEffect(() => {
    isSearchModeRef.current = isSearchMode;
  }, [isSearchMode]);

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

    // 검색 모드 해제
    setIsSearchMode(false);

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

  // 내 주소 마커 표시 (집 모양)
  const showMyAddressMarker = (lat, lng) => {
    if (!kakaoMapRef.current) return;

    // 기존 내 위치 마커 제거
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 내 주소 마커 생성 (집 모양)
    const markerContent = document.createElement('div');
    markerContent.style.position = 'relative';
    markerContent.innerHTML = `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- 펄스 애니메이션 배경 -->
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(5, 150, 105, 0.3);
          border-radius: 50%;
          animation: homePulse 2s infinite;
        "></div>

        <!-- 집 아이콘 -->
        <svg viewBox="0 0 24 24" width="28" height="28" style="position: relative; z-index: 1; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
          <!-- 집 배경 -->
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#059669" stroke="white" stroke-width="1"/>
        </svg>
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
    if (!document.getElementById('home-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'home-pulse-style';
      style.textContent = `
        @keyframes homePulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.4);
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // 현재 위치 마커 표시 (원형)
  const showCurrentLocationMarker = (lat, lng) => {
    if (!kakaoMapRef.current) return;

    // 기존 내 위치 마커 제거
    if (myLocationMarkerRef.current) {
      myLocationMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 현재 위치 마커 생성 (원형)
    const markerContent = document.createElement('div');
    markerContent.style.position = 'relative';
    markerContent.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background: #667eea;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #667eea, 0 2px 8px rgba(102, 126, 234, 0.5);
        position: relative;
      ">
        <div style="
          width: 100%;
          height: 100%;
          background: #667eea;
          border-radius: 50%;
          animation: locationPulse 2s infinite;
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
    if (!document.getElementById('location-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'location-pulse-style';
      style.textContent = `
        @keyframes locationPulse {
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

        // 내 주소 마커 표시 (집 모양)
        showMyAddressMarker(result[0].y, result[0].x);
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

          // 현재 위치 마커 표시 (원형)
          showCurrentLocationMarker(lat, lng);
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

  // InfoWindow 표시
  const showInfoWindow = async (hospital, lat, lng) => {
    // 기존 InfoWindow 닫기
    if (currentInfoWindowRef.current) {
      currentInfoWindowRef.current.setMap(null);
    }

    // 진료과 정보 가져오기
    let departments = [];
    try {
      departments = await getHospitalDepartments(hospital.hospitalId);
    } catch (error) {
      console.error('진료과 정보 로드 실패:', error);
    }

    // InfoWindow 내용 생성
    const contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = `
      <div style="
        position: relative;
        padding: 16px;
        width: 320px;
        max-width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        box-sizing: border-box;
      ">
        <!-- 아래쪽 화살표 (꼬리) -->
        <div style="
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
        "></div>
        <button class="info-close-btn" style="
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
          transition: all 0.2s;
          z-index: 10;
        " onmouseover="this.style.background='#e5e7eb'; this.style.color='#374151'" onmouseout="this.style.background='#f3f4f6'; this.style.color='#6b7280'">×</button>
        <div style="
          margin-bottom: 12px;
          padding-right: 0;
        ">
          <h3 style="
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            word-break: break-word;
            overflow-wrap: break-word;
            padding-right: 32px;
            margin-bottom: 6px;
          ">${hospital.hospitalName}</h3>
          ${hospital.emergencyYn === 'Y' ? `
            <span style="
              background: #fee2e2;
              color: #dc2626;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              white-space: nowrap;
              display: inline-block;
            ">응급실</span>
          ` : ''}
        </div>

        <div style="font-size: 13px; color: #6b7280; line-height: 1.6; overflow: hidden;">
          <div style="display: flex; align-items: start; margin-bottom: 8px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; max-width: 14px; margin-right: 6px; margin-top: 2px;">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span style="flex: 1; word-break: break-word; overflow-wrap: break-word; min-width: 0;">${hospital.address || '주소 정보 없음'}</span>
          </div>

          ${hospital.phone ? `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; max-width: 14px; margin-right: 6px;">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
              </svg>
              <span style="flex: 1; word-break: break-word; overflow-wrap: break-word; min-width: 0;">${hospital.phone}</span>
            </div>
          ` : ''}

          ${departments && departments.length > 0 ? `
            <div style="display: flex; align-items: start; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; margin-right: 6px; margin-top: 2px;">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">진료과</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${departments.slice(0, 5).map(dept => `
                    <span style="
                      background: #f3f4f6;
                      color: #374151;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 11px;
                      white-space: nowrap;
                    ">${dept}</span>
                  `).join('')}
                  ${departments.length > 5 ? `
                    <span style="
                      color: #6b7280;
                      padding: 2px 8px;
                      font-size: 11px;
                    ">외 ${departments.length - 5}개</span>
                  ` : ''}
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // 위치 생성
    const position = new window.kakao.maps.LatLng(lat, lng);

    // CustomOverlay로 InfoWindow 생성 (카카오맵 InfoWindow보다 안정적)
    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: contentWrapper,
      yAnchor: 1.05, // 말풍선 꼬리가 마커를 가리키도록 조정
      zIndex: 1000
    });

    customOverlay.setMap(kakaoMapRef.current);
    currentInfoWindowRef.current = customOverlay;

    // 닫기 버튼 이벤트
    const closeBtn = contentWrapper.querySelector('.info-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        customOverlay.setMap(null);
      });
    }
  };

  // 사이드바에서 병원 카드 스크롤 (하이라이트 제거)
  const scrollToHospitalCard = (hospital) => {
    // 사이드바에 해당 병원이 있는지 확인
    const cardElement = document.querySelector(`[data-hospital-id="${hospital.hospitalId}"]`);

    if (cardElement && sidebarRef.current) {
      // 스크롤만 (하이라이트 없음)
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // 사이드바에 없는 병원이면, hospitals 리스트 맨 앞에 추가
      setHospitals(prevHospitals => {
        // 이미 리스트에 있는지 확인
        const exists = prevHospitals.some(h => h.hospitalId === hospital.hospitalId);
        if (exists) {
          // 이미 있으면 맨 앞으로 이동
          const filtered = prevHospitals.filter(h => h.hospitalId !== hospital.hospitalId);
          return [hospital, ...filtered];
        } else {
          // 없으면 맨 앞에 추가
          return [hospital, ...prevHospitals];
        }
      });

      // 표시 개수를 늘려서 새로 추가된 병원이 보이도록
      setDisplayCount(prev => Math.max(prev, 10));

      // DOM 업데이트 후 스크롤 (약간의 지연)
      setTimeout(() => {
        const newCardElement = document.querySelector(`[data-hospital-id="${hospital.hospitalId}"]`);
        if (newCardElement) {
          newCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
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

    const dotSize = '10px'; // 고정 크기 (카카오맵처럼)

    // 검색 모드가 아닐 때만 줌 레벨에 따른 마커 개수 제한
    let hospitalsToShow = mapMarkers;

    if (!isSearchMode) {
      // 줌 레벨에 따른 마커 개수 제한 (성능 최적화)
      const zoomLevel = kakaoMapRef.current.getLevel();
      let maxMarkers;

      if (zoomLevel <= 3) {
        maxMarkers = Infinity; // 줌 레벨 3까지: 전부 다 표시
      } else if (zoomLevel <= 5) {
        maxMarkers = 400; // 줌 레벨 4-5: 400개
      } else {
        maxMarkers = 200; // 줌 레벨 6 이상: 200개
      }

      // 개수만 제한 (순서는 API에서 받은 그대로, 정렬 안 함)
      hospitalsToShow = mapMarkers.length > maxMarkers
        ? mapMarkers.slice(0, maxMarkers)
        : mapMarkers;

      // 마커 개수 로깅 (디버깅용)
      console.log(`📍 줌 레벨 ${zoomLevel} | 전체: ${mapMarkers.length}개 → 표시: ${hospitalsToShow.length}개`);
    } else {
      // 검색 모드일 때는 모든 검색 결과 마커 표시
      console.log(`🔍 검색 모드 | 검색 결과: ${mapMarkers.length}개 마커 표시`);
    }

    // 새 마커 생성 (점 형태 또는 십자가 형태)
    hospitalsToShow.forEach((hospital) => {
      if (!hospital.latitude || !hospital.longitude) return;

      const position = new window.kakao.maps.LatLng(
        parseFloat(hospital.latitude),
        parseFloat(hospital.longitude)
      );

      // 응급실 여부에 따라 색상 결정
      const isEmergency = hospital.emergencyYn === 'Y';
      const dotColor = isEmergency ? '#ef4444' : '#3b82f6';
      const dotColorHover = isEmergency ? '#dc2626' : '#2563eb';

      // 커스텀 오버레이 컨텐츠 생성
      const dotContent = document.createElement('div');
      dotContent.className = 'hospital-dot';
      dotContent.style.cursor = 'pointer';
      dotContent.style.transition = 'background-color 0.2s';

      if (isEmergency) {
        // 응급실: 빨간 동그라미 + 흰색 십자가 (14px)
        dotContent.style.width = '14px';
        dotContent.style.height = '14px';
        dotContent.style.position = 'relative';
        dotContent.style.backgroundColor = dotColor;
        dotContent.style.borderRadius = '50%';
        dotContent.innerHTML = `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 2.5px;
            background: white;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2.5px;
            height: 10px;
            background: white;
          "></div>
        `;
      } else {
        // 일반: 파란 동그라미 (10px)
        dotContent.style.width = dotSize;
        dotContent.style.height = dotSize;
        dotContent.style.backgroundColor = dotColor;
        dotContent.style.borderRadius = '50%';
      }

      // 호버 효과 - 색깔만 진하게
      dotContent.addEventListener('mouseenter', () => {
        if (isEmergency) {
          // 배경 동그라미 색상 변경 (십자가는 흰색 유지)
          dotContent.style.backgroundColor = dotColorHover;
        } else {
          dotContent.style.backgroundColor = dotColorHover;
        }
      });

      dotContent.addEventListener('mouseleave', () => {
        if (isEmergency) {
          // 배경 동그라미 색상 복원
          dotContent.style.backgroundColor = dotColor;
        } else {
          dotContent.style.backgroundColor = dotColor;
        }
      });

      // 클릭 이벤트
      dotContent.addEventListener('click', async (e) => {
        e.stopPropagation(); // 지도 클릭 이벤트로 전파 방지
        setSelectedHospital(hospital);

        // InfoWindow 표시 (꼬리가 마커를 가리킴)
        await showInfoWindow(hospital, parseFloat(hospital.latitude), parseFloat(hospital.longitude));

        // 사이드바 스크롤 (hospital 객체 전체 전달)
        scrollToHospitalCard(hospital);
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
  }, [mapMarkers, isSearchMode]);

  return (
    <div className="hospital-map-page">
      <Header />

      <div className="hospital-map-main">
        <div className="map-content-wrapper">
          {/* 병원 리스트 사이드바 */}
          <div className="hospital-list-sidebar" ref={sidebarRef}>
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
                {searchKeyword && (
                  <button
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchKeyword('');
                      setIsSearchMode(false);
                      loadHospitalsAndMarkers();
                    }}
                    title="검색어 지우기"
                  >
                    ×
                  </button>
                )}
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
              <button className="refresh-area-btn" onClick={() => {
                if (searchKeyword.trim()) {
                  // 검색어가 있으면 현재 위치에서 검색어로 재검색
                  handleSearch();
                } else {
                  // 검색어가 없으면 현재 지도 영역의 모든 병원 표시
                  loadHospitalsAndMarkers();
                }
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                {searchKeyword.trim() ? `현재 지역에서 '${searchKeyword}' 재검색` : '현재 지역 재검색'}
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
                      data-hospital-id={hospital.hospitalId}
                      onClick={async () => {
                        setSelectedHospital(hospital);
                        if (hospital.latitude && hospital.longitude) {
                          const position = new window.kakao.maps.LatLng(
                            parseFloat(hospital.latitude),
                            parseFloat(hospital.longitude)
                          );
                          kakaoMapRef.current.setCenter(position);

                          // InfoWindow 표시 (꼬리가 마커를 가리킴)
                          await showInfoWindow(hospital, parseFloat(hospital.latitude), parseFloat(hospital.longitude));
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
