const API_BASE_URL = "/react/api";

// 모든 리뷰 조회
export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("리뷰 목록 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("getAllReviews 에러:", error);
    throw error;
  }
};

// 리뷰 상세 조회
export const getReviewById = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("리뷰 상세 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("getReviewById 에러:", error);
    throw error;
  }
};

// 리뷰 수정
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("리뷰 수정 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("updateReview 에러:", error);
    throw error;
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("리뷰 삭제 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("deleteReview 에러:", error);
    throw error;
  }
};

// 리뷰 삭제 (관리자용)
export const deleteReviewByAdmin = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/admin/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("리뷰 삭제 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("deleteReviewByAdmin 에러:", error);
    throw error;
  }
};

// 병원별 리뷰 조회
export const getReviewsByHospital = async (hospitalId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/hospital/${hospitalId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("병원별 리뷰 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("getReviewsByHospital 에러:", error);
    throw error;
  }
};

// 검색 조건으로 리뷰 조회
export const searchReviews = async (searchParams = {}) => {
  try {
    const params = new URLSearchParams();

    if (searchParams.hospitalId) {
      params.append("hospitalId", searchParams.hospitalId);
    }
    if (searchParams.score) {
      params.append("score", searchParams.score);
    }
    if (searchParams.memberId) {
      params.append("memberId", searchParams.memberId);
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/reviews/search?${queryString}` : `${API_BASE_URL}/reviews/reviews/all`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("리뷰 검색 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("searchReviews 에러:", error);
    throw error;
  }
};
