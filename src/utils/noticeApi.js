// API 기본 URL (Vite 프록시 사용)
const API_BASE_URL = "/react/api";

// 전체 공지사항 목록 조회
export const getAllNotices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notices`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 응답 에러:", response.status, errorText);
      throw new Error(`공지사항 목록 조회 실패 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("공지사항 데이터 로드 성공:", data);
    return data;
  } catch (error) {
    console.error("공지사항 목록 조회 에러:", error);
    throw error;
  }
};

// 공지사항 생성
export const createNotice = async (noticeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      throw new Error("공지사항 생성 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("공지사항 생성 에러:", error);
    throw error;
  }
};

// 공지사항 수정
export const updateNotice = async (noticeId, noticeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notices/${encodeURIComponent(noticeId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      throw new Error("공지사항 수정 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("공지사항 수정 에러:", error);
    throw error;
  }
};

// 공지사항 삭제
export const deleteNotice = async (noticeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notices/${encodeURIComponent(noticeId)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("공지사항 삭제 실패");
    }

    const data = await response.json();
    return data; // { success: true/false }
  } catch (error) {
    console.error("공지사항 삭제 에러:", error);
    throw error;
  }
};

// 공지사항 조회수 증가
export const incrementNoticeView = async (noticeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notices/${encodeURIComponent(noticeId)}/view`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("조회수 증가 실패:", response.status);
      // 조회수 증가 실패해도 에러를 throw하지 않음 (UX에 영향 없도록)
      return { success: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("조회수 증가 에러:", error);
    // 조회수 증가 실패해도 에러를 throw하지 않음
    return { success: false };
  }
};
