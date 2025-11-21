// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// AI 챗봇으로 증상 검색
export const searchSymptomsWithAI = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/search/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        type: "diseases",
      }),
    });

    if (!response.ok) {
      throw new Error("AI 검색 실패");
    }

    const data = await response.json();
    return data; // ["가래", "기침", "천명음", "호흡곤란"]
  } catch (error) {
    console.error("AI 검색 에러:", error);
    throw error;
  }
};

// 선택된 증상으로 질병 검색
export const searchDiseases = async (symptoms) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms: symptoms,
      }),
    });

    if (!response.ok) {
      throw new Error("질병 검색 실패");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("질병 검색 에러:", error);
    throw error;
  }
};

// 인기 질환 20개 가져오기
export const getPopularDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/popular`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("인기 질환 조회 실패");
    }

    const data = await response.json();
    return data; // { success: true, data: [...] }
  } catch (error) {
    console.error("인기 질환 조회 에러:", error);
    throw error;
  }
};

// 증상 상세 정보 조회
export const getSymptomDetails = async (symptomName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptom?symptom=${encodeURIComponent(symptomName)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("증상 정보 조회 실패");
    }

    const data = await response.text();
    return data; // 증상 설명 텍스트
  } catch (error) {
    console.error("증상 정보 조회 에러:", error);
    throw error;
  }
};

// 질병 이름으로 질병 정보 조회
export const getDiseaseByName = async (diseaseName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases?name=${encodeURIComponent(diseaseName)}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("질병 정보 조회 실패");
    }

    const data = await response.json();
    return data; // Map 형태로 반환 (질환명, 진료과, 전체증상목록, 이미지, 설명, 환자수)
  } catch (error) {
    console.error("질병 정보 조회 에러:", error);
    throw error;
  }
};
