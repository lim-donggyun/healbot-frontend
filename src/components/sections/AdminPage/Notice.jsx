import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNotices, createNotice, updateNotice, deleteNotice } from '../../../utils/noticeApi';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './Notice.css';

const Notice = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: 'NOTICE'
  });
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'NOTICE'
  });

  const rowsPerPage = 5;

  // 컴포넌트 마운트 시 공지사항 데이터 로드
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getAllNotices();

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeNo,
          TITLE: notice.noticeSubject,
          CONTENT: notice.noticeContent,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.viewCount || 0
        }));

        setNotices(convertedData);
        setFilteredNotices(convertedData);
      } catch (error) {
        console.error('공지사항 데이터 로드 실패:', error);
        alert('공지사항 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 유틸 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const dateOnly = dateStr.split("T")[0];
    const [y, m, d] = dateOnly.split("-");
    return `${y}.${m}.${d}`;
  };

  const getCategoryPill = (category) => {
    let label = "";
    let cls = "";

    switch(category) {
      case "NOTICE":
        label = "공지";
        cls = "";
        break;
      case "IMPORTANT":
        label = "중요";
        cls = "important";
        break;
      case "UPDATE":
        label = "업데이트";
        cls = "update";
        break;
      case "EVENT":
        label = "이벤트";
        cls = "event";
        break;
      default:
        label = category;
    }

    return (
      <span className={`category-pill ${cls}`}>
        <span className="category-dot"></span>
        {label}
      </span>
    );
  };

  // 필터 적용
  const applyFilter = () => {
    const filtered = notices.filter((n) => {
      const keywordLower = keyword.trim().toLowerCase();
      const textMatch =
        !keywordLower ||
        n.TITLE.toLowerCase().includes(keywordLower) ||
        n.CONTENT.toLowerCase().includes(keywordLower);

      const categoryMatch = categoryFilter === "ALL" || n.CATEGORY === categoryFilter;

      return textMatch && categoryMatch;
    });

    setFilteredNotices(filtered);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setKeyword('');
    setCategoryFilter('ALL');
    setFilteredNotices(notices);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = (noticeId) => {
    const notice = notices.find(n => n.NOTICE_ID === noticeId);
    if (notice) {
      setSelectedNotice(notice);
      setIsDetailModalOpen(true);
      setIsEditMode(false);
    }
  };

  // 수정 모드로 전환
  const handleEditFromDetail = () => {
    setEditFormData({
      title: selectedNotice.TITLE,
      content: selectedNotice.CONTENT,
      category: selectedNotice.CATEGORY
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
      const noticeData = {
        noticeSubject: editFormData.title,
        noticeContent: editFormData.content,
        category: editFormData.category
      };
      const result = await updateNotice(selectedNotice.NOTICE_ID, noticeData);
      if (result.success) {
        alert('공지사항이 수정되었습니다.');
        // 목록 새로고침
        const data = await getAllNotices();
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeNo,
          TITLE: notice.noticeSubject,
          CONTENT: notice.noticeContent,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.viewCount || 0
        }));

        setNotices(convertedData);
        setFilteredNotices(convertedData);
        setIsDetailModalOpen(false);
        setIsEditMode(false);
      } else {
        alert('공지사항 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 삭제 (상세 모달에서)
  const handleDeleteFromDetail = async () => {
    const confirmed = window.confirm(`정말로 '${selectedNotice.TITLE}' 공지사항을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const result = await deleteNotice(selectedNotice.NOTICE_ID);
      if (result.success) {
        alert('공지사항이 삭제되었습니다.');
        // 삭제 후 목록 새로고침
        const data = await getAllNotices();
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeNo,
          TITLE: notice.noticeSubject,
          CONTENT: notice.noticeContent,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.viewCount || 0
        }));

        setNotices(convertedData);
        setFilteredNotices(convertedData);
        setIsDetailModalOpen(false);
      } else {
        alert('공지사항 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('공지사항 삭제 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 생성
  const handleCreateNotice = async () => {
    if (!newNotice.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!newNotice.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const noticeData = {
        noticeSubject: newNotice.title,
        noticeContent: newNotice.content,
        noticeWriter: "ADMIN",
        category: newNotice.category
      };

      const result = await createNotice(noticeData);
      if (result.success) {
        alert('공지사항이 등록되었습니다.');
        // 생성 후 목록 새로고침
        const data = await getAllNotices();
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeNo,
          TITLE: notice.noticeSubject,
          CONTENT: notice.noticeContent,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.viewCount || 0
        }));

        setNotices(convertedData);
        setFilteredNotices(convertedData);
        setShowCreateModal(false);
        setNewNotice({ title: '', content: '', category: 'NOTICE' });
      } else {
        alert('공지사항 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('공지사항 생성 실패:', error);
      alert('공지사항 등록 중 오류가 발생했습니다.');
    }
  };

  // 엔터키 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilter();
    }
  };

  // 필터 변경 시 자동 적용
  useEffect(() => {
    applyFilter();
  }, [categoryFilter]);

  // 페이징
  const total = filteredNotices.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredNotices.slice(startIdx, endIdx);

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
        {/* 공지사항 관리 */}
        <div className="notice-management">
          <div className="notice-header">
            <h2>
              검색된 공지사항 <span className="notice-count">{filteredNotices.length}</span>개
            </h2>
            <button className="add-notice-btn" onClick={() => setShowCreateModal(true)}>
              공지사항 추가
            </button>
          </div>

          <div className="notice-search-filters">
            <div className="filter-group">
              <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="ALL">전체 카테고리</option>
                <option value="NOTICE">공지</option>
                <option value="IMPORTANT">중요</option>
                <option value="UPDATE">업데이트</option>
                <option value="EVENT">이벤트</option>
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

          <div className="notice-table-container">
            <table className="notice-table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>제목</th>
                  <th>등록일</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((n) => (
                    <tr key={n.NOTICE_ID} onClick={() => handleDetailClick(n.NOTICE_ID)} style={{ cursor: "pointer" }}>
                      <td>{getCategoryPill(n.CATEGORY)}</td>
                      <td>{n.TITLE}</td>
                      <td>{formatDate(n.CREATED_AT)}</td>
                      <td>{n.VIEWS}</td>
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

      {/* 공지사항 생성 모달 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>새 공지사항 작성</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group-row">
                <div className="form-group category-group">
                  <select
                    className="select"
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  >
                    <option value="NOTICE">공지</option>
                    <option value="IMPORTANT">중요</option>
                    <option value="UPDATE">업데이트</option>
                    <option value="EVENT">이벤트</option>
                  </select>
                </div>
                <div className="form-group title-group">
                  <input
                    type="text"
                    className="input"
                    placeholder="제목을 입력하세요"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea
                  className="textarea"
                  placeholder="공지사항 내용을 입력하세요"
                  rows="8"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline btn" onClick={() => setShowCreateModal(false)}>
                취소
              </button>
              <button className="btn" onClick={handleCreateNotice}>
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 상세 모달 */}
      {isDetailModalOpen && selectedNotice && (
        <div className="modal-overlay" onClick={() => {
          setIsDetailModalOpen(false);
          setIsEditMode(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? '공지사항 수정' : '공지사항 상세'}</h3>
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
                        <div className="detail-label">공지사항 ID</div>
                        <div className="detail-value">{selectedNotice.NOTICE_ID}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">카테고리</div>
                        <div className="detail-value">{getCategoryPill(selectedNotice.CATEGORY)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">조회수</div>
                        <div className="detail-value">{selectedNotice.VIEWS}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">등록일</div>
                        <div className="detail-value">{formatDate(selectedNotice.CREATED_AT)}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">제목</div>
                        <div className="detail-value">{selectedNotice.TITLE}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">내용</div>
                        <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedNotice.CONTENT}
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
                        onChange={handleEditInputChange}
                      >
                        <option value="NOTICE">공지</option>
                        <option value="IMPORTANT">중요</option>
                        <option value="UPDATE">업데이트</option>
                        <option value="EVENT">이벤트</option>
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

export default Notice;
