import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import { getAllNotices } from '../../utils/noticeApi';
import './Notice.css';

function Notice() {
  const [searchParams] = useSearchParams();
  const [notices, setNotices] = useState([]);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getAllNotices();
        setNotices(data);
        setError(null);

        // URL 파라미터에서 noticeId 가져오기
        const noticeIdFromUrl = searchParams.get('id');
        if (noticeIdFromUrl) {
          const noticeId = parseInt(noticeIdFromUrl);
          setExpandedNoticeId(noticeId);

          // 해당 공지사항으로 스크롤
          setTimeout(() => {
            const element = document.getElementById(`notice-${noticeId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      } catch (err) {
        console.error('공지사항 로딩 실패:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [searchParams]);

  // 공지사항 클릭 시 확장/축소 토글
  const toggleNotice = (noticeId) => {
    setExpandedNoticeId(expandedNoticeId === noticeId ? null : noticeId);
  };

  const getTypeClass = (type) => {
    const typeMap = {
      '공지': 'notice',
      '업데이트': 'update',
      '점검': 'maintenance',
      '이벤트': 'event'
    };
    return typeMap[type] || 'notice';
  };

  return (
    <div className="notice-page-wrapper">
      <Header />
      <div className="page">
        <h1>공지사항</h1>
        <p className="notice-subtitle">HealBot의 새로운 소식과 업데이트를 확인하세요.</p>

        <div className="notice-container">
          {loading ? (
            <div className="notice-loading">공지사항을 불러오는 중...</div>
          ) : error ? (
            <div className="notice-error">{error}</div>
          ) : notices.length === 0 ? (
            <div className="notice-empty">등록된 공지사항이 없습니다.</div>
          ) : (
            <div className="notice-list">
              {notices.map((notice) => (
                <div key={notice.noticeId} id={`notice-${notice.noticeId}`} className="notice-accordion-item">
                  <div
                    className="notice-item"
                    onClick={() => toggleNotice(notice.noticeId)}
                  >
                    <span className={`notice-type-badge ${getTypeClass(notice.category)}`}>
                      {notice.category}
                    </span>
                    <div className="notice-item-content">
                      <h3 className="notice-item-title">{notice.title}</h3>
                      <div className="notice-item-meta">
                        <span className="notice-date">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
                        <span className="notice-views">조회 {notice.views?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <span className={`notice-toggle-icon ${expandedNoticeId === notice.noticeId ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                  {expandedNoticeId === notice.noticeId && (
                    <div className="notice-expanded-content">
                      <div className="notice-detail-content">
                        {notice.content.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Notice;
