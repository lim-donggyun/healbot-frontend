// src/pages/MyPage.jsx
import React, { useState, useEffect } from "react";
import "./Mypage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 내가 작성한 글 개수
  const [postCount, setPostCount] = useState(0);
  // 🔹 제재 내역 개수
  const [sanctionCount, setSanctionCount] = useState(0);

  const navigate = useNavigate();

  // 🔹 프로필 조회 + 내가 쓴 글 개수 + 제재 내역 개수 조회 (병렬 처리)
  useEffect(() => {
    const fetchProfileAndCounts = async () => {
      try {
        // 모든 API를 병렬로 호출
        const [profileRes, postCountRes, reviewCountRes, sanctionCountRes] = await Promise.all([
          fetch("/react/api/member/profile", { method: "GET" }),
          fetch("/react/api/community/my-post-count", { method: "GET" }),
          fetch("/api/reviews/my-count", { method: "GET" }),
          fetch("/react/api/community/my-sanction-count", { method: "GET" }),
        ]);

        // 1) 프로필 처리
        if (profileRes.status === 401) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        if (!profileRes.ok) {
          console.error("프로필 조회 실패:", profileRes.status);
          alert("프로필 정보를 불러오지 못했습니다.");
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        // 2) 내가 쓴 글 개수 처리 (커뮤니티 + 리뷰)
        let totalCount = 0;

        if (postCountRes.ok) {
          try {
            const data = await postCountRes.json();
            const count = typeof data.count === "number" ? data.count : 0;
            totalCount += count;
          } catch (e) {
            console.error("커뮤니티 글 개수 파싱 오류:", e);
          }
        } else {
          console.error("커뮤니티 글 개수 조회 실패:", postCountRes.status);
        }

        if (reviewCountRes.ok) {
          try {
            const data = await reviewCountRes.json();
            const count = typeof data.count === "number" ? data.count : 0;
            totalCount += count;
          } catch (e) {
            console.error("리뷰 개수 파싱 오류:", e);
          }
        } else {
          console.error("리뷰 개수 조회 실패:", reviewCountRes.status);
        }

        setPostCount(totalCount);

        // 3) 제재 내역 개수 처리
        if (sanctionCountRes.ok) {
          try {
            const data = await sanctionCountRes.json();
            const count = typeof data.count === "number" ? data.count : 0;
            setSanctionCount(count);
          } catch (e) {
            console.error("제재 내역 개수 파싱 오류:", e);
          }
        } else {
          console.error("제재 내역 개수 조회 실패:", sanctionCountRes.status);
        }
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        alert("정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndCounts();
  }, [navigate]);

  // 프로필 정보 페이지로 이동
  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate("/mypage/profile");
  };

  // 내가 쓴 글 페이지로 이동
  const handleReviewClick = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate("/mypage/reviews");
  };

  // 제재 내역 페이지로 이동 (추후 라우팅에 맞게 경로만 변경)
  const handleSanctionClick = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate("/mypage/sanctions");
  };

  // 회원 탈퇴 모달 열기
  const handleDeleteClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달에서 "탈퇴하기" → 탈퇴 페이지로 이동
  const confirmDelete = () => {
    setIsModalOpen(false);
    navigate("/mypage/delete");
  };

  // 모달 바깥 클릭 시 닫기
  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 🔹 표시용 값들 (null 안전 처리)
  const userName = profile?.userName || "회원";
  const userInitial = userName.charAt(0);
  const email = profile?.email || "-";
  const phone = profile?.phone || "-";

  const rawJoinDate = profile?.joinDate || profile?.createdAt || profile?.createDate || null;
  const joinDate =
    rawJoinDate && typeof rawJoinDate === "string" ? rawJoinDate.slice(0, 10).replace(/-/g, ".") : "가입일 정보 없음";

  return (
    <div className="review-page-wrapper">
      <Header />

      <main className="mypage-main">
        <div className="mypage-container">
          {/* 상단 타이틀 영역 */}
          <div className="mypage-top-row">
            <div>
              <h1 className="mypage-title">마이페이지</h1>
              <p className="mypage-subtitle">계정 정보와 활동을 관리하세요</p>
            </div>
            <div className="mypage-user-info"></div>
          </div>

          {/* 로딩 중일 때 간단 표시 */}
          {loading && (
            <section className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">...</div>
                <div className="profile-info">
                  <h2>정보 불러오는 중...</h2>
                  <p>잠시만 기다려 주세요.</p>
                </div>
              </div>
            </section>
          )}

          {/* 프로필 카드 */}
          {!loading && (
            <section className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">{userInitial}</div>
                <div className="profile-info">
                  <h2>{userName}</h2>
                  <p>회원님 환영합니다!</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <svg fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="info-content">
                    <div className="info-label">이메일</div>
                    <div className="info-value">{email}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg fill="none" stroke="#16a34a" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="info-content">
                    <div className="info-label">연락처</div>
                    <div className="info-value">{phone}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg fill="none" stroke="#7c3aed" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="info-content">
                    <div className="info-label">가입일</div>
                    <div className="info-value">{joinDate}</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 메뉴 섹션 */}
          <section className="menu-section">
            {/* 프로필 정보 */}
            <button className="menu-item" onClick={handleProfileClick}>
              <div className="menu-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">프로필 정보</div>
                <div className="menu-description">내 정보 수정 및 관리</div>
              </div>
              <div className="menu-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* 내가 작성한 글 */}
            <button className="menu-item" onClick={handleReviewClick}>
              <div className="menu-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">내가 작성한 글</div>
                <div className="menu-description">작성 {postCount}개</div>
              </div>
              <div className="menu-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* 🔥 제재 내역 */}
            <button className="menu-item" onClick={handleSanctionClick}>
              <div className="menu-icon orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M4.293 6.293l7-3.5a1 1 0 01.894 0l7 3.5A1 1 0 0120 7.236V13a8 8 0 11-16 0V7.236a1 1 0 01.293-.943z"
                  />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">제재 내역</div>
                <div className="menu-description">
                  {sanctionCount > 0 ? `총 ${sanctionCount}건` : "현재 제재 내역이 없습니다"}
                </div>
              </div>
              <div className="menu-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* 회원 탈퇴 */}
            <button className="menu-item" onClick={handleDeleteClick}>
              <div className="menu-icon red">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="menu-content">
                <div className="menu-title">회원 탈퇴</div>
                <div className="menu-description">계정 삭제 및 탈퇴</div>
              </div>
              <div className="menu-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </section>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className="modal active" onClick={handleModalBackgroundClick}>
            <div className="modal-content">
              <div className="modal-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3>회원 탈퇴</h3>
              <p>
                정말로 탈퇴하시겠습니까?
                <br />
                탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
              </p>
              <div className="modal-buttons">
                <button className="btn btn-secondary" onClick={closeModal}>
                  취소
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;
