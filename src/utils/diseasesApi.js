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

// 전체 질환 정보 가져오기
export const getAllDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/all`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("전체 질환 조회 실패");
    }

    const data = await response.json();
    return data; // { success: true, data: [...] }
  } catch (error) {
    console.error("전체 질환 조회 에러:", error);
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

// 유행하는 질병 목록 조회
export const getFeaturedDiseases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/featured`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("유행 질병 목록 조회 실패");
    }

    const data = await response.json();
    return data; // List<FeaturedDiseases>
  } catch (error) {
    console.error("유행 질병 목록 조회 에러:", error);
    throw error;
  }
};

// 유행하는 질병 추가
export const addFeaturedDisease = async (diseaseName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/featured`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        diseaseName: diseaseName,
      }),
    });

    if (!response.ok) {
      throw new Error("유행 질병 추가 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("유행 질병 추가 에러:", error);
    throw error;
  }
};

// 유행하는 질병 삭제
export const removeFeaturedDisease = async (featuredDiseasesNo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/featured/${featuredDiseasesNo}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("유행 질병 삭제 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("유행 질병 삭제 에러:", error);
    throw error;
  }
};

// 유행하는 질병 순서 변경
export const updateFeaturedDiseasesOrder = async (list) => {
  try {
    const response = await fetch(`${API_BASE_URL}/diseases/featured/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    });

    if (!response.ok) {
      throw new Error("유행 질병 순서 변경 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("유행 질병 순서 변경 에러:", error);
    throw error;
  }
};

// 질환 추가 (관리자)
export const addDisease = async (diseaseName, description, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("diseaseName", diseaseName);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/admin/diseases`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("질환 추가 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("질환 추가 에러:", error);
    throw error;
  }
};

// 질환 수정 (관리자)
export const updateDisease = async (diseaseNo, diseaseName, description, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("diseaseName", diseaseName);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/admin/diseases/${diseaseNo}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("질환 수정 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("질환 수정 에러:", error);
    throw error;
  }
};

// 질환 삭제 (관리자)
export const deleteDisease = async (diseaseNo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/diseases/${diseaseNo}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("질환 삭제 실패");
    }

    const data = await response.json();
    return data; // { success: true, message: "..." }
  } catch (error) {
    console.error("질환 삭제 에러:", error);
    throw error;
  }
};
