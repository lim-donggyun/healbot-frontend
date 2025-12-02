// src/components/review/Review.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Review.css";
import ReviewWriteModal from "../components/sections/Review/ReviewWriteModal";
import OCR from "./OCR";
import { checkSession } from "../utils/memberApi";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const PAGE_SIZE = 5; // 한 페이지에 보여줄 개수

const Review = () => {
const navigate = useNavigate();

// ✅ 전체 리뷰용
const [globalReviews, setGlobalReviews] = useState([]);

// ✅ 특정 병원 리뷰용
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

// ✅ 병원명 검색용 상태
const [hospitalKeyword, setHospitalKeyword] = useState("");
const [hospitalSearchResults, setHospitalSearchResults] = useState([]);
const [hospitalSearchError, setHospitalSearchError] = useState("");
const [hospitalSearching, setHospitalSearching] = useState(false);

// ✅ 페이징 상태
const [page, setPage] = useState(1);

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

// ✅ 전체 리뷰 로딩
const loadGlobalReviews = async () => {
    try {
    setLoading(true);
    setError("");

    const res = await fetch(
        `/api/reviews/all?sort=${sort}&rating=${ratingFilter}`
    );
    if (!res.ok) throw new Error("리뷰 조회 실패");

    const data = await res.json();
    setGlobalReviews(data.reviewList || []);
    } catch (e) {
    setError(e.message || "오류가 발생했습니다.");
    } finally {
    setLoading(false);
    }
};

// ✅ 특정 병원 리뷰 로딩
const loadHospitalReviews = async (hospitalId) => {
    if (!hospitalId) return;

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

// 🔍 병원명 검색
const handleHospitalSearch = async () => {
    const keyword = hospitalKeyword.trim();
    setHospitalSearchError("");
    setHospitalSearchResults([]);

    if (!keyword) {
    // 검색어 비우면 전체 리뷰로 초기화
    setSelectedHospital(null);
    setPage(1);
    await loadGlobalReviews();
    return;
    }

    try {
    setHospitalSearching(true);
    const res = await fetch(
        `/api/reviews/search?keyword=${encodeURIComponent(keyword)}`
    );
    if (!res.ok) throw new Error("병원 검색에 실패했습니다.");

    const data = await res.json();
    // data가 [{id, name, address}, ...] 형태라고 가정
    if (!data || data.length === 0) {
        setHospitalSearchError("검색 결과가 없습니다.");
        setHospitalSearchResults([]);
        return;
    }
    setHospitalSearchResults(data);
    } catch (e) {
    setHospitalSearchError(e.message || "병원 검색 중 오류가 발생했습니다.");
    } finally {
    setHospitalSearching(false);
    }
};

// 🔁 검색 결과에서 병원 선택
const handleSelectHospitalFromSearch = (hospital) => {
    setSelectedHospital({ id: hospital.id, name: hospital.name });
    setHospitalKeyword(hospital.name);
    setHospitalSearchResults([]);
    setHospitalSearchError("");
    setPage(1); // 새로운 병원 선택 시 1페이지
    loadHospitalReviews(hospital.id);
};

// 🔄 전체 병원 리뷰로 되돌리기
const handleResetHospital = () => {
    setSelectedHospital(null);
    setHospitalKeyword("");
    setHospitalSearchResults([]);
    setHospitalSearchError("");
    setPage(1); // 초기화 시 1페이지
    loadGlobalReviews();
};

// 🔁 정렬/필터 바뀔 때:
// - 병원 선택 전이면 전체 리뷰
// - 병원 선택 후면 해당 병원 리뷰
useEffect(() => {
    setPage(1); // 정렬/필터 바뀔 때 페이지 초기화
    if (selectedHospital?.id) {
    loadHospitalReviews(selectedHospital.id);
    } else {
    loadGlobalReviews();
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

    if (!selectedHospital) {
    // 아직 어떤 병원 리뷰를 쓸지 모르는 상태 → OCR 먼저
    setShowOCR(true);
    return;
    }

    setShowWriteModal(true);
};

// ✅ OCR 인증 성공 시, 병원 정보 세팅
const handleOcrVerified = (info) => {
    // info: { hospitalId, hospitalName, text, image }
    setSelectedHospital({
    id: info.hospitalId,
    name: info.hospitalName,
    });
    setShowOCR(false);
    setShowWriteModal(true);
    setPage(1);
    loadHospitalReviews(info.hospitalId);
};

const handleWriteSuccess = () => {
    setShowWriteModal(false);
    if (selectedHospital?.id) {
    loadHospitalReviews(selectedHospital.id);
    }
};

// ✅ 페이징용 계산 (현재 리스트 / 페이지)
const activeList = selectedHospital ? reviews : globalReviews;
const totalPages =
    activeList.length === 0 ? 1 : Math.ceil(activeList.length / PAGE_SIZE);
const currentPage = Math.min(page, totalPages);
const startIndex = (currentPage - 1) * PAGE_SIZE;
const endIndex = startIndex + PAGE_SIZE;
const visibleList = activeList.slice(startIndex, endIndex);

const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
};

const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
};

return (
    <>
    <Header />
    <div className="rv-page">
    <div className="rv-container">
        {/* 상단 요약 */}
        <div className="rv-header-row">
        <div className="rv-hinfo">
            <h2 className="rv-hname">
            {selectedHospital
                ? `${selectedHospital.name} 리뷰`
                : "전체 병원 리뷰"}
            </h2>

            {/* 특정 병원 선택된 경우에만 메타 정보 표시 */}
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

        {/* 🔍 병원명 검색 영역 */}
        <div className="rv-search-row">
        <div className="rv-search-main">
            <input
            type="text"
            className="rv-search-input"
            placeholder="병원명을 입력하세요"
            value={hospitalKeyword}
            onChange={(e) => setHospitalKeyword(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleHospitalSearch();
                }
            }}
            />
            <button
            type="button"
            className="rv-search-btn"
            onClick={handleHospitalSearch}
            disabled={hospitalSearching}
            >
            {hospitalSearching ? "검색 중..." : "검색"}
            </button>
        </div>

        {selectedHospital && (
            <button
            type="button"
            className="rv-reset-btn"
            onClick={handleResetHospital}
            >
            전체 리뷰 보기
            </button>
        )}
        </div>

        {/* 검색 결과 / 에러 */}
        {hospitalSearchError && (
            <div className="rv-search-msg rv-search-error">
            {hospitalSearchError}
        </div>
        )}
        {hospitalSearchResults.length > 0 && (
            <div className="rv-search-result-list">
            {hospitalSearchResults.map((h) => (
                <button
                key={h.id}
                type="button"
                className="rv-search-result-item"
                onClick={() => handleSelectHospitalFromSearch(h)}
                >
                <span className="rv-search-hname">{h.name}</span>
                {h.address && (
                    <span className="rv-search-haddr">{h.address}</span>
                )}
            </button>
            ))}
        </div>
        )}

        {/* 안내 문구 */}
        {!selectedHospital && (
            <div className="rv-info">
            현재 전체 병원 리뷰를 보고 있습니다. <br />
            상단에서 병원명을 검색하거나, 영수증 OCR 인증으로 특정 병원
            리뷰만 모아볼 수 있어요.
        </div>
        )}

        {/* 필터/정렬 – 둘 다 공통으로 사용 */}
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
        {loading && <div className="rv-state">불러오는 중...</div>}
        {error && !loading && (
            <div className="rv-state rv-error">{error}</div>
        )}

        {/* 공통: 현재 리스트 기준으로 빈 상태 표시 */}
        {!loading && !error && activeList.length === 0 && (
            <div className="rv-state">등록된 리뷰가 없습니다.</div>
        )}

        {/* 페이징된 리스트 렌더링 */}
        {!loading &&
            !error &&
            activeList.length > 0 &&
            visibleList.map((r) => (
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
                {/* 전체 리스트에서는 병원 이름도 보여주기 */}
                {!selectedHospital && (
                    <div className="rv-card-hname">{r.hospitalName}</div>
                )}
                <p className="rv-card-content">{r.content}</p>
                <div className="rv-card-bottom">
                <span className="rv-card-date">{r.createdAt}</span>
                </div>
            </div>
            ))}
        </div>

        {/* ✅ 페이징 UI */}
        {!loading && !error && activeList.length > PAGE_SIZE && (
            <div className="rv-pagination">
            <button
            type="button"
            className="rv-page-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            >
            이전
            </button>
            <span className="rv-page-info">
            {currentPage} / {totalPages}
            </span>
            <button
            type="button"
            className="rv-page-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            >
            다음
            </button>
        </div>
        )}
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
    <Footer />
    </>
);
};

export default Review;
