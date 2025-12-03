// src/pages/MyReview.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import "./MyReview.css"; // Community.css도 같이 쓰고 있으면 그대로 두면 됨

// 한 페이지에 몇 개씩 보여줄지
const PAGE_SIZE = 5;

function MyReview() {
  // 탭 상태 (community: 커뮤니티 글, review: 리뷰 글)
  const [activeTab, setActiveTab] = useState("community");

  // 검색어
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  // 내가 쓴 게시글 목록
  const [posts, setPosts] = useState([]);
  // 내가 쓴 리뷰 목록
  const [reviews, setReviews] = useState([]);

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

        const res = await fetch(`/react/api/community/posts?${params.toString()}`, {
          method: "GET",
        });

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

    if (activeTab === "community") {
      fetchMyPosts();
    }
  }, [appliedKeyword, loginMemberId, activeTab]);

  // ================= 내가 쓴 리뷰만 조회 =================
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("sort", "latest");
        params.append("rating", "all");

        const res = await fetch(`/api/reviews/my?${params.toString()}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("리뷰를 불러오지 못했습니다.");
        }

        const data = await res.json();
        let list = Array.isArray(data) ? data : [];

        // 검색어 필터링
        if (appliedKeyword.trim() !== "") {
          const keyword = appliedKeyword.trim().toLowerCase();
          list = list.filter(
            (review) =>
              review.content?.toLowerCase().includes(keyword) ||
              review.hospitalName?.toLowerCase().includes(keyword)
          );
        }

        setReviews(list);
        setCurrentPage(1);
      } catch (err) {
        console.error("내 리뷰 조회 오류:", err);
        setError(err.message || "내가 쓴 리뷰를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "review") {
      fetchMyReviews();
    }
  }, [appliedKeyword, activeTab]);

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
  const activeList = useMemo(() => {
    return activeTab === "community" ? posts : reviews;
  }, [activeTab, posts, reviews]);

  const totalPages = useMemo(() => {
    if (!activeList || activeList.length === 0) return 0;
    return Math.ceil(activeList.length / PAGE_SIZE);
  }, [activeList]);

  const paginatedList = useMemo(() => {
    if (!activeList || activeList.length === 0) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return activeList.slice(start, end);
  }, [activeList, currentPage]);

  // 현재 페이지 보정
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev < 1 ? 1 : prev));
  }, [totalPages]);

  // 페이지 변경 시 맨 위로 즉시 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // 페이지 번호 5개씩 그룹화
  const pageGroupSize = 5;
  const currentPageGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentPageGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(currentPageGroup * pageGroupSize, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPrevGroup = () => {
    const prevGroupLastPage = (currentPageGroup - 2) * pageGroupSize + pageGroupSize;
    setCurrentPage(prevGroupLastPage);
  };

  const goToNextGroup = () => {
    const nextGroupFirstPage = currentPageGroup * pageGroupSize + 1;
    setCurrentPage(nextGroupFirstPage);
  };

  // ================= 삭제 핸들러 =================
  const handleDeletePost = async (postId) => {
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("리뷰 삭제에 실패했습니다.");
        return;
      }

      alert("삭제되었습니다.");
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId && r.id !== reviewId));
    } catch (e) {
      console.error("리뷰 삭제 오류:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ================= 렌더 =================
  return (
    <div className="review-page-wrapper">
      <Header />

      <main className="mr-main">
        <div className="mr-container">
          {/* 상단: 제목 */}
          <section className="mr-header-row">
            <div className="mr-title-wrap">
              <h1 className="mr-page-title">내가 쓴 글</h1>
              <p className="mr-page-sub">커뮤니티와 리뷰에서 내가 작성한 글을 한 번에 확인하고 관리할 수 있습니다.</p>
            </div>
          </section>

          {/* 탭 영역 */}
          <section className="mr-tabs">
            <button
              type="button"
              className={`mr-tab-btn ${activeTab === "community" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("community");
                setCurrentPage(1);
                setSearchKeyword("");
                setAppliedKeyword("");
              }}>
              커뮤니티 글
            </button>
            <button
              type="button"
              className={`mr-tab-btn ${activeTab === "review" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("review");
                setCurrentPage(1);
                setSearchKeyword("");
                setAppliedKeyword("");
              }}>
              리뷰 글
            </button>
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
                <button type="button" className="mr-search-btn" onClick={handleSearch}>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round">
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

            {!loading && !error && paginatedList.length === 0 && (
              <div className="mr-empty">
                <div className="mr-empty-icon">📝</div>
                {activeTab === "community" ? (
                  <>
                    <p className="mr-empty-text">아직 작성한 게시글이 없습니다.</p>
                    <p className="mr-empty-sub">커뮤니티에서 질문이나 후기를 남겨 보세요.</p>
                  </>
                ) : (
                  <>
                    <p className="mr-empty-text">아직 작성한 리뷰가 없습니다.</p>
                    <p className="mr-empty-sub">병원 후기를 작성해 보세요.</p>
                  </>
                )}
              </div>
            )}

            {!loading && !error && paginatedList.length > 0 && activeTab === "community" && (
              <>
                <ul className="community-list mr-review-list">
                  {paginatedList.map((post) => (
                    <li
                      key={post.postId}
                      className={`community-card community-card-${post.category === "notice" ? "notice" : "default"}`}>
                      <div className="community-card-header">
                        <div className="community-card-badge-wrap">
                          {post.category === "notice" && <span className="badge badge-notice">공지</span>}
                          {post.category === "question" && <span className="badge badge-question">질문</span>}
                          {post.category === "review" && <span className="badge badge-review">후기</span>}
                          {post.category === "free" && <span className="badge badge-free">자유</span>}
                        </div>
                        <h2 className="community-card-title">{post.title}</h2>
                      </div>

                      <p className="community-card-content">{post.content}</p>

                      <div className="community-card-footer">
                        <div className="community-meta-left">
                          <span className="community-author">{post.memberId}</span>
                          <span className="community-dot">·</span>
                          <span className="community-date">
                            {(post.createdAt || "").substring(0, 10).replace(/-/g, ".")}
                          </span>
                        </div>
                        <div className="community-meta-right">
                          <span className="community-views">조회 {post.views}</span>
                          <button
                            type="button"
                            className="community-delete-btn"
                            onClick={() => handleDeletePost(post.postId)}>
                            삭제
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* 페이징 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      className={`page-btn arrow-btn ${currentPage === 1 ? "disabled" : ""}`}
                      disabled={currentPage === 1}
                      title="첫 페이지">
                      처음 페이지
                    </button>

                    <button
                      type="button"
                      onClick={goToPrevGroup}
                      className={`page-btn arrow-btn ${currentPageGroup === 1 ? "disabled" : ""}`}
                      disabled={currentPageGroup === 1}
                      title="이전 5페이지">
                      «
                    </button>

                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() => setCurrentPage(number)}
                        className={`page-btn ${currentPage === number ? "active" : ""}`}>
                        {number}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={goToNextGroup}
                      className={`page-btn arrow-btn ${endPage >= totalPages ? "disabled" : ""}`}
                      disabled={endPage >= totalPages}
                      title="다음 5페이지">
                      »
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                      disabled={currentPage === totalPages}
                      title="마지막 페이지">
                      끝 페이지
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 리뷰 목록 */}
            {!loading && !error && paginatedList.length > 0 && activeTab === "review" && (
              <>
                <div className="mr-review-list">
                  {paginatedList.map((review) => (
                    <div key={review.reviewId || review.id} className="rv-card mr-review-card">
                      <div className="rv-card-top">
                        <div className="rv-card-score">
                          {"★".repeat(Math.round(review.score || 0))}
                          {"☆".repeat(5 - Math.round(review.score || 0))}
                          <span className="rv-card-score-text">
                            {review.score?.toFixed ? review.score.toFixed(1) : review.score}
                          </span>
                        </div>
                        <span className="rv-card-writer">
                          {review.writerName || review.userName || "익명"}
                        </span>
                      </div>

                      <div className="rv-card-hname">{review.hospitalName}</div>
                      <p className="rv-card-content">{review.content}</p>

                      {review.images && review.images.length > 0 && (
                        <div className="rv-card-images">
                          {review.images.map((img, idx) => (
                            <div key={idx} className="rv-card-image-item">
                              <img src={img} alt={`review-${idx}`} />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="rv-card-bottom">
                        <span className="rv-card-date">{review.createdAt}</span>
                        <button
                          type="button"
                          className="community-delete-btn"
                          onClick={() => handleDeleteReview(review.reviewId || review.id)}>
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이징 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(1)}
                      className={`page-btn arrow-btn ${currentPage === 1 ? "disabled" : ""}`}
                      disabled={currentPage === 1}
                      title="첫 페이지">
                      처음 페이지
                    </button>

                    <button
                      type="button"
                      onClick={goToPrevGroup}
                      className={`page-btn arrow-btn ${currentPageGroup === 1 ? "disabled" : ""}`}
                      disabled={currentPageGroup === 1}
                      title="이전 5페이지">
                      «
                    </button>

                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        type="button"
                        onClick={() => setCurrentPage(number)}
                        className={`page-btn ${currentPage === number ? "active" : ""}`}>
                        {number}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={goToNextGroup}
                      className={`page-btn arrow-btn ${endPage >= totalPages ? "disabled" : ""}`}
                      disabled={endPage >= totalPages}
                      title="다음 5페이지">
                      »
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(totalPages)}
                      className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                      disabled={currentPage === totalPages}
                      title="마지막 페이지">
                      끝 페이지
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyReview;
