import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './Report.css';
import {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  searchReviews,
} from '../../../utils/reviewApi';

const Review = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    score: '',
    content: '',
  });

  const rowsPerPage = 10;

  // 평점 표시
  const renderStars = (score) => {
    return '⭐'.repeat(Math.floor(score));
  };

  // 컴포넌트 마운트 시 리뷰 데이터 로드
  useEffect(() => {
    fetchReviews();
  }, []);

  // 리뷰 목록 조회
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
      applyFilters(data, hospitalFilter, scoreFilter);
    } catch (error) {
      console.error('리뷰 데이터 로드 실패:', error);
      alert('리뷰 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 필터 적용
  const applyFilters = (data, hospital, score) => {
    let filtered = data;

    if (hospital.trim() !== '') {
      filtered = filtered.filter((review) =>
        review.hospitalId?.toLowerCase().includes(hospital.toLowerCase())
      );
    }

    if (score !== '') {
      filtered = filtered.filter((review) => review.score === parseInt(score));
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  // 병원 검색
  const handleHospitalFilter = (e) => {
    const value = e.target.value;
    setHospitalFilter(value);
    applyFilters(reviews, value, scoreFilter);
  };

  // 평점 검색
  const handleScoreFilter = (e) => {
    const value = e.target.value;
    setScoreFilter(value);
    applyFilters(reviews, hospitalFilter, value);
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // 초기화
  const handleReset = () => {
    setHospitalFilter('');
    setScoreFilter('');
    setFilteredReviews(reviews);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = async (reviewId) => {
    try {
      const data = await getReviewById(reviewId);
      setSelectedReview(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('리뷰 상세 조회 실패:', error);
      alert('리뷰 상세를 불러오는데 실패했습니다.');
    }
  };

  // 수정 모달 열기
  const handleEditClick = () => {
    setEditFormData({
      score: selectedReview.score,
      content: selectedReview.content || '',
    });
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  // 수정 폼 입력 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 리뷰 수정 제출
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      await updateReview(selectedReview.reviewId, editFormData);
      alert('리뷰가 수정되었습니다.');
      setIsEditModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      alert('리뷰 수정 중 오류가 발생했습니다.');
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    const confirmed = window.confirm(`정말로 이 리뷰를 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await deleteReview(selectedReview.reviewId);
      alert('리뷰가 삭제되었습니다.');
      setIsDetailModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 페이징
  const total = filteredReviews.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredReviews.slice(startIdx, endIdx);

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
      <main className="admin-page admin-report-page">
        <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">데이터를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page admin-report-page">
      <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 리뷰 관리 컨텐츠 */}
        <section className="admin-card">
          {/* 검색 필터 */}
          <div className="filter-grid" style={{ marginTop: '0' }}>
            <div className="form-group">
              <label className="form-label">병원ID</label>
              <input
                type="text"
                className="input"
                placeholder="병원ID 검색"
                value={hospitalFilter}
                onChange={handleHospitalFilter}
              />
            </div>

            <div className="form-group">
              <label className="form-label">평점</label>
              <select
                className="select"
                value={scoreFilter}
                onChange={handleScoreFilter}
              >
                <option value="">전체</option>
                <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                <option value="4">⭐⭐⭐⭐ (4점)</option>
                <option value="3">⭐⭐⭐ (3점)</option>
                <option value="2">⭐⭐ (2점)</option>
                <option value="1">⭐ (1점)</option>
              </select>
            </div>

            <div className="filter-actions" style={{ alignSelf: 'flex-end' }}>
              <button className="btn-outline btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>

          {/* 리뷰 테이블 */}
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>리뷰ID</th>
                    <th style={{ width: '15%' }}>병원ID</th>
                    <th style={{ width: '12%' }}>회원ID</th>
                    <th style={{ width: '10%' }}>평점</th>
                    <th style={{ width: '38%' }}>내용</th>
                    <th style={{ width: '15%' }}>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        등록된 리뷰가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((review) => (
                      <tr
                        key={review.reviewId}
                        onClick={() => handleDetailClick(review.reviewId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{review.reviewId}</td>
                        <td>{review.hospitalId}</td>
                        <td>{review.memberId}</td>
                        <td>{renderStars(review.score)}</td>
                        <td style={{
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {review.content || '-'}
                        </td>
                        <td>{formatDate(review.createdAt)}</td>
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

      {/* 리뷰 상세 모달 */}
      {isDetailModalOpen && selectedReview && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>리뷰 상세</h3>
              <button
                className="modal-close"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>리뷰 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">리뷰 ID</div>
                    <div className="detail-value">{selectedReview.reviewId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">병원 ID</div>
                    <div className="detail-value">{selectedReview.hospitalId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">회원 ID</div>
                    <div className="detail-value">{selectedReview.memberId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">평점</div>
                    <div className="detail-value">{renderStars(selectedReview.score)} ({selectedReview.score}점)</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">작성일</div>
                    <div className="detail-value">{formatDate(selectedReview.createdAt)}</div>
                  </div>
                  <div className="detail-item full-width">
                    <div className="detail-label">내용</div>
                    <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedReview.content || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                수정
              </button>
              <button className="btn btn-danger" onClick={handleDeleteReview}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && selectedReview && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>리뷰 수정</h3>
              <button
                className="modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="detail-section">
                  <h4>리뷰 정보</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <div className="detail-label">리뷰 ID</div>
                      <div className="detail-value">{selectedReview.reviewId}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">병원 ID</div>
                      <div className="detail-value">{selectedReview.hospitalId}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">회원 ID</div>
                      <div className="detail-value">{selectedReview.memberId}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">작성일</div>
                      <div className="detail-value">{formatDate(selectedReview.createdAt)}</div>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">평점 *</div>
                      <select
                        name="score"
                        className="select"
                        value={editFormData.score}
                        onChange={handleEditInputChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                      >
                        <option value="">평점 선택</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                        <option value="4">⭐⭐⭐⭐ (4점)</option>
                        <option value="3">⭐⭐⭐ (3점)</option>
                        <option value="2">⭐⭐ (2점)</option>
                        <option value="1">⭐ (1점)</option>
                      </select>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">내용 *</div>
                      <textarea
                        name="content"
                        className="input"
                        value={editFormData.content}
                        onChange={handleEditInputChange}
                        required
                        rows="6"
                        placeholder="리뷰 내용을 입력하세요"
                        style={{ width: '100%', resize: 'vertical', padding: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ marginRight: '10px' }}
                >
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  수정 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Review;
