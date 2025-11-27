import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './Dashboard.css';

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [penaltyReason, setPenaltyReason] = useState('');

  const rowsPerPage = 10;

  // 상태 라벨 변환
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "대기중";
      case "RESOLVED": return "처리완료";
      case "REJECTED": return "반려";
      default: return status;
    }
  };

  // 대상 유형 라벨 변환
  const getTargetTypeLabel = (type) => {
    switch (type) {
      case "POST": return "게시글";
      case "COMMENT": return "댓글";
      default: return type;
    }
  };

  // 신고 사유 라벨 변환
  const getReasonLabel = (reason) => {
    switch (reason) {
      case "SPAM": return "스팸";
      case "ABUSE": return "욕설/비방";
      case "INAPPROPRIATE": return "부적절한 내용";
      case "ETC": return "기타";
      default: return reason;
    }
  };

  // 상태 pill 스타일
  const getStatusPill = (status) => {
    let label = getStatusLabel(status);
    let cls = "";

    switch (status) {
      case "PENDING":
        cls = "important";
        break;
      case "RESOLVED":
        cls = "event";
        break;
      case "REJECTED":
        cls = "";
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

  // 컴포넌트 마운트 시 신고 데이터 로드
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (targetTypeFilter) params.append('targetType', targetTypeFilter);

        const response = await fetch(`/react/api/community/reports?${params.toString()}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('신고 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error('신고 데이터 로드 실패:', error);
        alert('신고 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [statusFilter, targetTypeFilter]);

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
    setStatusFilter('');
    setTargetTypeFilter('');
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = async (reportId) => {
    try {
      const response = await fetch(`/react/api/community/reports/${reportId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('신고 상세를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setSelectedReport(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('신고 상세 조회 실패:', error);
      alert('신고 상세를 불러오는데 실패했습니다.');
    }
  };

  // 제재사유 입력 모달 열기
  const handleOpenPenaltyModal = () => {
    setPenaltyReason('');
    setIsPenaltyModalOpen(true);
  };

  // 제재사유 제출
  const handleSubmitPenalty = async () => {
    if (!selectedReport) return;

    if (!penaltyReason.trim()) {
      alert('제재사유를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/react/api/community/reports/${selectedReport.reportId}/penalty`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ penaltyReason: penaltyReason }),
      });

      if (!response.ok) {
        throw new Error('제재사유 등록에 실패했습니다.');
      }

      alert('제재사유가 등록되었습니다.');

      // 목록 새로고침
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);

      const listResponse = await fetch(`/react/api/community/reports?${params.toString()}`, {
        method: 'GET',
      });
      const data = await listResponse.json();
      setReports(data);
      setFilteredReports(data);
      setIsPenaltyModalOpen(false);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('제재사유 등록 실패:', error);
      alert('제재사유 등록 중 오류가 발생했습니다.');
    }
  };

  // 신고 삭제
  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    const confirmed = window.confirm(`정말로 이 신고를 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/react/api/community/reports/${selectedReport.reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('신고 삭제에 실패했습니다.');
      }

      alert('신고가 삭제되었습니다.');

      // 목록 새로고침
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);

      const listResponse = await fetch(`/react/api/community/reports?${params.toString()}`, {
        method: 'GET',
      });
      const data = await listResponse.json();
      setReports(data);
      setFilteredReports(data);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('신고 삭제 실패:', error);
      alert('신고 삭제 중 오류가 발생했습니다.');
    }
  };

  // 페이징
  const total = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredReports.slice(startIdx, endIdx);

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
        {/* 신고 관리 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">신고 관리</div>
              <div className="admin-card-sub">
                사용자가 신고한 게시글과 댓글을 조회하고 관리할 수 있습니다.
              </div>
            </div>
          </div>

          {/* 검색 필터 */}
          <div className="filter-grid" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">상태</label>
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">전체</option>
                <option value="PENDING">대기중</option>
                <option value="RESOLVED">처리완료</option>
                <option value="REJECTED">반려</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">대상 유형</label>
              <select
                className="select"
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
              >
                <option value="">전체</option>
                <option value="POST">게시글</option>
                <option value="COMMENT">댓글</option>
              </select>
            </div>

            <div className="filter-actions" style={{ alignSelf: 'flex-end' }}>
              <button className="btn-outline btn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>

          {/* 신고 테이블 */}
          <div className="table-wrapper" style={{ marginTop: '20px' }}>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>상태</th>
                    <th style={{ width: '10%' }}>대상</th>
                    <th style={{ width: '15%' }}>신고 사유</th>
                    <th style={{ width: '35%' }}>신고 내용</th>
                    <th style={{ width: '15%' }}>신고자</th>
                    <th style={{ width: '15%' }}>신고일</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        등록된 신고가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((report) => (
                      <tr
                        key={report.reportId}
                        onClick={() => handleDetailClick(report.reportId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{getStatusPill(report.status)}</td>
                        <td>{getTargetTypeLabel(report.targetType)}</td>
                        <td>{getReasonLabel(report.reasonType)}</td>
                        <td style={{
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {report.detail || '-'}
                        </td>
                        <td>{report.reporterName || report.reporterId}</td>
                        <td>{formatDate(report.createdAt)}</td>
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

      {/* 신고 상세 모달 */}
      {isDetailModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>신고 상세</h3>
              <button
                className="modal-close"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>신고 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">신고 ID</div>
                    <div className="detail-value">{selectedReport.reportId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">상태</div>
                    <div className="detail-value">{getStatusPill(selectedReport.status)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">대상 유형</div>
                    <div className="detail-value">{getTargetTypeLabel(selectedReport.targetType)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">신고자</div>
                    <div className="detail-value">{selectedReport.reporterName || selectedReport.reporterId}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">신고 사유</div>
                    <div className="detail-value">{getReasonLabel(selectedReport.reasonType)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">신고일</div>
                    <div className="detail-value">{formatDate(selectedReport.createdAt)}</div>
                  </div>
                  <div className="detail-item full-width">
                    <div className="detail-label">상세 내용</div>
                    <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedReport.detail || '-'}
                    </div>
                  </div>
                  {selectedReport.penaltyReason && (
                    <div className="detail-item full-width">
                      <div className="detail-label">제재사유</div>
                      <div className="detail-value" style={{ whiteSpace: 'pre-wrap', color: '#e74c3c', fontWeight: 'bold' }}>
                        {selectedReport.penaltyReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>신고 대상</h4>
                <div className="detail-grid">
                  {selectedReport.targetType === 'POST' && (
                    <>
                      <div className="detail-item">
                        <div className="detail-label">게시글 ID</div>
                        <div className="detail-value">{selectedReport.postId}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">작성자</div>
                        <div className="detail-value">{selectedReport.targetAuthorId}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">게시글 제목</div>
                        <div className="detail-value">{selectedReport.postTitle || '-'}</div>
                      </div>
                    </>
                  )}
                  {selectedReport.targetType === 'COMMENT' && (
                    <>
                      <div className="detail-item">
                        <div className="detail-label">댓글 ID</div>
                        <div className="detail-value">{selectedReport.commentId}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">작성자</div>
                        <div className="detail-value">{selectedReport.targetAuthorId}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">댓글 내용</div>
                        <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedReport.commentContent || '-'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedReport.status === 'PENDING' && (
                <button className="btn" onClick={handleOpenPenaltyModal}>
                  제재사유 입력
                </button>
              )}
              <button className="btn btn-danger" onClick={handleDeleteReport}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제재사유 입력 모달 */}
      {isPenaltyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPenaltyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>제재사유 입력</h3>
              <button
                className="modal-close"
                onClick={() => setIsPenaltyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">제재사유를 입력하세요</label>
                <textarea
                  className="textarea"
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  rows="6"
                  placeholder="제재사유를 입력하세요..."
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                * 제재사유를 입력하면 신고가 자동으로 처리완료 상태로 변경됩니다.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline btn" onClick={() => setIsPenaltyModalOpen(false)}>
                취소
              </button>
              <button className="btn" onClick={handleSubmitPenalty}>
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Report;
