// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// 회원가입
export const signup = async (memberData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error("회원가입 요청 실패");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("회원가입 에러:", error);
    throw error;
  }
};

// 소셜 로그인
export const socialLogin = async (type, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/login?type=${type}&code=${code}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("소셜 로그인 에러:", error);
    throw error;
  }
};

// 일반 로그인
export const normalLogin = async (memberId, password) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member/normal-login?memberId=${encodeURIComponent(memberId)}&password=${encodeURIComponent(
        password
      )}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("로그인 요청 실패");
    }

    const data = await response.json();
    return data; // { success: 1 } or { success: 0 }
  } catch (error) {
    console.error("일반 로그인 에러:", error);
    throw error;
  }
};

// 아이디 중복확인
export const checkIdAvailability = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/check-id?id=${encodeURIComponent(id)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("아이디 중복확인 실패");
    }

    const available = await response.json();
    return available; // true: 사용가능, false: 사용불가
  } catch (error) {
    console.error("아이디 중복확인 에러:", error);
    throw error;
  }
};

// 아이디 찾기
export const findId = async (name, email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member/find-id?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("아이디 찾기 실패");
    }

    const userId = await response.text();
    return userId; // 찾은 아이디 (없으면 빈 문자열)
  } catch (error) {
    console.error("아이디 찾기 에러:", error);
    throw error;
  }
};

// 아이디와 이메일 확인 (비밀번호 찾기)
export const verifyIdAndEmail = async (memberId, email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member/verify-id-email?memberId=${encodeURIComponent(memberId)}&email=${encodeURIComponent(
        email
      )}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("아이디와 이메일 확인 실패");
    }

    const data = await response.json();
    return data; // { verified: true/false }
  } catch (error) {
    console.error("아이디와 이메일 확인 에러:", error);
    throw error;
  }
};

// 비밀번호 재설정
export const resetPassword = async (memberId, password) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member/reset-password?memberId=${encodeURIComponent(memberId)}&password=${encodeURIComponent(
        password
      )}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("비밀번호 재설정 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("비밀번호 재설정 에러:", error);
    throw error;
  }
};

// 세션 확인
export const checkSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/check-session`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("세션 확인 실패");
    }

    const data = await response.json();
    return data; // { loggedIn: true/false }
  } catch (error) {
    console.error("세션 확인 에러:", error);
    throw error;
  }
};

// 프로필 조회
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/profile`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("프로필 조회 실패");
    }

    const data = await response.json();
    return data; // ProfileResponse (userName, email, phone, address, etc.)
  } catch (error) {
    console.error("프로필 조회 에러:", error);
    throw error;
  }
};

// 이메일 인증번호 발송
export const sendEmailCode = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/member/send-email-code?email=${encodeURIComponent(email)}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("인증번호 발송 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("인증번호 발송 에러:", error);
    throw error;
  }
};

// 이메일 인증번호 확인
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/member/verify-email-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("인증번호 확인 실패");
    }

    const data = await response.json();
    return data; // { verified: true/false }
  } catch (error) {
    console.error("인증번호 확인 에러:", error);
    throw error;
  }
};
