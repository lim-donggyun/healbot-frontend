const API_BASE_URL = "/react/api";

// 모든 병원 조회
export const getAllHospitals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('병원 목록 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('getAllHospitals 에러:', error);
    throw error;
  }
};

// 병원 추가
export const createHospital = async (hospitalData) => {
  try {
    const headers = {};
    let body;

    if (hospitalData instanceof FormData) {
      // When sending FormData with files, browser automatically sets Content-Type to multipart/form-data
      body = hospitalData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(hospitalData);
    }

    const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error('병원 추가 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('createHospital 에러:', error);
    throw error;
  }
};

// 병원 수정
export const updateHospital = async (hospitalId, hospitalData) => {
  try {
    const headers = {};
    let body;

    if (hospitalData instanceof FormData) {
      // When sending FormData with files, browser automatically sets Content-Type to multipart/form-data
      body = hospitalData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(hospitalData);
    }

    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}`, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error('병원 수정 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('updateHospital 에러:', error);
    throw error;
  }
};

// 병원 삭제
export const deleteHospital = async (hospitalId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('병원 삭제 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('deleteHospital 에러:', error);
    throw error;
  }
};

// 병원 진료과 목록 조회
export const getHospitalDepartments = async (hospitalId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('진료과 목록 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('getHospitalDepartments 에러:', error);
    throw error;
  }
};

// 병원 검색 (진료과, 위치 기반)
export const searchHospitals = async (searchRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error('병원 검색 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('searchHospitals 에러:', error);
    throw error;
  }
};

// 응급실 있는 병원 조회
export const getEmergencyHospitals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hospital/emergency`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('응급실 병원 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('getEmergencyHospitals 에러:', error);
    throw error;
  }
};

// 지도 영역 기반 병원 조회
export const getHospitalsByBounds = async (swLat, swLng, neLat, neLng, emergencyOnly = false) => {
  try {
    const params = new URLSearchParams({
      swLat: swLat.toString(),
      swLng: swLng.toString(),
      neLat: neLat.toString(),
      neLng: neLng.toString(),
    });

    if (emergencyOnly) {
      params.append('emergencyOnly', 'true');
    }

    const response = await fetch(`${API_BASE_URL}/hospital/bounds?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('지도 영역 병원 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('getHospitalsByBounds 에러:', error);
    throw error;
  }
};
