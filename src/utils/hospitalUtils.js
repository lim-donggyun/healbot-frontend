/**
 * 병원 데이터 관련 유틸리티 함수 모음
 */

import { calculateDistance } from "./mapUtils";

/**
 * 병원 목록을 거리순으로 정렬
 * @param {Array} hospitals - 병원 목록
 * @param {number} centerLat - 기준 위도
 * @param {number} centerLng - 기준 경도
 * @returns {Array} 거리순으로 정렬된 병원 목록
 */
export const sortHospitalsByDistance = (hospitals, centerLat, centerLng) => {
  // 각 병원에 거리 계산
  hospitals.forEach((hospital) => {
    if (hospital.latitude && hospital.longitude) {
      hospital.distance = calculateDistance(
        centerLat,
        centerLng,
        parseFloat(hospital.latitude),
        parseFloat(hospital.longitude)
      );
    } else {
      hospital.distance = Infinity; // 좌표 없는 병원은 맨 뒤로
    }
  });

  // 거리순 정렬 (가까운 순)
  return hospitals.sort((a, b) => a.distance - b.distance);
};

/**
 * 같은 좌표의 병원들을 분산 배치
 * 소수점 4자리까지 같은 좌표를 동일 위치로 간주
 * @param {Array} hospitals - 거리순으로 정렬된 병원 목록
 * @returns {Array} 첫 번째 병원들 먼저, 중복 병원들은 뒤로 배치된 목록
 */
export const redistributeHospitalsByLocation = (hospitals) => {
  const uniqueLocations = new Set();
  const firstAtLocation = []; // 같은 좌표 중 첫 번째 병원들
  const duplicateLocations = []; // 같은 좌표의 나머지 병원들

  hospitals.forEach((hospital) => {
    const lat = parseFloat(hospital.latitude).toFixed(4);
    const lng = parseFloat(hospital.longitude).toFixed(4);
    const locationKey = `${lat},${lng}`;

    if (!uniqueLocations.has(locationKey)) {
      // 이 좌표에서 처음 나온 병원
      uniqueLocations.add(locationKey);
      firstAtLocation.push(hospital);
    } else {
      // 이미 나온 좌표의 병원 (중복)
      duplicateLocations.push(hospital);
    }
  });

  // 재배열: 첫 번째 병원들 먼저, 그 다음 중복 병원들
  return [...firstAtLocation, ...duplicateLocations];
};

/**
 * 병원 유형 및 진료과 키워드 목록
 */
export const HOSPITAL_TYPE_KEYWORDS = [
  // 병원 유형
  "한의원",
  "의원",
  "치과의원",
  "한방병원",
  "요양병원",
  "병원",
  "치과병원",
  "종합병원",
  // 진료과 (긴 것부터)
  "마취통증의학과",
  "방사선종양학과",
  "정신건강의학과",
  "심장혈관흉부외과",
  "가정의학과",
  "비뇨의학과",
  "소아청소년과",
  "영상의학과",
  "응급의학과",
  "이비인후과",
  "재활의학과",
  "내과",
  "산부인과",
  "성형외과",
  "신경과",
  "신경외과",
  "안과",
  "외과",
  "치과",
  "정형외과",
  "피부과",
  "핵의학과",
  "한의학과",
];

/**
 * 검색 키워드가 병원 유형/진료과 키워드인지 확인
 * @param {string} keyword - 검색 키워드
 * @returns {boolean} 병원 유형/진료과 키워드 여부
 */
export const isHospitalTypeKeyword = (keyword) => {
  return HOSPITAL_TYPE_KEYWORDS.includes(keyword);
};

/**
 * 검색어에서 위치와 병원 유형 분리
 * @param {string} keyword - 검색 키워드 (예: "종각역 한의원")
 * @returns {Object} {locationPart: string, hospitalTypePart: string|null}
 */
export const parseSearchKeyword = (keyword) => {
  let locationPart = keyword;
  let hospitalTypePart = null;

  for (const type of HOSPITAL_TYPE_KEYWORDS) {
    if (keyword.includes(type)) {
      hospitalTypePart = type;
      locationPart = keyword.replace(type, "").trim();
      break;
    }
  }

  return { locationPart, hospitalTypePart };
};
