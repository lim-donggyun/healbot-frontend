import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../../../pages/MainPage.css";
import "./Report.css";

const Report = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [reply, setReply] = useState("");

  const rowsPerPage = 5;

  // 상태 라벨 변환
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "RESOLVED":
        return "처리완료";
      case "REJECTED":
        return "반려";
      default:
        return status;
    }
  };

  // 대상 유형 라벨 변환
  const getTargetTypeLabel = (type) => {
    switch (type) {
      case "POST":
        return "게시글";
      case "COMMENT":
        return "댓글";
      default:
        return type;
    }
  };

  // 신고 사유 라벨 변환
  const getReasonLabel = (reason) => {
    if (!reason) return "-";
    const upperReason = reason.toUpperCase();
    switch (upperReason) {
      case "SPAM":
        return "스팸/광고";
      case "ABUSE":
        return "욕설/비방";
      case "PERSONAL":
        return "개인정보 노출";
      case "FALSE":
        return "허위 정보";
      case "ETC":
        return "기타";
      default:
        return reason;
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

  // 게시글/댓글 상태 pill 스타일
  const getContentStatusPill = (targetType, postStatus, commentStatus) => {
    if (targetType === "POST") {
      const isHidden = postStatus === "HIDDEN";
      return (
        <span className={`category-pill ${isHidden ? "" : "event"}`}>
          <span className="category-dot"></span>
          {isHidden ? "숨김" : "공개"}
        </span>
      );
    } else if (targetType === "COMMENT") {
      const isHidden = commentStatus === "HIDDEN";
      return (
        <span className={`category-pill ${isHidden ? "" : "event"}`}>
          <span className="category-dot"></span>
          {isHidden ? "숨김" : "공개"}
        </span>
      );
    }
    return <span style={{ color: "var(--muted)" }}>-</span>;
  };

  // 컴포넌트 마운트 시 신고 데이터 로드
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (targetTypeFilter) params.append("targetType", targetTypeFilter);

        const response = await fetch(`/react/api/community/reports?${params.toString()}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("신고 목록을 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error("신고 데이터 로드 실패:", error);
        alert("신고 데이터를 불러오는데 실패했습니다.");
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
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  };

  // 초기화
  const handleReset = () => {
    setStatusFilter("");
    setTargetTypeFilter("");
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = async (reportId) => {
    try {
      const response = await fetch(`/react/api/community/reports/${reportId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("신고 상세를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setSelectedReport(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("신고 상세 조회 실패:", error);
      alert("신고 상세를 불러오는데 실패했습니다.");
    }
  };

  // 제재사유 입력 모달 열기
  const handleOpenPenaltyModal = () => {
    // 기존 제재사유가 있으면 그것을 초기값으로 설정
    setReply(selectedReport?.reply || "");
    setIsPenaltyModalOpen(true);
  };

  // 답변 제출
  const handleSubmitPenalty = async () => {
    if (!selectedReport) return;

    if (!reply.trim()) {
      alert("답변을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`/react/api/community/reports/${selectedReport.reportId}/penalty`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reply: reply }),
      });

      if (!response.ok) {
        throw new Error("답변 등록에 실패했습니다.");
      }

      const isUpdate = selectedReport?.reply ? true : false;
      alert(isUpdate ? "답변이 수정되었습니다." : "답변이 등록되었습니다.");

      // 목록 새로고침
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (targetTypeFilter) params.append("targetType", targetTypeFilter);

      const listResponse = await fetch(`/react/api/community/reports?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await listResponse.json();
      setReports(data);
      setFilteredReports(data);
      setIsPenaltyModalOpen(false);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("제재사유 등록 실패:", error);
      alert("제재사유 등록 중 오류가 발생했습니다.");
    }
  };

  // 신고 삭제
  const handleDeleteReport = async () => {
    if (!selectedReport) return;

    const confirmed = window.confirm(`정말로 이 신고를 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/react/api/community/reports/${selectedReport.reportId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("신고 삭제에 실패했습니다.");
      }

      alert("신고가 삭제되었습니다.");

      // 목록 새로고침
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (targetTypeFilter) params.append("targetType", targetTypeFilter);

      const listResponse = await fetch(`/react/api/community/reports?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await listResponse.json();
      setReports(data);
      setFilteredReports(data);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("신고 삭제 실패:", error);
      alert("신고 삭제 중 오류가 발생했습니다.");
    }
  };

  // 게시글/댓글 숨김/해제 토글 (모달용)
  const handleToggleVisibility = async () => {
    if (!selectedReport) return;

    let url = "";
    let targetName = "";
    let isHidden = false;

    if (selectedReport.targetType === "POST") {
      url = `/react/api/community/posts/${selectedReport.postId}/toggle-visibility`;
      targetName = "게시글";
      isHidden = selectedReport.postStatus === "HIDDEN";
    } else if (selectedReport.targetType === "COMMENT") {
      url = `/react/api/community/comments/${selectedReport.commentId}/toggle-visibility`;
      targetName = "댓글";
      isHidden = selectedReport.commentStatus === "HIDDEN";
    } else {
      return;
    }

    const action = isHidden ? "숨김 해제" : "숨김";
    const confirmed = window.confirm(`이 ${targetName}을 ${action} 처리하시겠습니까?`);
    if (!confirmed) return;

    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`${targetName} ${action}에 실패했습니다.`);
      }

      // 숨김 처리(ACTIVE -> HIDDEN)를 한 경우, 신고 상태를 "처리완료"로 변경
      if (!isHidden) {
        const statusResponse = await fetch(`/react/api/community/reports/${selectedReport.reportId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "RESOLVED" }),
        });

        if (!statusResponse.ok) {
          console.error("신고 상태 업데이트 실패");
        }
      }
      // 숨김 해제(HIDDEN -> ACTIVE)를 한 경우, 신고 상태를 "대기중"으로 변경
      else if (isHidden) {
        const statusResponse = await fetch(`/react/api/community/reports/${selectedReport.reportId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "PENDING" }),
        });

        if (!statusResponse.ok) {
          console.error("신고 상태 업데이트 실패");
        }
      }

      alert(`${targetName}이 ${action} 처리되었습니다.`);

      // 목록 새로고침
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (targetTypeFilter) params.append("targetType", targetTypeFilter);

      const listResponse = await fetch(`/react/api/community/reports?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await listResponse.json();
      setReports(data);
      setFilteredReports(data);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error(`${targetName} ${action} 실패:`, error);
      alert(`${targetName} ${action} 중 오류가 발생했습니다.`);
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
      <main className="admin-page admin-report-page">
        <div className="loading-container" style={{ gridColumn: "1 / -1" }}>
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
        {/* 신고 관리 */}
        <div className="report-management">
          <div className="hospital-header">
            <h2>
              검색된 신고 <span className="hospital-count">{filteredReports.length}</span>개
            </h2>
          </div>

          <div className="report-search-filters">
            <div className="filter-group">
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">전체 상태</option>
                <option value="PENDING">대기중</option>
                <option value="RESOLVED">처리완료</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}>
                <option value="">전체 유형</option>
                <option value="POST">게시글</option>
                <option value="COMMENT">댓글</option>
              </select>
            </div>
          </div>

          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>상태</th>
                  <th style={{ width: "10%" }}>유형</th>
                  <th style={{ width: "12%" }}>숨김 상태</th>
                  <th style={{ width: "12%" }}>신고자</th>
                  <th style={{ width: "13%" }}>신고 사유</th>
                  <th style={{ width: "28%" }}>신고 내용</th>
                  <th style={{ width: "15%" }}>신고일</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                      등록된 신고가 없습니다.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((report) => (
                    <tr
                      key={report.reportId}
                      onClick={() => handleDetailClick(report.reportId)}
                      style={{ cursor: "pointer" }}>
                      <td>{getStatusPill(report.status)}</td>
                      <td>{getTargetTypeLabel(report.targetType)}</td>
                      <td>{getContentStatusPill(report.targetType, report.postStatus, report.commentStatus)}</td>
                      <td>{report.reporterName || report.reporterId}</td>
                      <td>{getReasonLabel(report.reasonType)}</td>
                      <td
                        style={{
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                        {report.detail || "-"}
                      </td>
                      <td>{formatDate(report.createdAt)}</td>
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

      {/* 신고 상세 모달 */}
      {isDetailModalOpen && selectedReport && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>신고 상세</h3>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
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
                    <div className="detail-label">유형</div>
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
                    <div className="detail-value" style={{ whiteSpace: "pre-wrap" }}>
                      {selectedReport.detail || "-"}
                    </div>
                  </div>
                  {selectedReport.reply && (
                    <div className="detail-item full-width">
                      <div className="detail-label">관리자 답변</div>
                      <div
                        className="detail-value"
                        style={{ whiteSpace: "pre-wrap", color: "#e74c3c", fontWeight: "bold" }}>
                        {selectedReport.reply}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>신고 대상</h4>
                <div className="detail-grid">
                  {selectedReport.targetType === "POST" && (
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
                        <div className="detail-value">{selectedReport.postTitle || "-"}</div>
                      </div>
                    </>
                  )}
                  {selectedReport.targetType === "COMMENT" && (
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
                        <div className="detail-value" style={{ whiteSpace: "pre-wrap" }}>
                          {selectedReport.commentContent || "-"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={handleOpenPenaltyModal}>
                {selectedReport.reply ? "답변 수정" : "답변 입력"}
              </button>
              {(selectedReport.targetType === "POST" || selectedReport.targetType === "COMMENT") && (
                <button
                  className="btn"
                  style={{
                    backgroundColor:
                      selectedReport.targetType === "POST"
                        ? selectedReport.postStatus === "HIDDEN"
                          ? "#27ae60"
                          : "#f39c12"
                        : selectedReport.commentStatus === "HIDDEN"
                        ? "#27ae60"
                        : "#f39c12",
                  }}
                  onClick={handleToggleVisibility}>
                  {selectedReport.targetType === "POST"
                    ? selectedReport.postStatus === "HIDDEN"
                      ? "게시글 숨김 해제"
                      : "게시글 숨김"
                    : selectedReport.commentStatus === "HIDDEN"
                    ? "댓글 숨김 해제"
                    : "댓글 숨김"}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h3>{selectedReport?.reply ? "답변 수정" : "답변 입력"}</h3>
              <button className="modal-close" onClick={() => setIsPenaltyModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">답변을 입력하세요</label>
                <textarea
                  className="textarea"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows="6"
                  placeholder="답변을 입력하세요..."
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-outline btn" onClick={() => setIsPenaltyModalOpen(false)}>
                취소
              </button>
              <button className="btn" onClick={handleSubmitPenalty}>
                {selectedReport?.reply ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Report;
