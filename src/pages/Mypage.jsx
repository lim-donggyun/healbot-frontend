// src/pages/MyPage.jsx
import React, { useState } from "react";
import "./MyPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
const [isModalOpen, setIsModalOpen] = useState(false);
const navigate = useNavigate();

// 프로필 정보 페이지로 이동
const handleProfileClick = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate("/mypage/profile");
};

// 내가 쓴 리뷰 페이지로 이동
const handleReviewClick = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    navigate("/mypage/reviews");
};

// 회원 탈퇴 모달 열기
const handleDeleteClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
};

// 모달에서 "탈퇴하기" 눌렀을 때 → 탈퇴 페이지로 라우팅
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

return (
    <>
    <Header />

    <main className="mypage-main">
        <div className="mypage-container">
        {/* 상단 타이틀 영역 */}
        <div className="mypage-top-row">
            <div>
            <h1 className="mypage-title">마이페이지</h1>
            <p className="mypage-subtitle">계정 정보와 활동을 관리하세요</p>
            </div>
            <div className="mypage-user-info">
            <div className="user-avatar">장</div>
            <span className="user-name">장원영님</span>
            </div>
        </div>

        {/* 프로필 카드 */}
        <section className="profile-card">
            <div className="profile-header">
            <div className="profile-avatar">장</div>
            <div className="profile-info">
                <h2>장원영</h2>
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
                <div className="info-value">example@email.com</div>
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
                <div className="info-value">010-1234-5678</div>
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
                <div className="info-value">2024.01.15</div>
                </div>
            </div>
            </div>
        </section>

        {/* 메뉴 섹션 */}
        <section className="menu-section">
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
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </div>
            </button>

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
                <div className="menu-title">내가 쓴 리뷰</div>
                <div className="menu-description">작성한 리뷰 12개</div>
            </div>
            <div className="menu-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </div>
            </button>

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
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                />
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
    </>
);
};

export default MyPage;
