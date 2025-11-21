// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// 일별 로그인 횟수 조회 (최근 7일)
export const getDailyLoginCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/daily-login`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 응답 에러:", response.status, errorText);
      throw new Error(`일별 로그인 횟수 조회 실패 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("일별 로그인 횟수 데이터 로드 성공:", data);
    return data;
  } catch (error) {
    console.error("일별 로그인 횟수 조회 에러:", error);
    throw error;
  }
};
