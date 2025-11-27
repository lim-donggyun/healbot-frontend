import React from 'react';
import './NoticeDetailModal.css';

// Helper functions copied from src/pages/service/Notice.jsx
const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0].replace(/-/g, '.');
};

const getCategoryPill = (category) => {
  let label = "";
  let cls = "";

  switch(category) {
    case "NOTICE":
      label = "공지";
      cls = "notice";
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
      label = category || "공지";
      cls = "notice";
  }

  return (
    <span className={`category-pill ${cls}`}>
      <span className="category-dot"></span>
      {label}
    </span>
  );
};

const NoticeDetailModal = ({ isOpen, onClose, notice }) => {
  if (!isOpen || !notice) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>공지사항 상세</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">카테고리</div>
                <div className="detail-value">{getCategoryPill(notice.category)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">등록일</div>
                <div className="detail-value">{formatDate(notice.createdAt)}</div>
              </div>
              <div className="detail-item full-width">
                <div className="detail-label">제목</div>
                <div className="detail-value">{notice.title}</div>
              </div>
              <div className="detail-item full-width">
                <div className="detail-label">내용</div>
                <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>
                  {notice.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
