// src/pages/Community.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./Community.css";

const CATEGORY_TABS = [
{ key: "all", label: "전체" },
{ key: "free", label: "자유게시판" },
{ key: "question", label: "질문게시판" },
];

// 한 페이지에 몇 개씩 보여줄지
const PAGE_SIZE = 5;

function Community() {
const navigate = useNavigate();
const [activeCategory, setActiveCategory] = useState("all");

// 검색 인풋 / 실제 적용된 검색어 분리
const [searchKeyword, setSearchKeyword] = useState("");
const [appliedKeyword, setAppliedKeyword] = useState("");

const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// 🔹 페이징 관련 상태
const [currentPage, setCurrentPage] = useState(1);

// 🔹 로그인한 회원 아이디 (내 글인지 판별용)
const [loginMemberId, setLoginMemberId] = useState(null);

// ================= 세션 확인 (로그인한 회원 아이디 가져오기) =================
useEffect(() => {
    const fetchSession = async () => {
    try {
        const res = await fetch("/react/api/member/check-session", {
        method: "GET",
        });
        if (!res.ok) {
        throw new Error("세션 확인 실패");
        }
        const data = await res.json();
        if (data.loggedIn) {
        // MemberController.checkSession 에서 memberId 같이 내려주도록 수정해 두면 됨
        setLoginMemberId(data.memberId || null);
        } else {
        setLoginMemberId(null);
        }
    } catch (e) {
        console.error("세션 확인 오류:", e);
        setLoginMemberId(null);
    }
    };

    fetchSession();
}, []);

// ================= 게시글 목록 조회 =================
useEffect(() => {
    const fetchPosts = async () => {
    try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("category", activeCategory);
        if (appliedKeyword.trim() !== "") {
        params.append("keyword", appliedKeyword.trim());
        }

        const res = await fetch(
        `/react/api/community/posts?${params.toString()}`,
        {
            method: "GET",
        }
        );

        if (!res.ok) {
        throw new Error("게시글을 불러오지 못했습니다.");
        }

        const data = await res.json(); // CommunityPostDto[]
        setPosts(Array.isArray(data) ? data : []);
        // 새로운 조건으로 조회할 때는 항상 1페이지로
        setCurrentPage(1);
    } catch (err) {
        console.error("커뮤니티 목록 조회 오류:", err);
        setError(err.message || "오류가 발생했습니다.");
    } finally {
        setLoading(false);
    }
    };

    fetchPosts();
}, [activeCategory, appliedKeyword]);

// ================= 핸들러들 =================
const handleWriteClick = () => {
    navigate("/community/write");
};

const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
};

const handleSearch = () => {
    setAppliedKeyword(searchKeyword);
    setCurrentPage(1); // 검색 새로 하면 1페이지로
};

// ================= 페이징 관련 계산 =================
// 일단 서버에서 받은 전체 posts 그대로 사용
const filteredPosts = useMemo(() => posts, [posts]);

// 전체 페이지 수
const totalPages = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return 0;
    return Math.ceil(filteredPosts.length / PAGE_SIZE);
}, [filteredPosts]);

// 현재 페이지에 보여줄 목록만 slice
const paginatedPosts = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPosts.slice(start, end);
}, [filteredPosts, currentPage]);

// 현재 페이지가 전체 페이지 수보다 커졌을 때 보정
useEffect(() => {
    if (totalPages === 0) {
    setCurrentPage(1);
    return;
    }
    setCurrentPage((prev) =>
    prev > totalPages ? totalPages : prev < 1 ? 1 : prev
    );
}, [totalPages]);

// ================= 렌더 =================
return (
    <>
    <Header />

    <main className="community-main">
        <div className="community-container">
        {/* 상단 타이틀 */}
        <section className="community-header">
            <div className="community-title-wrap">
            <h1 className="community-title">커뮤니티</h1>
            <p className="community-subtitle">
                진료 경험, 건강 고민, 작은 팁까지 서로 편하게 나누는 공간입니다.
            </p>
            </div>

            <div className="community-actions">
            <div className="community-search">
                <input
                type="text"
                placeholder="제목, 내용, 작성자를 검색해 보세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                    }
                }}
                />
                <button
                type="button"
                onClick={handleSearch}
                className="community-search-btn"
                >
                <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                </svg>
                </button>
            </div>

            <button
                type="button"
                className="community-write-btn"
                onClick={handleWriteClick}
            >
                글쓰기
            </button>
            </div>
        </section>

        {/* 카테고리 탭 */}
        <section className="community-tabs">
            {CATEGORY_TABS.map((tab) => (
            <button
                key={tab.key}
                type="button"
                className={`community-tab-btn ${
                activeCategory === tab.key ? "active" : ""
                }`}
                onClick={() => {
                setActiveCategory(tab.key);
                setCurrentPage(1);
                }}
            >
                {tab.label}
            </button>
            ))}
        </section>

        {/* 게시글 리스트 */}
        <section className="community-list-section">
            {loading && (
            <div className="community-empty">
                <p>게시글을 불러오는 중입니다…</p>
            </div>
            )}

            {error && !loading && (
            <div className="community-empty">
                <p>{error}</p>
            </div>
            )}

            {!loading && !error && paginatedPosts.length === 0 && (
            <div className="community-empty">
                <p>아직 등록된 게시글이 없습니다.</p>
                <p>첫 번째 글의 주인공이 되어 보세요.</p>
            </div>
            )}

            {!loading && !error && paginatedPosts.length > 0 && (
            <>
                <ul className="community-list">
                {paginatedPosts.map((post) => (
                    <li
                    key={post.postId}
                    className={`community-card community-card-${
                        post.category === "notice" ? "notice" : "default"
                    }`}
                    onClick={() => handlePostClick(post.postId)}
                    >
                    <div className="community-card-header">
                        <div className="community-card-badge-wrap">
                        {post.category === "notice" && (
                            <span className="badge badge-notice">공지</span>
                        )}
                        {post.category === "question" && (
                            <span className="badge badge-question">질문</span>
                        )}
                        {post.category === "free" && (
                            <span className="badge badge-free">자유</span>
                        )}
                        </div>
                        <h2 className="community-card-title">{post.title}</h2>
                    </div>

                    <p className="community-card-content">{post.content}</p>

                    <div className="community-card-footer">
                        <div className="community-meta-left">
                        <span className="community-author">
                            {post.memberId}
                        </span>
                        <span className="community-dot">·</span>
                        <span className="community-date">
                            {(post.createdAt || "")
                            .substring(0, 10)
                            .replace(/-/g, ".")}
                        </span>
                        </div>
                        <div className="community-meta-right">
                        <span className="community-views">
                            조회 {post.views}
                        </span>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>

                {/* 🔹 페이징 영역 */}
                {totalPages > 1 && (
                <div className="community-pagination">
                    <button
                    type="button"
                    className="page-btn"
                    onClick={() =>
                        setCurrentPage((p) => (p > 1 ? p - 1 : p))
                    }
                    disabled={currentPage === 1}
                    >
                    이전
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => {
                    const page = idx + 1;
                    return (
                        <button
                        key={page}
                        type="button"
                        className={`page-btn ${
                            page === currentPage ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        >
                        {page}
                        </button>
                    );
                    })}

                    <button
                    type="button"
                    className="page-btn"
                    onClick={() =>
                        setCurrentPage((p) =>
                        p < totalPages ? p + 1 : p
                        )
                    }
                    disabled={currentPage === totalPages}
                    >
                    다음
                    </button>
                </div>
                )}
            </>
            )}
        </section>
        </div>
    </main>

    <Footer />
    </>
);
}

export default Community;
