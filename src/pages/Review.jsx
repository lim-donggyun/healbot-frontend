// src/components/review/Review.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Review.css";
import ReviewWriteModal from "../components/sections/Review/ReviewWriteModal";
import OCR from "./OCR";
import { checkSession } from "../utils/memberApi";

const Review = () => {
const navigate = useNavigate();

const [reviews, setReviews] = useState([]);
const [hospitalName, setHospitalName] = useState("");
const [avgScore, setAvgScore] = useState(0);
const [totalCount, setTotalCount] = useState(0);

const [sort, setSort] = useState("latest");
const [ratingFilter, setRatingFilter] = useState("all");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [showOCR, setShowOCR] = useState(false);
const [showWriteModal, setShowWriteModal] = useState(false);

const [isLoggedIn, setIsLoggedIn] = useState(false);

// ✅ OCR로 찾아낸 병원 정보
const [selectedHospital, setSelectedHospital] = useState(null); // { id, name }

// 로그인 여부 확인
useEffect(() => {
    const verifySession = async () => {
    try {
        const data = await checkSession();
        setIsLoggedIn(data.loggedIn);
    } catch (e) {
        setIsLoggedIn(false);
    }
    };
    verifySession();
}, []);

const renderStars = (score) => {
    const s = Math.round(score || 0);
    const full = Math.min(Math.max(s, 0), 5);
    const empty = 5 - full;
    return (
    <span className="rv-stars">
        {"★".repeat(full)}
        {"☆".repeat(empty)}
    </span>
    );
};

const loadReviews = async (hospitalId) => {
    if (!hospitalId) return; // 병원 정해지기 전엔 호출 X

    try {
    setLoading(true);
    setError("");

    const res = await fetch(
        `/api/reviews?hospitalId=${hospitalId}&sort=${sort}&rating=${ratingFilter}`
    );
    if (!res.ok) throw new Error("리뷰 조회 실패");

    const data = await res.json();
    setHospitalName(data.hospitalName || "");
    setAvgScore(data.avgScore || 0);
    setTotalCount(data.totalCount || 0);
    setReviews(data.reviewList || []);
    } catch (e) {
    setError(e.message || "오류가 발생했습니다.");
    } finally {
    setLoading(false);
    }
};

// 정렬/필터 바뀔 때, 이미 선택된 병원이 있으면 그 병원 리뷰 다시 로딩
useEffect(() => {
    if (selectedHospital?.id) {
    loadReviews(selectedHospital.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedHospital?.id, sort, ratingFilter]);

// 리뷰 작성 버튼
const handleWriteClick = () => {
    if (!isLoggedIn) {
    alert("리뷰 작성은 로그인 후 가능합니다.");
    navigate("/login");
    return;
    }
    // 아직 OCR로 병원 인증 안 했으면 먼저 OCR 모달 띄우기
    if (!selectedHospital) {
    setShowOCR(true);
    return;
    }
    setShowWriteModal(true);
};

// ✅ OCR 인증 성공 시, 여기서 병원 정보 세팅
const handleOcrVerified = (info) => {
    // info: { hospitalId, hospitalName, text, image }
    setSelectedHospital({
    id: info.hospitalId,
    name: info.hospitalName,
    });
    setShowOCR(false);
    setShowWriteModal(true);
    loadReviews(info.hospitalId);
};

const handleWriteSuccess = () => {
    setShowWriteModal(false);
    if (selectedHospital?.id) {
    loadReviews(selectedHospital.id);
    }
};

return (
    <div className="rv-page">
    <div className="rv-container">
        {/* 상단 요약 */}
        <div className="rv-header-row">
        <div className="rv-hinfo">
            <h2 className="rv-hname">
            {selectedHospital
                ? `${selectedHospital.name} 리뷰`
                : "병원 리뷰"}
            </h2>
            {selectedHospital && (
            <div className="rv-hmeta">
                <span className="rv-avg-score">
                {avgScore.toFixed(1)} / 5
                </span>
                <span className="rv-avg-stars">{renderStars(avgScore)}</span>
                <span className="rv-total">리뷰 {totalCount}개</span>
            </div>
            )}
        </div>

        <button
            type="button"
            className="rv-write-btn"
            onClick={handleWriteClick}
        >
            리뷰 작성
        </button>
        </div>

        {!selectedHospital && (
        <div className="rv-info">
            아직 병원을 선택하지 않았습니다.  
            상단의 [리뷰 작성] 버튼을 눌러 영수증 OCR 인증을 진행해 주세요.
        </div>
        )}

        {/* 필터/정렬 – 병원 정해졌을 때만 의미 있음 */}
        {selectedHospital && (
        <div className="rv-filter-row">
            <div className="rv-rating-filter">
            <button
                type="button"
                className={
                ratingFilter === "all" ? "rv-chip active" : "rv-chip"
                }
                onClick={() => setRatingFilter("all")}
            >
                전체
            </button>
            {[5, 4, 3, 2, 1].map((r) => (
                <button
                key={r}
                type="button"
                className={
                    ratingFilter === String(r) ? "rv-chip active" : "rv-chip"
                }
                onClick={() => setRatingFilter(String(r))}
                >
                {r}점
                </button>
            ))}
            </div>

            <select
            className="rv-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            >
            <option value="latest">최신순</option>
            <option value="high">평점 높은순</option>
            <option value="low">평점 낮은순</option>
            </select>
        </div>
        )}

        {/* 리스트 */}
        <div className="rv-list">
        {selectedHospital && loading && (
            <div className="rv-state">불러오는 중...</div>
        )}
        {selectedHospital && error && !loading && (
            <div className="rv-state rv-error">{error}</div>
        )}
        {selectedHospital &&
            !loading &&
            !error &&
            reviews.length === 0 && (
            <div className="rv-state">등록된 리뷰가 없습니다.</div>
            )}

        {selectedHospital &&
            !loading &&
            !error &&
            reviews.map((r) => (
            <div key={r.reviewId || r.id} className="rv-card">
                <div className="rv-card-top">
                <div className="rv-card-score">
                    {renderStars(r.score)}
                    <span className="rv-card-score-text">
                    {r.score?.toFixed ? r.score.toFixed(1) : r.score}
                    </span>
                </div>
                <span className="rv-card-writer">
                    {r.writerName || r.userName || "익명"}
                </span>
                </div>
                <p className="rv-card-content">{r.content}</p>
                <div className="rv-card-bottom">
                <span className="rv-card-date">{r.createdAt}</span>
                </div>
            </div>
            ))}
        </div>
    </div>

    {/* OCR 모달 */}
    {showOCR && (
        <div
        className="ocr-modal-overlay"
        onClick={() => setShowOCR(false)}
        >
        <div
            className="ocr-modal-content"
            onClick={(e) => e.stopPropagation()}
        >
            <button
            className="ocr-modal-close"
            onClick={() => setShowOCR(false)}
            >
            ×
            </button>
            {/* ✅ 이제 hospitalId 안 넘김 */}
            <OCR onVerified={handleOcrVerified} />
        </div>
        </div>
    )}

    {/* 리뷰작성 모달 */}
    {showWriteModal && selectedHospital && (
        <ReviewWriteModal
        hospitalId={selectedHospital.id}
        onClose={() => setShowWriteModal(false)}
        onSuccess={handleWriteSuccess}
        />
    )}
    </div>
);
};

export default Review;
