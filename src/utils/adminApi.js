// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// 전체 회원 목록 조회
export const getAllMembers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/members`, {
      method: "GET",
      credentials: "include", // 세션 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 응답 에러:", response.status, errorText);
      throw new Error(`회원 목록 조회 실패 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("회원 데이터 로드 성공:", data);
    return data; // 회원 배열
  } catch (error) {
    console.error("회원 목록 조회 에러:", error);
    throw error;
  }
};

// 회원 삭제
export const deleteMember = async (memberId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/members/${encodeURIComponent(memberId)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("회원 삭제 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("회원 삭제 에러:", error);
    throw error;
  }
};
