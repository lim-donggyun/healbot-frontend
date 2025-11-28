import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import HospitalCard from "../components/hospital-map/HospitalCard";
import HospitalDetailModal from "../components/hospital-map/HospitalDetailModal";
import HospitalSearchBar from "../components/hospital-map/HospitalSearchBar";
import HospitalFilterButtons from "../components/hospital-map/HospitalFilterButtons";
import HospitalSidebar from "../components/hospital-map/HospitalSidebar";
import {
  getAllHospitals,
  searchHospitals,
  getEmergencyHospitals,
  getHospitalsByBounds,
  getHospitalDepartments,
} from "../utils/hospitalApi";
import { getProfile } from "../utils/memberApi";
import { calculateDistance, extractDistrict, getSeoulCenter } from "../utils/mapUtils";
import {
  sortHospitalsByDistance,
  redistributeHospitalsByLocation,
  HOSPITAL_TYPE_KEYWORDS,
  isHospitalTypeKeyword,
  parseSearchKeyword,
} from "../utils/hospitalUtils";
import "./HospitalMap.css";

function HospitalMap() {
  const [searchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]); // 사이드바에 표시할 병원 리스트
  const [mapMarkers, setMapMarkers] = useState([]); // 지도에 표시할 마커용 병원 데이터
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 정보 모달 열림 상태
  const [modalDepartments, setModalDepartments] = useState([]); // 모달용 진료과 목록
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, emergency, night, weekend
  const [userAddress, setUserAddress] = useState(null); // 사용자 등록 주소
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const ITEMS_PER_PAGE = 10; // 페이지당 항목 수
  const [isSearchMode, setIsSearchMode] = useState(false); // 검색 모드 여부
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false); // 진료과 드롭다운 열림 상태
  const [selectedDepartments, setSelectedDepartments] = useState(["전체"]); // 선택된 진료과 목록 (초기값: 전체)
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]); // 자동완성 제안 목록
  const [showAutocomplete, setShowAutocomplete] = useState(false); // 자동완성 표시 여부
  const [allHospitalsCache, setAllHospitalsCache] = useState([]); // 전체 병원 목록 캐시
  const [isMapInitialized, setIsMapInitialized] = useState(false); // 지도 초기화 완료 여부
  const [displayCount, setDisplayCount] = useState(10); // 표시할 병원 개수
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);
  const alphabetMarkersRef = useRef([]); // 알파벳 마커 (항상 표시)
  const currentZoomLevel = useRef(5);
  const myAddressMarkerRef = useRef(null); // 내 주소 마커 (집 모양)
  const currentLocationMarkerRef = useRef(null); // 현재 위치 마커 (원형)
  const currentLocationRef = useRef(null); // 현재 위치 좌표 저장 {lat, lng}
  const currentInfoWindowRef = useRef(null); // 현재 열린 InfoWindow
  const sidebarRef = useRef(null); // 사이드바 참조
  const filterTypeRef = useRef(filterType); // 최신 filterType 값 참조
  const isSearchModeRef = useRef(false); // 최신 isSearchMode 값 참조
  const departmentDropdownRef = useRef(null); // 진료과 드롭다운 참조
  const selectedDepartmentsRef = useRef(selectedDepartments); // 최신 selectedDepartments 값 참조
  const autocompleteRef = useRef(null); // 자동완성 드롭다운 참조
  const searchInputRef = useRef(null); // 검색창 참조

  // 진료과 목록 (전체 + 가나다순)
  const departmentList = [
    "전체",
    "가정의학과",
    "내과",
    "마취통증의학과",
    "방사선종양학과",
    "병리과",
    "비뇨의학과",
    "산부인과",
    "성형외과",
    "소아청소년과",
    "신경과",
    "신경외과",
    "안과",
    "영상의학과",
    "예방의학과",
    "외과",
    "응급의학과",
    "이비인후과",
    "재활의학과",
    "정형외과",
    "정신건강의학과",
    "진단검사의학과",
    "치과",
    "피부과",
    "핵의학과",
    "흉부외과",
    "한방내과",
    "한방부인과",
    "한방소아과",
    "한방신경정신과",
    "한방재활의학과",
  ];

  // URL 파라미터로부터 진료과 자동 선택 또는 응급실 필터 적용
  useEffect(() => {
    const deptParam = searchParams.get("dept");
    const emergencyParam = searchParams.get("emergency");

    if (deptParam) {
      // 쉼표로 구분된 여러 진료과 처리 (예: "신경과,내과")
      const departments = deptParam
        .split(",")
        .map((dept) => dept.trim())
        .filter((dept) => departmentList.includes(dept));

      if (departments.length > 0) {
        setSelectedDepartments(departments);
        selectedDepartmentsRef.current = departments;
        // 검색 모드 활성화하여 해당 진료과로 검색
        setIsSearchMode(true);
        isSearchModeRef.current = true;
      }
    }

    if (emergencyParam === "true") {
      setFilterType("emergency");
      filterTypeRef.current = "emergency";
    }
  }, [searchParams]);

  // 지도 초기화 후 진료과 필터 또는 응급실 필터 적용
  useEffect(() => {
    if (!isMapInitialized) return;

    const deptParam = searchParams.get("dept");
    const emergencyParam = searchParams.get("emergency");

    // 응급실 파라미터가 있으면 우선 처리
    if (emergencyParam === "true" && kakaoMapRef.current) {
      // 서울 전역을 보여주도록 지도 설정
      const { lat, lng } = getSeoulCenter();
      const seoulCenter = new window.kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.setCenter(seoulCenter);
      kakaoMapRef.current.setLevel(7); // 서울 전역이 보이는 줌 레벨

      // 약간의 지연을 두고 응급실 병원 로드
      setTimeout(() => {
        loadHospitalsAndMarkers(false); // 자동 선택 없이 로드만
      }, 300);
      return;
    }

    // 진료과 파라미터 처리
    if (deptParam && departmentList.includes(deptParam)) {
      setTimeout(() => {
        loadHospitalsAndMarkers();
      }, 500);
    }
  }, [isMapInitialized]);

  useEffect(() => {
    // 이미 지도가 초기화되어 있으면 리턴
    if (kakaoMapRef.current) return;

    const initializeMap = () => {
      if (!mapRef.current) return;
      if (kakaoMapRef.current) return; // 이중 초기화 방지

      const container = mapRef.current;
      const { lat, lng } = getSeoulCenter();
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      kakaoMapRef.current = map;

      // 지도 클릭 시 InfoWindow 닫기
      window.kakao.maps.event.addListener(map, "click", () => {
        if (currentInfoWindowRef.current) {
          currentInfoWindowRef.current.setMap(null);
          currentInfoWindowRef.current = null;
        }
      });

      // 줌 레벨 변경 이벤트 리스너
      window.kakao.maps.event.addListener(map, "zoom_changed", () => {
        const level = map.getLevel();
        currentZoomLevel.current = level;
        updateMarkerStyles(level);
      });

      // 지도 이동/줌 완료 시 이벤트 리스너 - 마커만 업데이트
      window.kakao.maps.event.addListener(map, "idle", async () => {
        if (!kakaoMapRef.current) return;

        console.log("🗺️ idle 이벤트 발생 - filterTypeRef:", filterTypeRef.current);

        // 검색어 입력된 검색 모드일 때는 자동 로드 하지 않음 (검색 결과 유지)
        // 단, 진료과 필터만 적용된 경우는 자동 로드 필요
        if (isSearchModeRef.current) {
          console.log("🗺️ 검색 모드라 idle 무시");
          return;
        }

        // 응급실 필터일 때는 지도 이동 시 마커 업데이트 하지 않음 (전국 응급실 유지)
        if (filterTypeRef.current === "emergency") {
          console.log("🗺️ 응급실 필터라 idle 무시");
          return;
        }

        console.log("🗺️ idle 이벤트로 마커 업데이트 시작");

        try {
          // 지도 영역 가져오기
          const bounds = kakaoMapRef.current.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          // 지도 영역 기반 병원 조회
          let hospitalData = await getHospitalsByBounds(
            swLatLng.getLat(),
            swLatLng.getLng(),
            neLatLng.getLat(),
            neLatLng.getLng(),
            false
          );

          // 진료과 필터 적용 (ref를 통해 최신 값 참조)
          const currentDepartments = selectedDepartmentsRef.current;
          if (!currentDepartments.includes("전체") && currentDepartments.length > 0) {
            const departmentResults = await searchHospitals({
              departments: currentDepartments,
            });

            const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
            hospitalData = hospitalData.filter((h) => departmentIds.has(h.hospitalId));
          }

          setMapMarkers(hospitalData); // 마커만 업데이트 (사이드바는 그대로)
        } catch (error) {
          // 마커 로드 실패
        }
      });

      // 지도 초기화 완료 상태 업데이트
      setIsMapInitialized(true);

      // URL 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const hasEmergencyParam = urlParams.get("emergency") === "true";
      const hasDeptParam = urlParams.get("dept");

      // 응급실 파라미터가 있으면 현재 위치 가져오기 스킵
      if (hasEmergencyParam) {
        // 응급실은 useEffect에서 서울 전역으로 처리
        return;
      }

      // 지도 초기화 후 현재 위치로 이동 후 병원 로드
      setTimeout(() => {
        // 세션 스토리지에서 캐시된 위치 정보 확인
        const cachedLocation = sessionStorage.getItem('userLocation');
        const cachedTime = sessionStorage.getItem('userLocationTime');
        const now = Date.now();

        // 20분 이내 캐시가 있으면 사용
        if (cachedLocation && cachedTime && (now - parseInt(cachedTime) < 1200000)) {
          console.log('✅ 캐시된 위치 사용 (즉시)');
          const { lat, lng } = JSON.parse(cachedLocation);

          // 현재 위치 저장
          currentLocationRef.current = { lat, lng };

          // 현재 위치로 지도 이동 및 줌 레벨 3으로 설정
          const currentPosition = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(currentPosition);
          map.setLevel(3);

          showCurrentLocationMarker(lat, lng);

          if (!hasDeptParam) {
            setTimeout(() => {
              loadHospitalsAndMarkers();
            }, 300);
          }
          return;
        }

        // 캐시가 없으면 위치 정보 가져오기
        if (navigator.geolocation) {
          const startTime = performance.now(); // 시작 시간 측정
          console.log("⏱️ 현위치 인식 시작...");

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const endTime = performance.now(); // 종료 시간 측정
              const duration = ((endTime - startTime) / 1000).toFixed(2); // 초 단위로 변환

              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const accuracy = position.coords.accuracy;

              console.log(`✅ 현위치 인식 완료 (${duration}초 소요)`);
              console.log("🌍 현재 위치:", { lat, lng, accuracy });

              // sessionStorage에 위치 정보 저장 (20분간 캐시)
              sessionStorage.setItem('userLocation', JSON.stringify({ lat, lng }));
              sessionStorage.setItem('userLocationTime', Date.now().toString());

              // accuracy가 너무 낮으면 (10km 이상) IP 기반 위치로 판단하고 무시
              if (accuracy > 10000) {
                console.warn("⚠️ 위치 정확도가 너무 낮습니다. 기본 위치를 사용합니다.");
                if (!hasDeptParam) {
                  loadHospitalsAndMarkers();
                }
                return;
              }

              // 현재 위치 저장
              currentLocationRef.current = { lat, lng };

              // 현재 위치로 지도 이동 및 줌 레벨 3으로 설정
              const currentPosition = new window.kakao.maps.LatLng(lat, lng);
              map.setCenter(currentPosition);
              map.setLevel(3);

              showCurrentLocationMarker(lat, lng);

              // 지도 이동 완료 후 병원 로드
              // 진료과 파라미터가 있으면 useEffect에서 처리하므로 여기서는 건너뜀
              if (!hasDeptParam) {
                setTimeout(() => {
                  loadHospitalsAndMarkers();
                }, 300);
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              if (error.code === 1) {
                console.warn("⚠️ 위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.");
              }
              // 위치 가져오기 실패 시에도 기본 위치에서 병원 로드
              // 진료과 파라미터가 있으면 useEffect에서 처리하므로 여기서는 건너뜀
              if (!hasDeptParam) {
                loadHospitalsAndMarkers();
              }
            },
            {
              enableHighAccuracy: false, // 빠른 네트워크 기반 위치 사용
              timeout: 10000, // 5초
              maximumAge: 300000, // 5분 이내 캐시 허용
            }
          );
        } else {
          // Geolocation 미지원 시에도 기본 위치에서 병원 로드
          // 진료과 파라미터가 있으면 useEffect에서 처리하므로 여기서는 건너뜀
          if (!hasDeptParam) {
            loadHospitalsAndMarkers();
          }
        }
      }, 500);
    };

    // 카카오맵 스크립트 로드
    if (window.kakao && window.kakao.maps) {
      // 이미 로드되어 있으면 바로 초기화
      window.kakao.maps.load(initializeMap);
    } else {
      // 스크립트가 없으면 추가
      const script = document.createElement("script");
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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target)) {
        setIsDepartmentDropdownOpen(false);
      }
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };

    if (isDepartmentDropdownOpen || showAutocomplete) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDepartmentDropdownOpen, showAutocomplete]);

  // 진료과 토글
  const toggleDepartment = (department) => {
    setSelectedDepartments((prev) => {
      if (department === "전체") {
        // 전체 선택 시
        if (prev.includes("전체")) {
          // 전체가 이미 선택되어 있으면 해제 (빈 배열)
          return [];
        } else {
          // 전체 선택
          return ["전체"];
        }
      } else {
        // 개별 진료과 선택
        if (prev.includes(department)) {
          // 이미 선택되어 있으면 해제
          const newSelection = prev.filter((d) => d !== department);
          // 아무것도 선택 안 되면 전체로 복귀
          return newSelection.length === 0 ? ["전체"] : newSelection;
        } else {
          // 새로 선택 (전체가 선택되어 있었다면 제거)
          const newSelection = prev.filter((d) => d !== "전체");
          return [...newSelection, department];
        }
      }
    });
  };

  // 진료과 선택 완료
  const applyDepartmentFilter = () => {
    setIsDepartmentDropdownOpen(false);
    // 검색 모드 해제 (진료과 필터는 idle 이벤트에서 자동 적용됨)
    setIsSearchMode(false);
    // 검색어 없이 현재 지역에서 진료과 필터 적용하여 재검색
    loadHospitalsAndMarkers();
  };

  // 진료과 전체 선택
  const selectAllDepartments = () => {
    setSelectedDepartments(["전체"]);
  };

  // 검색어 입력 시 자동완성 처리 (캐시 사용, 즉시 반응)
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    // 1글자 이상 입력 시 자동완성 표시 (즉시 반응)
    if (value.trim().length >= 1) {
      // 조건 체크: 진료과 필터가 있는지 확인
      const hasDepartmentFilter = !selectedDepartments.includes("전체") && selectedDepartments.length > 0;

      const keywordLower = value.toLowerCase();
      let filtered = [];

      if (hasDepartmentFilter) {
        // 진료과 조건이 있으면 백엔드에서 가져오기
        try {
          const departmentHospitals = await searchHospitals({
            departments: selectedDepartments,
          });

          // 병원명으로 필터링
          filtered = departmentHospitals.filter(
            (hospital) => hospital.hospitalName && hospital.hospitalName.toLowerCase().includes(keywordLower)
          );
        } catch (error) {
          filtered = [];
        }
      } else {
        // 진료과 조건이 없으면 캐시에서 병원명만 필터링
        if (allHospitalsCache.length === 0) {
          setShowAutocomplete(false);
          return;
        }

        filtered = allHospitalsCache.filter(
          (hospital) => hospital.hospitalName && hospital.hospitalName.toLowerCase().includes(keywordLower)
        );
      }

      // 최대 10개까지만 표시
      setAutocompleteSuggestions(filtered.slice(0, 10));
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
      setAutocompleteSuggestions([]);
    }
  };

  // 자동완성 항목 선택 - 병원으로 직접 이동
  const handleSuggestionClick = async (hospital) => {
    setSearchKeyword(hospital.hospitalName);
    setShowAutocomplete(false);
    setIsSearchMode(true);
    setLoading(true);

    try {
      // 해당 병원으로 직접 이동
      if (hospital.latitude && hospital.longitude) {
        const coords = new window.kakao.maps.LatLng(parseFloat(hospital.latitude), parseFloat(hospital.longitude));

        // 지도를 해당 병원 위치로 이동
        kakaoMapRef.current.setCenter(coords);
        kakaoMapRef.current.setLevel(4);

        await new Promise((resolve) => setTimeout(resolve, 100));

        // 해당 병원 주변 조회
        const bounds = kakaoMapRef.current.getBounds();
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();

        let nearbyHospitals = await getHospitalsByBounds(
          swLatLng.getLat(),
          swLatLng.getLng(),
          neLatLng.getLat(),
          neLatLng.getLng(),
          filterTypeRef.current === "emergency"
        );

        // 진료과 필터 적용
        if (!selectedDepartments.includes("전체") && selectedDepartments.length > 0) {
          const departmentResults = await searchHospitals({
            departments: selectedDepartments,
          });

          const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
          nearbyHospitals = nearbyHospitals.filter((h) => departmentIds.has(h.hospitalId));
        }

        // 거리 계산 및 정렬
        const mapCenter = kakaoMapRef.current.getCenter();
        const centerLat = mapCenter.getLat();
        const centerLng = mapCenter.getLng();

        nearbyHospitals.forEach((h) => {
          if (h.latitude && h.longitude) {
            h.distance = calculateDistance(centerLat, centerLng, parseFloat(h.latitude), parseFloat(h.longitude));
          } else {
            h.distance = Infinity;
          }
        });

        nearbyHospitals.sort((a, b) => a.distance - b.distance);

        setHospitals(nearbyHospitals);
        setMapMarkers(nearbyHospitals);
        setDisplayCount(10);
        setSelectedHospital(hospital);

        // InfoWindow 자동 표시
        await showInfoWindow(hospital, parseFloat(hospital.latitude), parseFloat(hospital.longitude));

        // 사이드바 스크롤
        scrollToHospitalCard(hospital);
      }
    } catch (error) {
      // 병원 이동 실패
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    // 연관검색어 닫기
    setShowAutocomplete(false);

    // 검색 모드 활성화
    setIsSearchMode(true);

    // 페이지 초기화
    setCurrentPage(1);

    try {
      setLoading(true);
      const keyword = searchKeyword.trim();
      const keywordLower = keyword.toLowerCase();

      // 조건 체크
      const hasKeyword = keyword.length > 0;
      const hasDepartmentFilter = !selectedDepartments.includes("전체") && selectedDepartments.length > 0;

      // 조건에 따라 검색 로직 분기
      // 케이스 1: 검색어 없음 + 진료과 없음 = 현재 지도 영역 전체
      if (!hasKeyword && !hasDepartmentFilter) {
        setIsSearchMode(false);
        loadHospitalsAndMarkers();
        return;
      }

      // 케이스 2: 검색어 없음 + 진료과 있음 = 현재 지도 영역 내에서 진료과 필터링
      if (!hasKeyword && hasDepartmentFilter) {
        setIsSearchMode(false);
        loadHospitalsAndMarkers();
        setLoading(false);
        return;
      }

      // 케이스 3, 4: 검색어 있음 (진료과 있을 수도, 없을 수도)
      let combinedResults = [];

      // 진료과 조건이 있으면 백엔드에서 진료과가 있는 병원 목록 먼저 가져오기
      let departmentFilteredHospitals = [];
      if (hasDepartmentFilter) {
        departmentFilteredHospitals = await searchHospitals({
          departments: selectedDepartments,
        });
      }

      // 병원명으로 검색 (정확히 일치하는 경우만)
      let hospitalNameResults = [];
      if (hasDepartmentFilter) {
        // 진료과 조건이 있으면 진료과 병원 목록에서 병원명 필터링
        hospitalNameResults = departmentFilteredHospitals.filter(
          (hospital) => hospital.hospitalName && hospital.hospitalName.toLowerCase() === keywordLower
        );
      } else {
        // 진료과 조건이 없으면 캐시에서 병원명만 필터링
        if (allHospitalsCache.length > 0) {
          hospitalNameResults = allHospitalsCache.filter(
            (hospital) => hospital.hospitalName && hospital.hospitalName.toLowerCase() === keywordLower
          );
        }
      }

      // 병원 유형 및 진료과 키워드 체크
      const isKeyword = isHospitalTypeKeyword(keyword);

      // 병원 유형 또는 진료과 키워드로 검색한 경우 (예: "한의원", "안과")
      if (isKeyword) {
        // 진료과 목록에 있는 경우 진료과로 검색
        const isDepartment = departmentList.includes(keyword);

        let nearbyHospitals = [];

        if (isDepartment) {
          // 진료과로 백엔드에서 검색
          nearbyHospitals = await searchHospitals({
            departments: [keyword],
          });

          // 현재 지도 영역으로 필터링
          const bounds = kakaoMapRef.current.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          nearbyHospitals = nearbyHospitals.filter((hospital) => {
            if (!hospital.latitude || !hospital.longitude) return false;
            const lat = parseFloat(hospital.latitude);
            const lng = parseFloat(hospital.longitude);
            return (
              lat >= swLatLng.getLat() &&
              lat <= neLatLng.getLat() &&
              lng >= swLatLng.getLng() &&
              lng <= neLatLng.getLng()
            );
          });
        } else {
          // 병원 유형으로 검색 (병원명에서 검색)
          const bounds = kakaoMapRef.current.getBounds();
          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          nearbyHospitals = await getHospitalsByBounds(
            swLatLng.getLat(),
            swLatLng.getLng(),
            neLatLng.getLat(),
            neLatLng.getLng(),
            filterTypeRef.current === "emergency"
          );

          // 병원 유형으로 필터링
          nearbyHospitals = nearbyHospitals.filter((hospital) => {
            return hospital.hospitalName && hospital.hospitalName.includes(keyword);
          });
        }

        // 진료과 조건이 추가로 있으면 필터링
        if (hasDepartmentFilter) {
          const departmentResults = await searchHospitals({
            departments: selectedDepartments,
          });

          const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
          nearbyHospitals = nearbyHospitals.filter((h) => departmentIds.has(h.hospitalId));
        }

        // 거리 계산 및 정렬
        const mapCenter = kakaoMapRef.current.getCenter();
        const centerLat = mapCenter.getLat();
        const centerLng = mapCenter.getLng();

        nearbyHospitals.forEach((hospital) => {
          if (hospital.latitude && hospital.longitude) {
            hospital.distance = calculateDistance(
              centerLat,
              centerLng,
              parseFloat(hospital.latitude),
              parseFloat(hospital.longitude)
            );
          } else {
            hospital.distance = Infinity;
          }
        });

        nearbyHospitals.sort((a, b) => a.distance - b.distance);

        // 결과 설정
        setHospitals(nearbyHospitals);
        setMapMarkers(nearbyHospitals);
        setDisplayCount(10);

        if (nearbyHospitals.length === 0) {
          alert("검색 결과가 없습니다.");
        }

        setLoading(false);
        return;
      }

      // 병원명이 정확히 일치하는 경우에만 바로 사용 (주소 검색 건너뛰기)
      if (hospitalNameResults.length > 0) {
        // 거리 계산 및 정렬
        const mapCenter = kakaoMapRef.current.getCenter();
        const centerLat = mapCenter.getLat();
        const centerLng = mapCenter.getLng();

        hospitalNameResults.forEach((hospital) => {
          if (hospital.latitude && hospital.longitude) {
            hospital.distance = calculateDistance(
              centerLat,
              centerLng,
              parseFloat(hospital.latitude),
              parseFloat(hospital.longitude)
            );
          } else {
            hospital.distance = Infinity;
          }
        });

        hospitalNameResults.sort((a, b) => a.distance - b.distance);

        // 결과 설정
        setHospitals(hospitalNameResults);
        setMapMarkers(hospitalNameResults);
        setDisplayCount(10);
        setLoading(false);
        return;
      }

      // 병원명 검색 결과가 없으면 주소 검색 시도
      // 검색어에서 위치와 병원 유형 분리 (예: "종각역 한의원" -> 위치: "종각역", 유형: "한의원")
      const { locationPart, hospitalTypePart } = parseSearchKeyword(keyword);

      // 위치 부분이 없으면 (병원 유형만 있으면) 이미 위에서 처리했으므로 여기까지 오면 안됨
      // 하지만 안전을 위해 체크
      if (!locationPart && hospitalTypePart) {
        setLoading(false);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      // geocoder.addressSearch를 Promise로 감싸서 에러 처리
      await new Promise((resolveGeocode, rejectGeocode) => {
        geocoder.addressSearch(locationPart, async (addressResult, addressStatus) => {
          try {
            let searchLocation = null;

            // 1단계: 주소 검색 시도
            if (addressStatus === window.kakao.maps.services.Status.OK && addressResult.length > 0) {
              searchLocation = {
                lat: addressResult[0].y,
                lng: addressResult[0].x,
              };
            } else {
              // 2단계: 키워드(장소) 검색 시도 (예: "강남역", "종각역", "서울대학교병원")
              const places = new window.kakao.maps.services.Places();

              await new Promise((resolve) => {
                places.keywordSearch(locationPart, (placeResult, placeStatus) => {
                  if (placeStatus === window.kakao.maps.services.Status.OK && placeResult.length > 0) {
                    // 첫 번째 검색 결과 사용
                    searchLocation = {
                      lat: placeResult[0].y,
                      lng: placeResult[0].x,
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
              await new Promise((resolve) => setTimeout(resolve, 100));

              // 해당 위치 주변 병원 조회
              const bounds = kakaoMapRef.current.getBounds();
              const swLatLng = bounds.getSouthWest();
              const neLatLng = bounds.getNorthEast();

              let nearbyHospitals = await getHospitalsByBounds(
                swLatLng.getLat(),
                swLatLng.getLng(),
                neLatLng.getLat(),
                neLatLng.getLng(),
                filterTypeRef.current === "emergency"
              );

              // 진료과 조건이 있으면 필터링
              if (hasDepartmentFilter) {
                const departmentResults = await searchHospitals({
                  departments: selectedDepartments,
                });

                const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
                nearbyHospitals = nearbyHospitals.filter((h) => departmentIds.has(h.hospitalId));
              }

              // 병원 유형/진료과 필터가 있으면 필터링 (예: "종각역 한의원" -> "한의원"만 필터링, "강남역 안과" -> 안과 진료과만)
              if (hospitalTypePart) {
                const isDepartment = departmentList.includes(hospitalTypePart);

                if (isDepartment) {
                  // 진료과로 필터링
                  const departmentResults = await searchHospitals({
                    departments: [hospitalTypePart],
                  });

                  const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
                  nearbyHospitals = nearbyHospitals.filter((h) => departmentIds.has(h.hospitalId));
                } else {
                  // 병원 유형으로 필터링 (병원명 기준)
                  nearbyHospitals = nearbyHospitals.filter((hospital) => {
                    return hospital.hospitalName && hospital.hospitalName.includes(hospitalTypePart);
                  });
                }
              }

              combinedResults = nearbyHospitals;
            } else {
              // 3단계: 주소/장소 검색 실패 시 병원명 검색 결과 사용
              if (hospitalNameResults.length > 0) {
                combinedResults = hospitalNameResults;
              } else {
                // 모든 검색 방법 실패
                alert("검색 결과가 없습니다.");
                setLoading(false);
                resolveGeocode(); // Promise 완료
                return;
              }
            }

            // 중복 제거 (혹시 모를 중복 hospitalId 제거)
            const uniqueResults = [];
            const seenIds = new Set();
            combinedResults.forEach((hospital) => {
              if (hospital.hospitalId && !seenIds.has(hospital.hospitalId)) {
                seenIds.add(hospital.hospitalId);
                uniqueResults.push(hospital);
              }
            });

            // 거리 계산 및 정렬
            const mapCenter = kakaoMapRef.current.getCenter();
            const centerLat = mapCenter.getLat();
            const centerLng = mapCenter.getLng();

            uniqueResults.forEach((hospital) => {
              if (hospital.latitude && hospital.longitude) {
                hospital.distance = calculateDistance(
                  centerLat,
                  centerLng,
                  parseFloat(hospital.latitude),
                  parseFloat(hospital.longitude)
                );
              } else {
                hospital.distance = Infinity;
              }
            });

            uniqueResults.sort((a, b) => a.distance - b.distance);

            // 결과 설정
            setHospitals(uniqueResults);
            setMapMarkers(uniqueResults);
            setDisplayCount(10);

            if (combinedResults.length === 0) {
              alert("검색 결과가 없습니다.");
            }

            resolveGeocode(); // 성공적으로 완료
          } catch (error) {
            rejectGeocode(error); // 에러를 Promise reject로 전달
          } finally {
            setLoading(false);
          }
        });
      });
    } catch (error) {
      alert("검색 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleFilterChange = async (type) => {
    console.log("🚨 필터 변경:", type);
    setCurrentPage(1); // 필터 변경 시 페이지 초기화

    // ref 즉시 업데이트 (idle 이벤트가 발생하기 전에)
    filterTypeRef.current = type;

    // 응급실 필터로 변경 시, 서울 전역을 보여주도록 지도 이동
    if (type === "emergency" && kakaoMapRef.current) {
      console.log("🚨 응급실 필터 활성화 - 서울 전역으로 이동");
      const { lat, lng } = getSeoulCenter();
      const seoulCenter = new window.kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.setCenter(seoulCenter);
      kakaoMapRef.current.setLevel(7); // 서울 전역이 보이는 줌 레벨

      setFilterType(type);
    } else {
      // 응급실이 아니면 바로 필터 변경
      console.log("🚨 일반 필터로 변경:", type);

      // 현재 줌 레벨이 4 이상이면 4로 조정 (중심은 유지)
      if (kakaoMapRef.current) {
        const currentLevel = kakaoMapRef.current.getLevel();
        if (currentLevel >= 4) {
          console.log(`📍 줌 레벨 조정: ${currentLevel} → 4`);
          kakaoMapRef.current.setLevel(4);
        }
      }

      setFilterType(type);
    }
  };

  // 페이지 이동 함수들
  const handleNextPage = () => {
    const totalPages = Math.ceil(hospitals.length / ITEMS_PER_PAGE);
    const maxPagesToShow = 5;
    const currentGroup = Math.ceil(currentPage / maxPagesToShow);
    const nextGroupFirstPage = currentGroup * maxPagesToShow + 1;

    if (nextGroupFirstPage <= totalPages) {
      setCurrentPage(nextGroupFirstPage);
      // 페이지 변경 시 사이드바 최상단으로 스크롤
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = 0;
      }
    }
  };

  const handlePrevPage = () => {
    const maxPagesToShow = 5;
    const currentGroup = Math.ceil(currentPage / maxPagesToShow);
    const prevGroupFirstPage = (currentGroup - 2) * maxPagesToShow + 1;

    if (prevGroupFirstPage >= 1) {
      setCurrentPage(prevGroupFirstPage);
      // 페이지 변경 시 사이드바 최상단으로 스크롤
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = 0;
      }
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 사이드바 최상단으로 스크롤
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = 0;
    }
  };

  // 페이지 번호 배열 생성 (최대 5개씩 표시)
  const getPageNumbers = () => {
    const totalPages = Math.ceil(hospitals.length / ITEMS_PER_PAGE);
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // 현재 페이지 그룹 계산 (1-5, 6-10, 11-15 등)
    const currentGroup = Math.ceil(currentPage / maxPagesToShow);
    const startPage = (currentGroup - 1) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
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

  // selectedDepartments 변경 시 ref 업데이트
  useEffect(() => {
    selectedDepartmentsRef.current = selectedDepartments;
  }, [selectedDepartments]);

  // 상세 모달이 열릴 때 병원 위치 지도 표시
  useEffect(() => {
    if (isDetailModalOpen && selectedHospital && selectedHospital.latitude && selectedHospital.longitude) {
      setTimeout(() => {
        const container = document.getElementById("detail-kakao-map");
        if (!container || !window.kakao || !window.kakao.maps) return;

        const options = {
          center: new window.kakao.maps.LatLng(
            parseFloat(selectedHospital.latitude),
            parseFloat(selectedHospital.longitude)
          ),
          level: 3,
        };

        const detailMap = new window.kakao.maps.Map(container, options);

        // 병원 위치 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(
          parseFloat(selectedHospital.latitude),
          parseFloat(selectedHospital.longitude)
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(detailMap);
      }, 100);
    }
  }, [isDetailModalOpen, selectedHospital]);
  // userAddress 또는 지도 초기화 상태 변경 시 마커 표시
  useEffect(() => {
    if (userAddress && isMapInitialized && kakaoMapRef.current && window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(userAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          showMyAddressMarker(result[0].y, result[0].x);
        }
      });
    }
  }, [userAddress, isMapInitialized]);

  // 사용자 주소 가져오기 및 전체 병원 캐시 로드
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const profileData = await getProfile();
        if (profileData.address) {
          setUserAddress(profileData.address);
        }
      } catch (error) {
        // 사용자 정보 로드 실패
      }
    };

    const fetchAllHospitals = async () => {
      try {
        const hospitals = await searchHospitals({ departments: [] });
        setAllHospitalsCache(hospitals);
      } catch (error) {
        // 병원 목록 캐시 실패
      }
    };

    fetchUserAddress();
    fetchAllHospitals(); // 초기 로딩 시 전체 병원 목록 캐시
  }, []);

  // 사이드바와 마커 모두 로드 (초기 로딩, 검색, 필터 변경 시)
  const loadHospitalsAndMarkers = async (autoSelectNearest = false) => {
    if (!kakaoMapRef.current) return;

    console.log("🏥 loadHospitalsAndMarkers 호출 - filterType:", filterType);

    // 검색 모드 해제
    setIsSearchMode(false);

    try {
      setLoading(true);

      const emergencyOnly = filterType === "emergency";
      let hospitalData;

      // 응급실 필터가 활성화되면 전국의 모든 응급실 병원 조회
      if (emergencyOnly) {
        console.log("🚨 응급실 병원만 조회");
        hospitalData = await getEmergencyHospitals();
        console.log("🚨 응급실 병원 개수:", hospitalData.length);
        console.log("🚨 응급실 병원 샘플:", hospitalData.slice(0, 3));
      } else {
        // 일반 필터는 지도 영역 기반 병원 조회
        const bounds = kakaoMapRef.current.getBounds();
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();

        console.log("🏥 일반 병원 조회 - 영역:", { sw: swLatLng.getLat(), ne: neLatLng.getLat() });
        hospitalData = await getHospitalsByBounds(
          swLatLng.getLat(),
          swLatLng.getLng(),
          neLatLng.getLat(),
          neLatLng.getLng(),
          false
        );
        console.log("🏥 일반 병원 개수:", hospitalData.length);
      }

      // 진료과 필터 적용
      if (!selectedDepartments.includes("전체") && selectedDepartments.length > 0) {
        const departmentResults = await searchHospitals({
          departments: selectedDepartments,
        });

        const departmentIds = new Set(departmentResults.map((h) => h.hospitalId));
        hospitalData = hospitalData.filter((h) => departmentIds.has(h.hospitalId));
      }

      // 거리 계산 및 정렬
      const mapCenter = kakaoMapRef.current.getCenter();
      const centerLat = mapCenter.getLat();
      const centerLng = mapCenter.getLng();

      // 거리순 정렬 (가까운 순)
      sortHospitalsByDistance(hospitalData, centerLat, centerLng);

      // 같은 좌표의 병원들을 분산: 첫 번째는 앞에, 나머지는 뒤로
      const reorderedHospitals = redistributeHospitalsByLocation(hospitalData);

      console.log("🏥 최종 병원 개수 (사이드바):", reorderedHospitals.length);
      console.log("🏥 최종 병원 개수 (마커):", hospitalData.length);

      setHospitals(reorderedHospitals); // 사이드바 업데이트
      setMapMarkers(hospitalData); // 마커도 업데이트
      setDisplayCount(10); // 표시 개수 초기화

      // 가장 가까운 병원 자동 선택 (응급실 필터 시)
      if (autoSelectNearest && hospitalData.length > 0) {
        const nearestHospital = hospitalData[0];
        setSelectedHospital(nearestHospital);
        setCurrentPage(1); // 첫 페이지로 이동

        // 선택된 병원 위치로 지도 이동
        if (nearestHospital.latitude && nearestHospital.longitude) {
          const position = new window.kakao.maps.LatLng(
            parseFloat(nearestHospital.latitude),
            parseFloat(nearestHospital.longitude)
          );
          kakaoMapRef.current.panTo(position);
        }

        // 사이드바 맨 위로 스크롤
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = 0;
        }
      }
    } catch (error) {
      // 병원 로드 실패
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

      const emergencyOnly = filterType === "emergency";

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
      // 마커 로드 실패
    }
  };

  // 내 주소 마커 표시 (집 모양)
  const showMyAddressMarker = (lat, lng) => {
    if (!kakaoMapRef.current) {
      return;
    }

    // 기존 내 주소 마커 제거
    if (myAddressMarkerRef.current) {
      myAddressMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 내 주소 마커 생성 (집 모양)
    const markerContent = document.createElement("div");
    markerContent.style.position = "relative";
    markerContent.style.cursor = "pointer";
    markerContent.innerHTML = `
      <div style="
        position: relative;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- 집 아이콘 -->
        <svg viewBox="0 0 24 24" width="28" height="28" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#059669" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    `;

    // 마커 클릭 이벤트 추가
    markerContent.addEventListener("click", async () => {
      kakaoMapRef.current.setCenter(position);
      kakaoMapRef.current.setLevel(3);
      await new Promise((resolve) => setTimeout(resolve, 100));
      loadHospitalsAndMarkers();
    });

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: markerContent,
      zIndex: 200,
    });

    customOverlay.setMap(kakaoMapRef.current);
    myAddressMarkerRef.current = customOverlay;
  };

  // 현재 위치 마커 표시 (원형)
  const showCurrentLocationMarker = (lat, lng) => {
    if (!kakaoMapRef.current) {
      return;
    }

    // 기존 현재 위치 마커 제거
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 현재 위치 마커 생성 (원형)
    const markerContent = document.createElement("div");
    markerContent.style.position = "relative";
    markerContent.style.cursor = "pointer";
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

    // 마커 클릭 이벤트 추가
    markerContent.addEventListener("click", async () => {
      kakaoMapRef.current.setCenter(position);
      kakaoMapRef.current.setLevel(3);
      await new Promise((resolve) => setTimeout(resolve, 100));
      loadHospitalsAndMarkers();
    });

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: position,
      content: markerContent,
      zIndex: 200,
    });

    customOverlay.setMap(kakaoMapRef.current);
    currentLocationMarkerRef.current = customOverlay;

    // CSS 애니메이션 추가
    if (!document.getElementById("location-pulse-style")) {
      const style = document.createElement("style");
      style.id = "location-pulse-style";
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
  const moveToMyAddress = async () => {
    if (!kakaoMapRef.current || !userAddress) {
      alert("등록된 주소가 없습니다.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(userAddress, async (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        kakaoMapRef.current.setCenter(coords);
        kakaoMapRef.current.setLevel(3); // 줌 레벨 3으로 설정

        // 내 주소 마커 표시 (집 모양)
        showMyAddressMarker(result[0].y, result[0].x);

        // 이동 후 해당 지역 병원 검색
        await new Promise((resolve) => setTimeout(resolve, 100));
        loadHospitalsAndMarkers();
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (!kakaoMapRef.current) return;

    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    const startTime = performance.now(); // 시작 시간 측정
    console.log("⏱️ 현위치 버튼 클릭 - 인식 시작...");

    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const endTime = performance.now(); // 종료 시간 측정
        const duration = ((endTime - startTime) / 1000).toFixed(2); // 초 단위로 변환

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        console.log(`✅ 현위치 인식 완료 (${duration}초 소요)`);
        console.log("🌍 현재 위치 (이동):", { lat, lng, accuracy });

        // accuracy가 너무 낮으면 (10km 이상) IP 기반 위치로 판단하고 무시
        if (accuracy > 10000) {
          alert("위치 정확도가 낮습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.");
          return;
        }

        const coords = new window.kakao.maps.LatLng(lat, lng);

        // 현재 위치 저장
        currentLocationRef.current = { lat, lng };

        kakaoMapRef.current.setCenter(coords);
        kakaoMapRef.current.setLevel(3); // 줌 레벨 3으로 설정

        // 현재 위치 마커 표시 (원형)
        showCurrentLocationMarker(lat, lng);

        // 이동 후 해당 지역 병원 검색
        await new Promise((resolve) => setTimeout(resolve, 100));
        loadHospitalsAndMarkers();
      },
      (error) => {
        if (error.code === 1) {
          alert("위치 권한이 거부되었습니다.\n브라우저 설정에서 위치 권한을 허용해주세요.");
        }
      },
      {
        enableHighAccuracy: false, // 빠른 네트워크 기반 위치 사용
        timeout: 10000, // 5초
        maximumAge: 300000, // 5분 이내 캐시 허용
      }
    );
  };

  // 상세보기 버튼 클릭 시 모달 열기
  const handleDetailButtonClick = async (hospital, e) => {
    if (e) {
      e.stopPropagation(); // 부모 요소 클릭 이벤트 전파 방지
    }

    setSelectedHospital(hospital);
    setIsDetailModalOpen(true);

    // 진료과 목록 조회
    try {
      const depts = await getHospitalDepartments(hospital.hospitalId);
      setModalDepartments(depts || []);
    } catch (error) {
      setModalDepartments([]);
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
      // 진료과 정보 로드 실패
    }

    // InfoWindow 내용 생성
    const contentWrapper = document.createElement("div");
    contentWrapper.setAttribute("data-info-window", "true"); // InfoWindow 식별자 추가
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
          ${
            hospital.emergencyYn === "Y"
              ? `
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
          `
              : ""
          }
        </div>

        <div style="font-size: 13px; color: #6b7280; line-height: 1.6; overflow: hidden;">
          <div style="display: flex; align-items: start; margin-bottom: 8px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; max-width: 14px; margin-right: 6px; margin-top: 2px;">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span style="flex: 1; word-break: break-word; overflow-wrap: break-word; min-width: 0;">${
              hospital.address || "주소 정보 없음"
            }</span>
          </div>

          ${
            hospital.phone
              ? `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; max-width: 14px; margin-right: 6px;">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
              </svg>
              <span style="flex: 1; word-break: break-word; overflow-wrap: break-word; min-width: 0;">${hospital.phone}</span>
            </div>
          `
              : ""
          }

          ${
            departments && departments.length > 0
              ? `
            <div style="display: flex; align-items: start; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="min-width: 14px; margin-right: 6px; margin-top: 2px;">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">진료과</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${departments
                    .slice(0, 5)
                    .map(
                      (dept) => `
                    <span style="
                      background: #f3f4f6;
                      color: #374151;
                      padding: 2px 8px;
                      border-radius: 4px;
                      font-size: 11px;
                      white-space: nowrap;
                    ">${dept}</span>
                  `
                    )
                    .join("")}
                  ${
                    departments.length > 5
                      ? `
                    <span style="
                      color: #6b7280;
                      padding: 2px 8px;
                      font-size: 11px;
                    ">외 ${departments.length - 5}개</span>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>

        <!-- 상세보기 버튼 (오른쪽 하단) -->
        <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
          <button class="info-detail-btn" style="
            padding: 5px 12px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">상세보기</button>
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
      zIndex: 1000,
      clickable: true, // 클릭 가능하도록 설정 - 지도 클릭 이벤트 차단
    });

    customOverlay.setMap(kakaoMapRef.current);
    currentInfoWindowRef.current = customOverlay;

    // DOM이 렌더링된 후 이벤트 리스너 추가
    setTimeout(() => {
      // 닫기 버튼 이벤트
      const closeBtn = contentWrapper.querySelector(".info-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          customOverlay.setMap(null);
        });
      }

      // 상세보기 버튼 이벤트 (클로저로 hospital 객체 전달)
      const detailBtn = contentWrapper.querySelector(".info-detail-btn");
      if (detailBtn) {
        detailBtn.addEventListener("click", async (e) => {
          e.stopPropagation();

          // 모달 열기
          setSelectedHospital(hospital);
          setIsDetailModalOpen(true);

          // 진료과 목록 조회
          try {
            const depts = await getHospitalDepartments(hospital.hospitalId);
            setModalDepartments(depts || []);
          } catch (error) {
            setModalDepartments([]);
          }
        });
      }
    }, 0);
  };

  // 사이드바에서 병원 카드 스크롤 (하이라이트 제거)
  const scrollToHospitalCard = (hospital) => {
    // 사이드바에 해당 병원이 있는지 확인
    const cardElement = document.querySelector(`[data-hospital-id="${hospital.hospitalId}"]`);

    if (cardElement && sidebarRef.current) {
      // 스크롤만 (하이라이트 없음)
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // 사이드바에 없는 병원이면, hospitals 리스트 맨 앞에 추가
      setHospitals((prevHospitals) => {
        // 이미 리스트에 있는지 확인
        const exists = prevHospitals.some((h) => h.hospitalId === hospital.hospitalId);
        if (exists) {
          // 이미 있으면 맨 앞으로 이동
          const filtered = prevHospitals.filter((h) => h.hospitalId !== hospital.hospitalId);
          return [hospital, ...filtered];
        } else {
          // 없으면 맨 앞에 추가
          return [hospital, ...prevHospitals];
        }
      });

      // 표시 개수를 늘려서 새로 추가된 병원이 보이도록
      setDisplayCount((prev) => Math.max(prev, 10));

      // DOM 업데이트 후 스크롤 (약간의 지연)
      setTimeout(() => {
        const newCardElement = document.querySelector(`[data-hospital-id="${hospital.hospitalId}"]`);
        if (newCardElement) {
          newCardElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  // 지도에 점 형태 마커 표시 (mapMarkers 사용)
  useEffect(() => {
    if (!kakaoMapRef.current || !window.kakao || mapMarkers.length === 0) return;

    console.log("📍 마커 표시 시작 - mapMarkers 개수:", mapMarkers.length);
    console.log(
      "📍 mapMarkers 샘플:",
      mapMarkers.slice(0, 3).map((h) => ({ name: h.hospitalName, emergency: h.emergencyYn }))
    );

    // 기존 마커 제거
    markersRef.current.forEach(({ customOverlay }) => {
      if (customOverlay) {
        customOverlay.setMap(null);
      }
    });
    markersRef.current = [];

    const dotSize = "10px"; // 고정 크기 (카카오맵처럼)

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

      console.log("📍 줌 레벨:", zoomLevel, "최대 마커 수:", maxMarkers);

      // 개수만 제한 (순서는 API에서 받은 그대로, 정렬 안 함)
      hospitalsToShow = mapMarkers.length > maxMarkers ? mapMarkers.slice(0, maxMarkers) : mapMarkers;
    }

    console.log("📍 실제 표시할 마커 개수:", hospitalsToShow.length);

    // 새 마커 생성 (점 형태 또는 십자가 형태)
    hospitalsToShow.forEach((hospital) => {
      if (!hospital.latitude || !hospital.longitude) return;

      const position = new window.kakao.maps.LatLng(parseFloat(hospital.latitude), parseFloat(hospital.longitude));

      // 응급실 여부에 따라 색상 결정
      const isEmergency = hospital.emergencyYn === "Y";
      const dotColor = isEmergency ? "#ef4444" : "#3b82f6";
      const dotColorHover = isEmergency ? "#dc2626" : "#2563eb";

      // 커스텀 오버레이 컨텐츠 생성
      const dotContent = document.createElement("div");
      dotContent.className = "hospital-dot";
      dotContent.style.cursor = "pointer";
      dotContent.style.transition = "all 0.2s";

      if (isEmergency) {
        // 응급실: 빨간 동그라미 + 흰색 십자가 (14px)
        dotContent.style.width = "14px";
        dotContent.style.height = "14px";
        dotContent.style.position = "relative";
        dotContent.style.backgroundColor = dotColor;
        dotContent.style.borderRadius = "50%";
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

        // 호버 효과 - 색깔만 진하게
        dotContent.addEventListener("mouseenter", () => {
          dotContent.style.backgroundColor = dotColorHover;
        });

        dotContent.addEventListener("mouseleave", () => {
          dotContent.style.backgroundColor = dotColor;
        });
      } else {
        // 일반: 파란 동그라미 (10px)
        dotContent.style.width = dotSize;
        dotContent.style.height = dotSize;
        dotContent.style.backgroundColor = dotColor;
        dotContent.style.borderRadius = "50%";

        // 호버 효과 - 색깔만 진하게
        dotContent.addEventListener("mouseenter", () => {
          dotContent.style.backgroundColor = dotColorHover;
        });

        dotContent.addEventListener("mouseleave", () => {
          dotContent.style.backgroundColor = dotColor;
        });
      }

      // 클릭 이벤트
      dotContent.addEventListener("click", async (e) => {
        e.stopPropagation(); // 지도 클릭 이벤트로 전파 방지
        setSelectedHospital(hospital);

        // InfoWindow 표시 (꼬리가 마커를 가리킴)
        await showInfoWindow(hospital, parseFloat(hospital.latitude), parseFloat(hospital.longitude));

        // 병원이 현재 hospitals 리스트에 있는지 확인
        const hospitalIndex = hospitals.findIndex((h) => h.hospitalId === hospital.hospitalId);

        if (hospitalIndex !== -1) {
          // 병원이 리스트에 있으면 해당 페이지로 이동
          const targetPage = Math.floor(hospitalIndex / ITEMS_PER_PAGE) + 1;

          if (currentPage !== targetPage) {
            setCurrentPage(targetPage);
            // 페이지 변경 후 스크롤 (약간의 지연)
            setTimeout(() => {
              scrollToHospitalCard(hospital);
            }, 100);
          } else {
            // 같은 페이지면 바로 스크롤
            scrollToHospitalCard(hospital);
          }
        } else {
          // 리스트에 없으면 해당 위치로 지도 이동하고 주변 병원 검색
          const position = new window.kakao.maps.LatLng(parseFloat(hospital.latitude), parseFloat(hospital.longitude));
          kakaoMapRef.current.setCenter(position);

          // 검색 모드 해제하고 해당 위치 기준으로 병원 목록 다시 로드
          setIsSearchMode(false);
          setSearchKeyword("");
          setCurrentPage(1);

          // 병원 목록 다시 로드
          setTimeout(() => {
            loadHospitalsAndMarkers();
          }, 100);
        }
      });

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: dotContent,
        zIndex: 1,
      });

      customOverlay.setMap(kakaoMapRef.current);

      markersRef.current.push({
        hospital,
        customOverlay,
        position,
      });
    });
  }, [mapMarkers, isSearchMode]);

  // 알파벳 마커 별도 관리 (항상 표시)
  useEffect(() => {
    if (!kakaoMapRef.current || !window.kakao || hospitals.length === 0) return;

    // 기존 알파벳 마커 제거
    alphabetMarkersRef.current.forEach(({ customOverlay }) => {
      if (customOverlay) {
        customOverlay.setMap(null);
      }
    });
    alphabetMarkersRef.current = [];

    // 현재 페이지에 표시된 병원 목록
    const currentPageHospitals = hospitals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // 알파벳 마커 생성
    currentPageHospitals.forEach((hospital, index) => {
      if (!hospital.latitude || !hospital.longitude) return;

      const position = new window.kakao.maps.LatLng(parseFloat(hospital.latitude), parseFloat(hospital.longitude));

      const alphabet = String.fromCharCode(65 + index); // A, B, C, ...
      const isSelected = selectedHospital?.hospitalId === hospital.hospitalId;

      // 선택 여부에 따라 색상 결정 (반전)
      const pathFill = isSelected ? "#3fc1ec" : "white"; // 선택: 파란색 배경, 기본: 흰색 배경
      const strokeColor = "#3fc1ec"; // 테두리는 항상 파란색
      const textFill = isSelected ? "white" : "#3fc1ec"; // 선택: 흰색 글자, 기본: 파란색 글자

      // 커스텀 오버레이 컨텐츠 생성
      const dotContent = document.createElement("div");
      dotContent.className = "hospital-alphabet-marker";
      dotContent.style.cursor = "pointer";
      dotContent.style.transition = "all 0.2s";
      dotContent.style.width = "30px";
      dotContent.style.height = "42px";
      dotContent.style.position = "relative";
      dotContent.innerHTML = `
        <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M15 0C8.5 0 3 5.5 3 12c0 1.5 0.5 3 1 4.5C6 22 15 42 15 42s9-20 11-25.5c0.5-1.5 1-3 1-4.5C27 5.5 21.5 0 15 0z" fill="${pathFill}" stroke="${strokeColor}" stroke-width="1.5"/>
          <text x="15" y="16.5" text-anchor="middle" font-size="12" font-weight="700" font-family="Malgun Gothic, Arial, sans-serif" fill="${textFill}">${alphabet}</text>
        </svg>
      `;

      // 호버 효과
      dotContent.addEventListener("mouseenter", () => {
        if (!isSelected) {
          // 선택된 마커가 아닐 때만 호버 효과 (색상 반전)
          dotContent.style.transform = "scale(1.1)";
          dotContent.querySelector("path").setAttribute("fill", "#3fc1ec");
          dotContent.querySelector("text").setAttribute("fill", "white");
        }
      });

      dotContent.addEventListener("mouseleave", () => {
        if (!isSelected) {
          // 선택된 마커가 아닐 때만 원래대로
          dotContent.style.transform = "scale(1)";
          dotContent.querySelector("path").setAttribute("fill", "white");
          dotContent.querySelector("text").setAttribute("fill", "#3fc1ec");
        }
      });

      // 선택된 마커는 크기 강조
      if (isSelected) {
        dotContent.style.transform = "scale(1.2)";
      }

      // 클릭 이벤트
      dotContent.addEventListener("click", async (e) => {
        e.stopPropagation();
        setSelectedHospital(hospital);
        kakaoMapRef.current.setCenter(position);
        await showInfoWindow(hospital, parseFloat(hospital.latitude), parseFloat(hospital.longitude));
        scrollToHospitalCard(hospital);
      });

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: dotContent,
        zIndex: isSelected ? 200 : 100, // 선택된 마커는 더 위에 표시
      });

      customOverlay.setMap(kakaoMapRef.current);

      alphabetMarkersRef.current.push({
        hospital,
        customOverlay,
        position,
        dotContent, // DOM 요소도 저장해서 나중에 업데이트 가능하도록
      });
    });
  }, [currentPage, hospitals, selectedHospital]); // selectedHospital 의존성 추가

  return (
    <div className="hospital-map-page">
      <Header />

      <div className="hospital-map-main">
        <div className="map-content-wrapper">
          {/* 병원 리스트 사이드바 */}
          <div className="hospital-list-sidebar">
            {/* 검색창 (사이드바 최상단) */}
            <HospitalSearchBar
              searchKeyword={searchKeyword}
              onSearchChange={handleSearchInputChange}
              onSearch={handleSearch}
              onClearSearch={() => {
                setSearchKeyword("");
                setShowAutocomplete(false);
                setAutocompleteSuggestions([]);
                setIsSearchMode(false);
                loadHospitalsAndMarkers();
              }}
              selectedDepartments={selectedDepartments}
              isDepartmentDropdownOpen={isDepartmentDropdownOpen}
              onToggleDepartmentDropdown={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
              departmentList={departmentList}
              onToggleDepartment={toggleDepartment}
              onSelectAllDepartments={selectAllDepartments}
              onApplyDepartmentFilter={applyDepartmentFilter}
              showAutocomplete={showAutocomplete}
              autocompleteSuggestions={autocompleteSuggestions}
              onSuggestionClick={handleSuggestionClick}
              searchInputRef={searchInputRef}
              autocompleteRef={autocompleteRef}
              departmentDropdownRef={departmentDropdownRef}
            />

            <div className="sidebar-header">
              <h3>검색 결과</h3>
              <span className="result-count">
                총 <strong>{hospitals.length}</strong>개
              </span>
            </div>

            {/* 현재 지역 재검색 버튼 */}
            <div className="refresh-area-container">
              <button
                className="refresh-area-btn"
                onClick={() => {
                  if (searchKeyword.trim()) {
                    handleSearch();
                  } else {
                    loadHospitalsAndMarkers();
                  }
                }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                {searchKeyword.trim() ? `현재 지역에서 '${searchKeyword}' 재검색` : "현재 지역 재검색"}
              </button>
            </div>

            <HospitalSidebar
              hospitals={hospitals}
              loading={loading}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              selectedHospital={selectedHospital}
              onCardClick={(hospital) => {
                setSelectedHospital(hospital);
                if (hospital.latitude && hospital.longitude) {
                  const position = new window.kakao.maps.LatLng(
                    parseFloat(hospital.latitude),
                    parseFloat(hospital.longitude)
                  );
                  const bounds = kakaoMapRef.current.getBounds();
                  const isInBounds = bounds.contain(position);
                  if (!isInBounds) {
                    kakaoMapRef.current.setCenter(position);
                  }
                }
              }}
              onDetailClick={handleDetailButtonClick}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              onPageClick={handlePageClick}
              getPageNumbers={getPageNumbers}
              sidebarRef={sidebarRef}
            />
          </div>

          {/* 지도 영역 */}
          <div className="map-section">
            <div ref={mapRef} className="kakao-map"></div>

            <HospitalFilterButtons
              filterType={filterType}
              onFilterChange={handleFilterChange}
              userAddress={userAddress}
              onMoveToMyAddress={moveToMyAddress}
              onMoveToCurrentLocation={moveToCurrentLocation}
            />
          </div>
        </div>

        <HospitalDetailModal
          isOpen={isDetailModalOpen}
          selectedHospital={selectedHospital}
          modalDepartments={modalDepartments}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default HospitalMap;
