import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import { getAllNotices, incrementNoticeView } from '../../utils/noticeApi';
import { checkSession } from '../../utils/memberApi';
import NoticeDetailModal from '../../components/common/NoticeDetailModal';
import './Notice.css';

function Notice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const itemsPerPage = 10;

  // 컴포넌트 마운트 시 로그인 체크 및 공지사항 데이터 가져오기
  useEffect(() => {
    const checkLoginAndFetchNotices = async () => {
      try {
        const sessionData = await checkSession();
        if (!sessionData.loggedIn) {
          alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
          navigate('/login');
          return;
        }
        setIsAdmin(sessionData.admin_YN === 'Y');

        setLoading(true);
        const data = await getAllNotices();
        setNotices(data);
        setFilteredNotices(data);
        setError(null);

        // 네비게이션 state에 모달을 열 ID가 있는지 확인
        const noticeIdToOpen = location.state?.openModalForId;
        if (noticeIdToOpen) {
          const noticeToOpen = data.find(n => n.noticeId === noticeIdToOpen);
          if (noticeToOpen) {
            // 모달을 직접 엽니다.
            setSelectedNotice(noticeToOpen);
            setIsDetailModalOpen(true);
            
            // 조회수 증가 로직
            if (sessionData.admin_YN !== 'Y') {
              await incrementNoticeView(noticeToOpen.noticeId);
              // 로컬 상태 업데이트
              setNotices(prevNotices =>
                prevNotices.map(n =>
                  n.noticeId === noticeIdToOpen
                    ? { ...n, viewCount: (n.viewCount || 0) + 1 }
                    : n
                )
              );
              setSelectedNotice(prev => ({
                ...prev,
                viewCount: (prev.viewCount || 0) + 1
              }));
            }
          }
          // 새로고침 시 모달이 다시 뜨지 않도록 state를 초기화합니다.
          navigate(location.pathname, { replace: true, state: {} });
        }
      } catch (err) {
        console.error('공지사항 로딩 실패:', err);
        if (err.message && err.message.includes('세션')) {
          alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
          navigate('/login');
        } else {
          setError('공지사항을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetchNotices();
  }, [navigate, location.state]);

  // 카테고리 필터 적용
  useEffect(() => {
    if (categoryFilter === 'ALL') {
      setFilteredNotices(notices);
    } else {
      setFilteredNotices(notices.filter(notice => notice.category === categoryFilter));
    }
    setCurrentPage(1);
  }, [categoryFilter, notices]);

  // 공지사항 클릭 시 모달 열기 및 조회수 증가
  const handleNoticeClick = async (notice) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);

    if (!isAdmin) {
      try {
        await incrementNoticeView(notice.noticeId);
        const updatedNotices = notices.map(n =>
          n.noticeId === notice.noticeId ? { ...n, viewCount: (n.viewCount || 0) + 1 } : n
        );
        setNotices(updatedNotices);
        setSelectedNotice(prev => ({ ...prev, viewCount: (prev.viewCount || 0) + 1 }));
      } catch (error) {
        console.error('조회수 증가 중 오류:', error);
      }
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  // 카테고리 pill 렌더링
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

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <div className="notice-page-wrapper">
      <Header />
      <div className="page">
        <h1>공지사항</h1>
        <p className="notice-subtitle">HealBot의 새로운 소식과 업데이트를 확인하세요.</p>

        <div className="notice-container">
          {/* 카테고리 탭 */}
          <div className="notice-tabs">
            <button
              className={`notice-tab ${categoryFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('ALL')}
            >
              전체
            </button>
            <button
              className={`notice-tab ${categoryFilter === 'IMPORTANT' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('IMPORTANT')}
            >
              중요
            </button>
            <button
              className={`notice-tab ${categoryFilter === 'UPDATE' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('UPDATE')}
            >
              업데이트
            </button>
            <button
              className={`notice-tab ${categoryFilter === 'EVENT' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('EVENT')}
            >
              이벤트
            </button>
          </div>

          {loading ? (
            <div className="notice-loading">공지사항을 불러오는 중...</div>
          ) : error ? (
            <div className="notice-error">{error}</div>
          ) : filteredNotices.length === 0 ? (
            <div className="notice-empty">등록된 공지사항이 없습니다.</div>
          ) : (
            <>
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
                    {currentNotices.map((notice) => (
                      <tr
                        key={notice.noticeId}
                        onClick={() => handleNoticeClick(notice)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{getCategoryPill(notice.category)}</td>
                        <td className="notice-title-cell">{notice.title}</td>
                        <td>{formatDate(notice.createdAt)}</td>
                        <td>{notice.viewCount?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이징 */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(1)}
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
                      onClick={() => paginate(number)}
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
                    onClick={() => paginate(totalPages)}
                    className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                    disabled={currentPage === totalPages}
                    title="마지막 페이지">
                    끝 페이지
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <NoticeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        notice={selectedNotice}
      />

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Notice;
