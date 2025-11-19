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

  const rowsPerPage = 6;

  // 컴포넌트 마운트 시 공지사항 데이터 로드
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getAllNotices();

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeId,
          TITLE: notice.title,
          CONTENT: notice.content,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.views || 0
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

  // 통계 계산
  const stats = {
    total: notices.length,
    totalViews: notices.reduce((sum, n) => sum + n.VIEWS, 0)
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
      const result = await updateNotice(selectedNotice.NOTICE_ID, editFormData);
      if (result.success) {
        alert('공지사항이 수정되었습니다.');
        // 목록 새로고침
        const data = await getAllNotices();
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeId,
          TITLE: notice.title,
          CONTENT: notice.content,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.views || 0
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
          NOTICE_ID: notice.noticeId,
          TITLE: notice.title,
          CONTENT: notice.content,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.views || 0
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
        title: newNotice.title,
        content: newNotice.content,
        category: newNotice.category
      };

      const result = await createNotice(noticeData);
      if (result.success) {
        alert('공지사항이 등록되었습니다.');
        // 생성 후 목록 새로고침
        const data = await getAllNotices();
        const convertedData = data.map(notice => ({
          NOTICE_ID: notice.noticeId,
          TITLE: notice.title,
          CONTENT: notice.content,
          CATEGORY: notice.category,
          CREATED_AT: notice.createdAt,
          VIEWS: notice.views || 0
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

  const renderPagination = () => {
    const pages = [];
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);

    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(p)}
        >
          {p}
        </button>
      );
    }

    return (
      <>
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          ‹
        </button>
        {pages}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          ›
        </button>
      </>
    );
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
        {/* 통계 카드 */}
        <section className="admin-stats">
          <article className="stat-card">
            <div className="stat-label">전체 공지사항</div>
            <div className="stat-main">
              <div className="stat-value">{stats.total}</div>
              <span className="stat-chip">총 게시물</span>
              <div className="stat-icon">📢</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">총 조회수</div>
            <div className="stat-main">
              <div className="stat-value">{stats.totalViews}</div>
              <span className="stat-chip">누적 조회</span>
              <div className="stat-icon">👁️</div>
            </div>
          </article>
        </section>

        {/* 검색 / 필터 카드 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">검색 및 필터</div>
              <div className="admin-card-sub">
                제목, 내용으로 검색하거나 카테고리를 선택해 결과를 좁혀볼 수 있습니다.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-outline btn" onClick={handleReset}>
                초기화
              </button>
              <button type="button" className="btn" onClick={() => setShowCreateModal(true)}>
                + 새 공지사항
              </button>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="filter-grid">
              <div className="form-group">
                <label className="form-label">통합 검색</label>
                <input
                  type="text"
                  className="input"
                  placeholder="제목 / 내용"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                  <option value="NOTICE">공지</option>
                  <option value="IMPORTANT">중요</option>
                  <option value="UPDATE">업데이트</option>
                  <option value="EVENT">이벤트</option>
                </select>
              </div>
              <div className="filter-actions">
                <button className="btn" type="button" onClick={applyFilter}>
                  🔍 검색
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* 공지사항 목록 카드 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">
                공지사항 목록
                <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '4px' }}>
                  ({total}개)
                </span>
              </div>
              <div className="admin-card-sub">
                최신순으로 정렬됩니다. 상세보기에서 개별 공지사항의 모든 정보를 확인할 수 있습니다.
              </div>
            </div>
            <span className="admin-badge-muted">
              카테고리별, 상태별 필터 기능 제공
            </span>
          </div>

          <div className="table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '48px' }}>No</th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>조회수</th>
                    <th>등록일</th>
                    <th className="text-center" style={{ width: '140px' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((n, idx) => (
                    <tr key={n.NOTICE_ID}>
                      <td className="text-center">{startIdx + idx + 1}</td>
                      <td>{n.TITLE}</td>
                      <td>{getCategoryPill(n.CATEGORY)}</td>
                      <td>{n.VIEWS}</td>
                      <td>{formatDate(n.CREATED_AT)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn-sm primary"
                          onClick={() => handleDetailClick(n.NOTICE_ID)}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div>
                <span>
                  {total === 0 ? '0개 중 0–0개' : `${total}개 중 ${startIdx + 1}–${endIdx}개`}
                </span>
              </div>
              <div className="pagination">
                {renderPagination()}
              </div>
            </div>
          </div>
        </section>
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
              <div className="form-group">
                <label className="form-label">제목</label>
                <input
                  type="text"
                  className="input"
                  placeholder="공지사항 제목을 입력하세요"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">카테고리</label>
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
                      <option value="NOTICE">공지</option>
                      <option value="IMPORTANT">중요</option>
                      <option value="UPDATE">업데이트</option>
                      <option value="EVENT">이벤트</option>
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

export default Notice;
