// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// 통합 검색
export const searchAll = async (keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/result?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("통합 검색 실패");
    }

    const data = await response.json();
    return data; // { keyword: "...", symptomMatch: true/false, results: { hospitals: [...], diseases: [...], notices: null, communities: null } }
  } catch (error) {
    console.error("통합 검색 에러:", error);
    throw error;
  }
};
