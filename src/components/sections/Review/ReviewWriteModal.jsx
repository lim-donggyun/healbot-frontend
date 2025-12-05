// src/components/review/ReviewWriteModal.jsx
import React, { useState, useEffect } from "react";
import "./ReviewWriteModal.css";

const ReviewWriteModal = ({ hospitalId, hospitalName, hospitalAddress, onClose, onSuccess }) => {
const [score, setScore] = useState(0);
const [content, setContent] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [hospitalInfo, setHospitalInfo] = useState({ name: hospitalName || "", address: hospitalAddress || "" });

// 병원 정보 가져오기
useEffect(() => {
  if (!hospitalName && hospitalId) {
    // 병원 정보가 없으면 API로 가져오기
    const fetchHospitalInfo = async () => {
      try {
        const res = await fetch(`/api/hospitals/${hospitalId}`);
        if (res.ok) {
          const data = await res.json();
          setHospitalInfo({ name: data.name || "", address: data.address || "" });
        }
      } catch (e) {
        console.error("병원 정보 가져오기 실패:", e);
      }
    };
    fetchHospitalInfo();
  }
}, [hospitalId, hospitalName]);

const handleStarClick = (v) => setScore(v);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!score) {
    setError("별점을 선택해 주세요.");
    return;
    }
    if (!content.trim()) {
    setError("리뷰 내용을 입력해 주세요.");
    return;
    }

    try {
    setLoading(true);
    setError("");

    const reviewData = {
        hospitalId,
        score,
        content
    };

    const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
    });

    if (!res.ok) throw new Error("리뷰 등록 실패");

    if (onSuccess) onSuccess();
    else onClose();
    } catch (e2) {
    setError(e2.message || "오류가 발생했습니다.");
    } finally {
    setLoading(false);
    }
};

const renderStars = () => (
    <div className="rwm-star-row">
    {[1, 2, 3, 4, 5].map((v) => (
        <button
        key={v}
        type="button"
        className={v <= score ? "rwm-star rwm-star-active" : "rwm-star"}
        onClick={() => handleStarClick(v)}
        >
        ★
        </button>
    ))}
    <span className="rwm-star-label">
        {score ? `${score}점` : "별점을 선택해 주세요"}
    </span>
    </div>
);

const handleBackdropClick = () => {
    if (!loading) onClose();
};

const stop = (e) => e.stopPropagation();

return (
    <div className="rwm-backdrop" onClick={handleBackdropClick}>
    <div className="rwm-modal" onClick={stop}>
        <div className="rwm-header">
        <div className="rwm-hospital-info">
            <h3 className="rwm-title">{hospitalInfo.name || "병원 정보 로딩 중..."}</h3>
            {hospitalInfo.address && <p className="rwm-hospital-address">{hospitalInfo.address}</p>}
        </div>
        <button
            type="button"
            className="rwm-close"
            onClick={onClose}
            disabled={loading}
        >
            ×
        </button>
        </div>

        <form className="rwm-form" onSubmit={handleSubmit}>
        {/* 별점 */}
        <div className="rwm-field">
            <label className="rwm-label">별점</label>
            {renderStars()}
        </div>

        {/* 내용 */}
        <div className="rwm-field">
            <label className="rwm-label">리뷰 내용</label>
            <textarea
            className="rwm-textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="진료 과정, 의료진의 태도, 대기시간, 시설 상태 등 느낀 점을 자유롭게 작성해 주세요."
            />
        </div>

        {error && <div className="rwm-error">{error}</div>}

        <div className="rwm-btn-row">
            <button
            type="button"
            className="rwm-btn rwm-btn-secondary"
            onClick={onClose}
            disabled={loading}
            >
            취소
            </button>
            <button
            type="submit"
            className="rwm-btn rwm-btn-primary"
            disabled={loading}
            >
            {loading ? "등록 중..." : "등록하기"}
            </button>
        </div>
        </form>
    </div>
    </div>
);
};

export default ReviewWriteModal;
