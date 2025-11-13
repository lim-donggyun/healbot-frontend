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
