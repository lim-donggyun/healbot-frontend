// src/pages/MyReview.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import "./MyReview.css"; // Community.css도 같이 쓰고 있으면 그대로 두면 됨

// 한 페이지에 몇 개씩 보여줄지
const PAGE_SIZE = 5;

function MyReview() {
// 검색어
const [searchKeyword, setSearchKeyword] = useState("");
const [appliedKeyword, setAppliedKeyword] = useState("");

// 내가 쓴 게시글 목록
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// 페이징
const [currentPage, setCurrentPage] = useState(1);

// 로그인한 회원 아이디
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

// ================= 커뮤니티 전체에서 내가 쓴 글만 조회 =================
useEffect(() => {
    const fetchMyPosts = async () => {
    try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        // 전체 카테고리 (Community.jsx에서 all 쓰는 것과 동일하게 맞춤)
        params.append("category", "all");
        // 검색어
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
        let list = Array.isArray(data) ? data : [];

        // ✅ 내 글만 필터링
        if (loginMemberId) {
        list = list.filter((post) => post.memberId === loginMemberId);
        } else {
        list = [];
        }

        // 최신순 정렬 (createdAt 기준)
        list.sort((a, b) => {
        const aDate = (a.createdAt || "").substring(0, 19);
        const bDate = (b.createdAt || "").substring(0, 19);
        return bDate.localeCompare(aDate);
        });

        setPosts(list);
        setCurrentPage(1);
    } catch (err) {
        console.error("내 게시글 조회 오류:", err);
        setError(err.message || "내가 쓴 글을 불러오는 중 오류가 발생했습니다.");
    } finally {
        setLoading(false);
    }
    };

    fetchMyPosts();
}, [appliedKeyword, loginMemberId]);

// ================= 검색 적용 =================
const handleSearch = () => {
    setAppliedKeyword(searchKeyword);
    setCurrentPage(1);
};

const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
    e.preventDefault();
    handleSearch();
    }
};

// ================= 페이징 관련 계산 =================
const filteredPosts = useMemo(() => posts, [posts]);

const totalPages = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return 0;
    return Math.ceil(filteredPosts.length / PAGE_SIZE);
}, [filteredPosts]);

const paginatedPosts = useMemo(() => {
    if (!filteredPosts || filteredPosts.length === 0) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPosts.slice(start, end);
}, [filteredPosts, currentPage]);

// 현재 페이지 보정
useEffect(() => {
    if (totalPages === 0) {
    setCurrentPage(1);
    return;
    }
    setCurrentPage((prev) =>
    prev > totalPages ? totalPages : prev < 1 ? 1 : prev
    );
}, [totalPages]);

// ================= 삭제 핸들러 =================
const handleDelete = async (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    try {
    const res = await fetch(`/react/api/community/posts/${postId}`, {
        method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
        alert(data.message || "삭제에 실패했습니다.");
        return;
    }

    alert("삭제되었습니다.");
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
    } catch (e) {
    console.error("게시글 삭제 오류:", e);
    alert("삭제 중 오류가 발생했습니다.");
    }
};

// ================= 렌더 =================
return (
    <>
    <Header />

    <main className="mr-main">
        <div className="mr-container">
        {/* 상단: 제목 */}
        <section className="mr-header-row">
            <div className="mr-title-wrap">
            <h1 className="mr-page-title">내가 쓴 글</h1>
            <p className="mr-page-sub">
                커뮤니티 전체에서 내가 작성한 글을 한 번에 확인하고 관리할 수
                있습니다.
            </p>
            </div>
        </section>

        {/* 리스트 영역 (Community 카드 디자인 재사용) */}
        <section className="mr-list-section">
            {/* 검색창 */}
            <div className="mr-search-wrapper">
            <div className="mr-search">
                <input
                type="text"
                placeholder="제목, 내용으로 검색해 보세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                />
                <button
                type="button"
                className="mr-search-btn"
                onClick={handleSearch}
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
            </div>
            {loading && (
            <div className="mr-empty">
                <p>게시글을 불러오는 중입니다…</p>
            </div>
            )}

            {error && !loading && (
            <div className="mr-empty">
                <p>{error}</p>
            </div>
            )}

            {!loading && !error && paginatedPosts.length === 0 && (
            <div className="mr-empty">
                <div className="mr-empty-icon">📝</div>
                <p className="mr-empty-text">아직 작성한 게시글이 없습니다.</p>
                <p className="mr-empty-sub">
                커뮤니티에서 질문이나 후기를 남겨 보세요.
                </p>
            </div>
            )}

            {!loading && !error && paginatedPosts.length > 0 && (
            <>
                <ul className="community-list mr-review-list">
                {paginatedPosts.map((post) => (
                    <li
                    key={post.postId}
                    className={`community-card community-card-${
                        post.category === "notice" ? "notice" : "default"
                    }`}
                    >
                    <div className="community-card-header">
                        <div className="community-card-badge-wrap">
                        {post.category === "notice" && (
                            <span className="badge badge-notice">공지</span>
                        )}
                        {post.category === "question" && (
                            <span className="badge badge-question">질문</span>
                        )}
                        {post.category === "review" && (
                            <span className="badge badge-review">후기</span>
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
                        {/* 내 글 목록 페이지이므로 모두 내 글 → 삭제 버튼 항상 노출 */}
                        <button
                            type="button"
                            className="community-delete-btn"
                            onClick={() => handleDelete(post.postId)}
                        >
                            삭제
                        </button>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>

                {/* 페이징 */}
                {totalPages > 1 && (
                <div className="community-pagination mr-pagination">
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

export default MyReview;
