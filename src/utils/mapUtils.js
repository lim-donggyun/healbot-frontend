/**
 * 지도 관련 유틸리티 함수 모음
 */

/**
 * 두 지점 간 거리 계산 (Haversine formula)
 * @param {number} lat1 - 첫 번째 지점의 위도
 * @param {number} lon1 - 첫 번째 지점의 경도
 * @param {number} lat2 - 두 번째 지점의 위도
 * @param {number} lon2 - 두 번째 지점의 경도
 * @returns {number} 두 지점 간의 거리 (km 단위)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 주소에서 구/시 추출
 * @param {string} address - 전체 주소
 * @returns {string} 추출된 구/시 이름
 */
export const extractDistrict = (address) => {
  if (!address) return '';

  // 광역시/도 다음에 오는 구/시 추출
  // 예: "서울특별시 강남구" -> "강남구", "경기도 수원시" -> "수원시"
  const districtMatch = address.match(/(특별시|광역시|특별자치시|도|특별자치도)\s+([^\s]+[시군구])/);

  if (districtMatch && districtMatch[2]) {
    return districtMatch[2];
  }

  // 매칭 실패 시 단순하게 두 번째 단어(공백 기준) 추출 시도
  const parts = address.split(' ');
  if (parts.length >= 2 && (parts[1].endsWith('구') || parts[1].endsWith('시') || parts[1].endsWith('군'))) {
    return parts[1];
  }

  return '';
};

/**
 * 서울 중심 좌표 반환
 * @returns {Object} 서울시청 기준 좌표 {lat, lng}
 */
export const getSeoulCenter = () => {
  return {
    lat: 37.5665,
    lng: 126.9780
  };
};
