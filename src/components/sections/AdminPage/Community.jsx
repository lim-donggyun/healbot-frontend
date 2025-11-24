import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './Dashboard.css';

const Community = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: 'free'
  });

  const rowsPerPage = 10;

  // 카테고리 라벨 변환
  const getCategoryLabel = (category) => {
    switch (category) {
      case "notice": return "공지";
      case "free": return "자유";
      case "question": return "질문";
      case "review": return "후기";
      default: return "기타";
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
        const response = await fetch('/react/api/community/posts', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('게시글 데이터 로드 실패:', error);
        alert('게시글 데이터를 불러오는데 실패했습니다.');
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
        !keywordLower ||
        p.title.toLowerCase().includes(keywordLower) ||
        p.content.toLowerCase().includes(keywordLower);

      const categoryMatch = categoryFilter === "ALL" || p.category === categoryFilter;

      return textMatch && categoryMatch;
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setKeyword('');
    setCategoryFilter('ALL');
    setFilteredPosts(posts);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = async (postId) => {
    try {
      const response = await fetch(`/react/api/community/posts/${postId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setSelectedPost(data);
      setIsDetailModalOpen(true);
      setIsEditMode(false);
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  // 수정 모드로 전환
  const handleEditFromDetail = () => {
    setEditFormData({
      title: selectedPost.title,
      content: selectedPost.content,
      category: selectedPost.category
    });
    setIsEditMode(true);
  };

  // 수정 폼 입력 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 저장
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/react/api/community/posts/${selectedPost.postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다.');
      }

      alert('게시글이 수정되었습니다.');

      // 목록 새로고침
      const listResponse = await fetch('/react/api/community/posts', {
        method: 'GET',
      });
      const data = await listResponse.json();
      setPosts(data);
      setFilteredPosts(data);
      setIsDetailModalOpen(false);
      setIsEditMode(false);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  // 게시글 삭제
  const handleDeleteFromDetail = async () => {
    const confirmed = window.confirm(`정말로 '${selectedPost.title}' 게시글을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/react/api/community/posts/${selectedPost.postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('게시글 삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');

      // 삭제 후 목록 새로고침
      const listResponse = await fetch('/react/api/community/posts', {
        method: 'GET',
      });
      const data = await listResponse.json();
      setPosts(data);
      setFilteredPosts(data);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
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
      <main className="admin-page">
        <Sidebar />
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '16px',
          color: 'var(--muted)'
        }}>
          데이터를 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 커뮤니티 관리 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">커뮤니티 관리</div>
              <div className="admin-card-sub">
                사용자가 작성한 커뮤니티 게시글을 조회하고 관리할 수 있습니다.
              </div>
            </div>
          </div>

          {/* 검색 필터 */}
          <div className="filter-grid" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">검색어</label>
              <input
                type="text"
                className="input"
                placeholder="제목, 내용으로 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    applyFilter();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select
                className="select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">전체</option>
                <option value="notice">공지</option>
                <option value="free">자유</option>
                <option value="question">질문</option>
                <option value="review">후기</option>
              </select>
            </div>

            <div className="filter-actions" style={{ alignSelf: 'flex-end' }}>
              <button className="btn" onClick={applyFilter}>
                검색
              </button>
              <button className="btn-outline btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>

          {/* 게시글 테이블 */}
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>카테고리</th>
                    <th style={{ width: '40%' }}>제목</th>
                    <th style={{ width: '15%' }}>작성자</th>
                    <th style={{ width: '15%' }}>작성일</th>
                    <th className="text-center" style={{ width: '10%' }}>조회수</th>
                    <th className="text-center" style={{ width: '10%' }}>댓글수</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        등록된 게시글이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((post) => (
                      <tr
                        key={post.postId}
                        onClick={() => handleDetailClick(post.postId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{getCategoryPill(post.category)}</td>
                        <td>{post.title}</td>
                        <td>{post.userId}</td>
                        <td>{formatDate(post.createdAt)}</td>
                        <td className="text-center">{post.viewCount || 0}</td>
                        <td className="text-center">{post.commentCount || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이징 */}
            {totalPages > 1 && (
              <div className="table-footer">
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  전체 {total}개 (현재 {startIdx + 1}-{endIdx})
                </div>
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
                    disabled={currentPage === 1}
                  >
                    처음
                  </button>

                  <button
                    onClick={goToPrevGroup}
                    className={`page-btn ${currentPageGroup === 1 ? "disabled" : ""}`}
                    disabled={currentPageGroup === 1}
                  >
                    «
                  </button>

                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`page-btn ${currentPage === number ? "active" : ""}`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={goToNextGroup}
                    className={`page-btn ${endPage >= totalPages ? "disabled" : ""}`}
                    disabled={endPage >= totalPages}
                  >
                    »
                  </button>

                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
                    disabled={currentPage === totalPages}
                  >
                    끝
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* 게시글 상세 모달 */}
      {isDetailModalOpen && selectedPost && (
        <div className="modal-overlay" onClick={() => {
          setIsDetailModalOpen(false);
          setIsEditMode(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? '게시글 수정' : '게시글 상세'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsEditMode(false);
                }}
              >
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
                        <div className="detail-label">작성자</div>
                        <div className="detail-value">{selectedPost.userId}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">작성일</div>
                        <div className="detail-value">{formatDate(selectedPost.createdAt)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">조회수</div>
                        <div className="detail-value">{selectedPost.viewCount || 0}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">댓글수</div>
                        <div className="detail-value">{selectedPost.commentCount || 0}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">제목</div>
                        <div className="detail-value">{selectedPost.title}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">내용</div>
                        <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedPost.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-outline btn" onClick={handleEditFromDetail}>
                    수정
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteFromDetail}>
                    삭제
                  </button>
                </div>
              </>
            ) : (
              /* 수정 모드 */
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">제목</label>
                    <input
                      type="text"
                      className="input"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">카테고리</label>
                    <select
                      className="select"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                    >
                      <option value="notice">공지</option>
                      <option value="free">자유</option>
                      <option value="question">질문</option>
                      <option value="review">후기</option>
                    </select>
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
                  <button
                    type="button"
                    className="btn-outline btn"
                    onClick={() => setIsEditMode(false)}
                  >
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
