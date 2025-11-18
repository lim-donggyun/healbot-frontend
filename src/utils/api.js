// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = '/react/api';

// AI 챗봇으로 증상 검색
export const searchSymptomsWithAI = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/search/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        type: 'diseases',
      }),
    });

    if (!response.ok) {
      throw new Error('AI 검색 실패');
    }

    const data = await response.json();
    return data; // ["가래", "기침", "천명음", "호흡곤란"]
  } catch (error) {
    console.error('AI 검색 에러:', error);
    throw error;
  }
};

// 선택된 증상으로 질병 검색
export const searchDiseases = async (symptoms) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: symptoms,
      }),
    });

    if (!response.ok) {
      throw new Error('질병 검색 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('질병 검색 에러:', error);
    throw error;
  }
};

// 회원가입
export const signup = async (memberData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error('회원가입 요청 실패');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

// 소셜 로그인
export const socialLogin = async (type, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/login?type=${type}&code=${code}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('서버 응답 오류');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('소셜 로그인 에러:', error);
    throw error;
  }
};

// 아이디 중복확인
export const checkIdAvailability = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/check-id?id=${encodeURIComponent(id)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('아이디 중복확인 실패');
    }

    const available = await response.json();
    return available; // true: 사용가능, false: 사용불가
  } catch (error) {
    console.error('아이디 중복확인 에러:', error);
    throw error;
  }
};

// 아이디 찾기
export const findId = async (name, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/find-id?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('아이디 찾기 실패');
    }

    const userId = await response.text();
    return userId; // 찾은 아이디 (없으면 빈 문자열)
  } catch (error) {
    console.error('아이디 찾기 에러:', error);
    throw error;
  }
};

// 일반 로그인
export const normalLogin = async (memberId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/normal-login?memberId=${encodeURIComponent(memberId)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('로그인 요청 실패');
    }

    const data = await response.json();
    return data; // { success: 1 } or { success: 0 }
  } catch (error) {
    console.error('일반 로그인 에러:', error);
    throw error;
  }
};

// 세션 확인
export const checkSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/check-session`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('세션 확인 실패');
    }

    const data = await response.json();
    return data; // { loggedIn: true/false }
  } catch (error) {
    console.error('세션 확인 에러:', error);
    throw error;
  }
};

// 아이디와 이메일 확인 (비밀번호 찾기)
export const verifyIdAndEmail = async (memberId, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/verify-id-email?memberId=${encodeURIComponent(memberId)}&email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('아이디와 이메일 확인 실패');
    }

    const data = await response.json();
    return data; // { verified: true/false }
  } catch (error) {
    console.error('아이디와 이메일 확인 에러:', error);
    throw error;
  }
};

// 비밀번호 재설정
export const resetPassword = async (memberId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/reset-password?memberId=${encodeURIComponent(memberId)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('비밀번호 재설정 실패');
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error('비밀번호 재설정 에러:', error);
    throw error;
  }
};

// 인기 질환 20개 가져오기
export const getPopularDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/popular`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('인기 질환 조회 실패');
    }

    const data = await response.json();
    return data; // { success: true, data: [...] }
  } catch (error) {
    console.error('인기 질환 조회 에러:', error);
    throw error;
  }
};

// 통합 검색
export const searchAll = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/result?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('통합 검색 실패');
    }

    const data = await response.json();
    return data; // { keyword: "...", symptomMatch: true/false, results: { hospitals: [...], diseases: [...], notices: null, communities: null } }
  } catch (error) {
    console.error('통합 검색 에러:', error);
// 전체 회원 목록 조회
export const getAllMembers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/members`, {
      method: 'GET',
      credentials: 'include', // 세션 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 에러:', response.status, errorText);
      throw new Error(`회원 목록 조회 실패 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('회원 데이터 로드 성공:', data);
    return data; // 회원 배열
  } catch (error) {
    console.error('회원 목록 조회 에러:', error);
    throw error;
  }
};

// 증상 상세 정보 조회
export const getSymptomDetails = async (symptomName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom?symptom=${encodeURIComponent(symptomName)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('증상 정보 조회 실패');
    }

    const data = await response.text();
    return data; // 증상 설명 텍스트
  } catch (error) {
    console.error('증상 정보 조회 에러:', error);
// 회원 삭제
export const deleteMember = async (memberId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/members/${encodeURIComponent(memberId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('회원 삭제 실패');
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error('회원 삭제 에러:', error);
    throw error;
  }
};
