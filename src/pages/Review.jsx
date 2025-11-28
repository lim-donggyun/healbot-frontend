// src/components/review/Review.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Review.css";
import ReviewWriteModal from "../components/sections/Review/ReviewWriteModal";

const Review = () => {
const { hospitalId } = useParams();

const [reviews, setReviews] = useState([]);
const [hospitalName, setHospitalName] = useState("");
const [avgScore, setAvgScore] = useState(0);
const [totalCount, setTotalCount] = useState(0);

const [sort, setSort] = useState("latest"); // latest / high / low
const [ratingFilter, setRatingFilter] = useState("all"); // all / 5~1

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [showWriteModal, setShowWriteModal] = useState(false);

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

const loadReviews = async () => {
    try {
    setLoading(true);
    setError("");

    // 👉 여기만 너 백엔드 규칙에 맞게 바꾸면 됨
    const res = await fetch(
        `/api/reviews?hospitalId=${hospitalId}&sort=${sort}&rating=${ratingFilter}`
    );
    if (!res.ok) throw new Error("리뷰 조회 실패");

    // 예시 응답: { hospitalName, avgScore, totalCount, reviewList: [...] }
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

useEffect(() => {
    if (!hospitalId) return;
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [hospitalId, sort, ratingFilter]);

const handleWriteClick = () => {
    setShowWriteModal(true);
};

const handleWriteSuccess = () => {
    setShowWriteModal(false);
    loadReviews(); // 새로고침
};

return (
    <div className="rv-page">
    <div className="rv-container">
        {/* 상단 요약 */}
        <div className="rv-header-row">
        <div className="rv-hinfo">
            <h2 className="rv-hname">
            {hospitalName || "병원 리뷰"}
            </h2>
            <div className="rv-hmeta">
            <span className="rv-avg-score">
                {avgScore.toFixed(1)} / 5
            </span>
            <span className="rv-avg-stars">{renderStars(avgScore)}</span>
            <span className="rv-total">리뷰 {totalCount}개</span>
            </div>
        </div>
        <button
            type="button"
            className="rv-write-btn"
            onClick={handleWriteClick}
        >
            리뷰 작성
        </button>
        </div>

        {/* 필터/정렬 */}
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

        {/* 리스트 */}
        <div className="rv-list">
        {loading && (
            <div className="rv-state">불러오는 중...</div>
        )}
        {error && !loading && (
            <div className="rv-state rv-error">{error}</div>
        )}
        {!loading && !error && reviews.length === 0 && (
            <div className="rv-state">등록된 리뷰가 없습니다.</div>
        )}

        {!loading &&
            !error &&
            reviews.map((r) => (
            <div key={r.id} className="rv-card">
                <div className="rv-card-top">
                <div className="rv-card-score">
                    {renderStars(r.score)}
                    <span className="rv-card-score-text">
                    {r.score?.toFixed ? r.score.toFixed(1) : r.score}
                    </span>
                </div>
                <span className="rv-card-writer">
                    {r.writerName || "익명"}
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

    {showWriteModal && (
        <ReviewWriteModal
        hospitalId={hospitalId}
        onClose={() => setShowWriteModal(false)}
        onSuccess={handleWriteSuccess}
        />
    )}
    </div>
);
};

export default Review;
