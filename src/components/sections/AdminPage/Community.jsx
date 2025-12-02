import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../../pages/MainPage.css";
import "./Community.css";

const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    category: "free",
  });

  const rowsPerPage = 5;

  // 카테고리 라벨 변환
  const getCategoryLabel = (category) => {
    switch (category) {
      case "notice":
        return "공지";
      case "free":
        return "자유";
      case "question":
        return "질문";
      case "review":
        return "후기";
      default:
        return "기타";
    }
  };

  // 카테고리 pill 스타일
  const getCategoryPill = (category) => {
    let label = getCategoryLabel(category);
    let cls = "";

    switch (category) {
      case "notice":
        cls = "important";
        break;
      case "free":
        cls = "";
        break;
      case "question":
        cls = "update";
        break;
      case "review":
        cls = "event";
        break;
      default:
        cls = "";
    }

    return (
      <span className={`category-pill ${cls}`}>
        <span className="category-dot"></span>
        {label}
      </span>
    );
  };

  // 컴포넌트 마운트 시 게시글 데이터 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/react/api/community/posts", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("게시글 데이터 로드 실패:", error);
        alert("게시글 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dateOnly = dateStr.split("T")[0];
    const [y, m, d] = dateOnly.split("-");
    return `${y}.${m}.${d}`;
  };

  // 필터 적용
  const applyFilter = () => {
    const filtered = posts.filter((p) => {
      const keywordLower = keyword.trim().toLowerCase();
      const textMatch =
        !keywordLower || p.title.toLowerCase().includes(keywordLower) || p.content.toLowerCase().includes(keywordLower);

      const categoryMatch = categoryFilter === "ALL" || p.category === categoryFilter;

      return textMatch && categoryMatch;
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setKeyword("");
    setCategoryFilter("ALL");
    setFilteredPosts(posts);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = async (postId) => {
    try {
      const response = await fetch(`/react/api/community/posts/${postId}?admin=true`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("게시글을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setSelectedPost(data);
      setIsDetailModalOpen(true);
      setIsEditMode(false);
    } catch (error) {
      console.error("게시글 상세 조회 실패:", error);
      alert("게시글을 불러오는데 실패했습니다.");
    }
  };

  // 수정 모드로 전환
  const handleEditFromDetail = () => {
    setEditFormData({
      title: selectedPost.title,
      content: selectedPost.content,
      category: selectedPost.category,
    });
    setIsEditMode(true);
  };

  // 수정 폼 입력 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 저장
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/react/api/community/posts/${selectedPost.postId}?admin=true`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("게시글 수정에 실패했습니다.");
      }

      alert("게시글이 수정되었습니다.");

      // 목록 새로고침
      const listResponse = await fetch("/react/api/community/posts", {
        method: "GET",
      });
      const data = await listResponse.json();
      setPosts(data);
      setFilteredPosts(data);
      setIsDetailModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제
  const handleDeleteFromDetail = async () => {
    const confirmed = window.confirm(`정말로 '${selectedPost.title}' 게시글을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/react/api/community/posts/${selectedPost.postId}?admin=true`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("게시글 삭제에 실패했습니다.");
      }

      alert("게시글이 삭제되었습니다.");

      // 삭제 후 목록 새로고침
      const listResponse = await fetch("/react/api/community/posts", {
        method: "GET",
      });
      const data = await listResponse.json();
      setPosts(data);
      setFilteredPosts(data);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 필터 변경 시 자동 적용
  useEffect(() => {
    applyFilter();
  }, [categoryFilter]);

  // 페이징
  const total = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredPosts.slice(startIdx, endIdx);

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

  if (loading) {
    return (
      <main className="admin-page admin-community-page">
        <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">데이터를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page admin-community-page">
      <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 커뮤니티 관리 */}
        <div className="community-management">
          <div className="community-header">
            <h2>
              검색된 커뮤니티 <span className="community-count">{filteredPosts.length}</span>개
            </h2>
          </div>

          <div className="community-search-filters">
            <div className="filter-group">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="ALL">전체 카테고리</option>
                <option value="free">자유</option>
                <option value="question">질문</option>
                <option value="review">후기</option>
              </select>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="제목, 내용으로 검색..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                applyFilter();
              }}
            />
          </div>

          <div className="community-table-container">
            <table className="community-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>카테고리</th>
                  <th style={{ width: "50%" }}>제목</th>
                  <th style={{ width: "15%" }}>작성자</th>
                  <th style={{ width: "15%" }}>작성일</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    조회수
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((post) => (
                    <tr key={post.postId} onClick={() => handleDetailClick(post.postId)} style={{ cursor: "pointer" }}>
                      <td>{getCategoryPill(post.category)}</td>
                      <td>{post.title}</td>
                      <td>{post.memberId}</td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td className="text-center">{post.views || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(1)}
                className={`page-btn arrow-btn ${currentPage === 1 ? "disabled" : ""}`}
                disabled={currentPage === 1}
                title="첫 페이지">
                처음 페이지
              </button>

              <button
                onClick={goToPrevGroup}
                className={`page-btn arrow-btn ${currentPageGroup === 1 ? "disabled" : ""}`}
                disabled={currentPageGroup === 1}
                title="이전 5페이지">
                «
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`page-btn ${currentPage === number ? "active" : ""}`}>
                  {number}
                </button>
              ))}

              <button
                onClick={goToNextGroup}
                className={`page-btn arrow-btn ${endPage >= totalPages ? "disabled" : ""}`}
                disabled={endPage >= totalPages}
                title="다음 5페이지">
                »
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
                title="마지막 페이지">
                끝 페이지
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 게시글 상세 모달 */}
      {isDetailModalOpen && selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsDetailModalOpen(false);
            setIsEditMode(false);
          }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? "게시글 수정" : "게시글 상세"}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsEditMode(false);
                }}>
                ✕
              </button>
            </div>

            {!isEditMode ? (
              /* 조회 모드 */
              <>
                <div className="modal-body">
                  <div className="detail-section">
                    <h4>기본 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">게시글 ID</div>
                        <div className="detail-value">{selectedPost.postId}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">카테고리</div>
                        <div className="detail-value">{getCategoryPill(selectedPost.category)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">조회수</div>
                        <div className="detail-value">{selectedPost.views || 0}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">작성자</div>
                        <div className="detail-value">{selectedPost.memberId}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">작성일</div>
                        <div className="detail-value">{formatDate(selectedPost.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>게시글 내용</h4>
                    <div className="detail-grid">
                      <div className="detail-item full-width">
                        <div className="detail-label">제목</div>
                        <div className="detail-value">{selectedPost.title}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">내용</div>
                        <div className="detail-value" style={{ whiteSpace: "pre-wrap" }}>
                          {selectedPost.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="edit-btn" onClick={handleEditFromDetail}>
                    수정
                  </button>
                  <button className="delete-btn" onClick={handleDeleteFromDetail}>
                    삭제
                  </button>
                </div>
              </>
            ) : (
              /* 수정 모드 */
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="form-group-row">
                    <div className="form-group category-group">
                      <select
                        className="select"
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditInputChange}>
                        <option value="free">자유</option>
                        <option value="question">질문</option>
                        <option value="review">후기</option>
                      </select>
                    </div>
                    <div className="form-group title-group">
                      <input
                        type="text"
                        className="input"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditInputChange}
                        placeholder="제목을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">내용</label>
                    <textarea
                      className="textarea"
                      name="content"
                      value={editFormData.content}
                      onChange={handleEditInputChange}
                      rows="10"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-outline btn" onClick={() => setIsEditMode(false)}>
                    취소
                  </button>
                  <button type="submit" className="btn">
                    저장
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Community;
