import React, { useState } from "react";
import "./MyReview.css";

const DUMMY_REVIEWS = [
{
    id: 1,
    hospital: "서울삼성내과의원",
    dept: "내과",
    region: "서울 · 강남",
    rating: 4.9,
    title: "대기 시간 거의 없고 설명이 친절했어요",
    content:
    "검사 결과를 하나씩 화면에 보여주면서 설명해 줘서 안심됐습니다. 접수부터 진료까지 흐름이 깔끔했어요.",
    date: "2025-11-10",
    helpful: 12,
    status: "public", // public | hidden
},
{
    id: 2,
    hospital: "푸른정형외과병원",
    dept: "정형외과",
    region: "경기 · 수원",
    rating: 4.5,
    title: "무릎 수술 후 관리가 꼼꼼했습니다",
    content:
    "물리치료와 통증 조절을 꾸준히 해줘서 회복이 빨랐습니다. 다만 주말에는 대기 시간이 조금 길었습니다.",
    date: "2025-11-02",
    helpful: 8,
    status: "public",
},
{
    id: 3,
    hospital: "용인세브란스병원 응급센터",
    dept: "응급실",
    region: "경기 · 용인",
    rating: 4.2,
    title: "새벽에 방문했는데 빠르게 진료받았습니다",
    content:
    "호흡곤란으로 방문했는데 접수 후 바로 활력징후 확인과 진찰이 진행되었습니다. 의료진이 침착하게 설명해 줬어요.",
    date: "2025-10-25",
    helpful: 21,
    status: "public",
},
];

const MyReview = () => {
const [sortType, setSortType] = useState("latest"); // latest | rating | helpful

const sortedReviews = [...DUMMY_REVIEWS].sort((a, b) => {
    if (sortType === "rating") return b.rating - a.rating;
    if (sortType === "helpful") return b.helpful - a.helpful;
    // latest (날짜 문자열 비교)
    return b.date.localeCompare(a.date);
});

return (
    <section className="mr-card">
    <div className="mr-header">
        <div>
        <h2 className="mr-title">내가 쓴 리뷰</h2>
        <p className="mr-sub">
            최근에 작성한 병원 리뷰를 한눈에 확인하고 관리할 수 있습니다.
        </p>
        </div>
        <div className="mr-sort-group">
        <button
            type="button"
            className={`mr-sort-btn ${
            sortType === "latest" ? "active" : ""
            }`}
            onClick={() => setSortType("latest")}
        >
            최신순
        </button>
        <button
            type="button"
            className={`mr-sort-btn ${
            sortType === "rating" ? "active" : ""
            }`}
            onClick={() => setSortType("rating")}
        >
            별점 높은순
        </button>
        <button
            type="button"
            className={`mr-sort-btn ${
            sortType === "helpful" ? "active" : ""
            }`}
            onClick={() => setSortType("helpful")}
        >
            도움돼요 많은순
        </button>
        </div>
    </div>

    {sortedReviews.length === 0 ? (
        <div className="mr-empty">
        <div className="mr-empty-icon">📝</div>
        <p className="mr-empty-text">아직 작성한 리뷰가 없습니다.</p>
        <p className="mr-empty-sub">
            병원 방문 후 후기를 남기면 다른 사용자들에게 큰 도움이 됩니다.
        </p>
        </div>
    ) : (
        <ul className="mr-list">
        {sortedReviews.map((review) => (
            <li key={review.id} className="mr-item">
            <div className="mr-item-top">
                <div>
                <div className="mr-hospital">{review.hospital}</div>
                <div className="mr-tags">
                    <span className="mr-tag">{review.dept}</span>
                    <span className="mr-tag mr-tag-ghost">{review.region}</span>
                </div>
                </div>
                <div className="mr-rating-box">
                <span className="mr-rating-star">★</span>
                <span className="mr-rating-score">
                    {review.rating.toFixed(1)}
                </span>
                </div>
            </div>

            <div className="mr-item-body">
                <h3 className="mr-review-title">{review.title}</h3>
                <p className="mr-review-content">{review.content}</p>
            </div>

            <div className="mr-item-bottom">
                <div className="mr-meta-left">
                <span className="mr-date">{review.date}</span>
                <span className="mr-dot">·</span>
                <span className="mr-help">
                    👍 도움돼요 {review.helpful}
                </span>
                </div>
                <div className="mr-meta-right">
                <span
                    className={`mr-status ${
                    review.status === "public"
                        ? "mr-status-public"
                        : "mr-status-hidden"
                    }`}
                >
                    {review.status === "public" ? "공개중" : "비공개"}
                </span>
                <button
                    type="button"
                    className="mr-small-btn"
                    onClick={() => alert("수정 페이지로 이동 (연결 예정)")}
                >
                    수정
                </button>
                <button
                    type="button"
                    className="mr-small-btn mr-small-btn-outline"
                    onClick={() => alert("삭제 기능은 추후 연동")}
                >
                    삭제
                </button>
                </div>
            </div>
            </li>
        ))}
        </ul>
    )}
    </section>
);
};

export default MyReview;
