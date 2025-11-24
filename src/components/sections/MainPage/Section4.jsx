import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotices } from "../../../utils/noticeApi";
import { checkSession } from "../../../utils/memberApi";

// 건강정보 하드코딩 데이터
const healthInfoData = [
  {
    id: 1,
    title: "겨울철 심혈관 질환 예방법",
    description: "추운 날씨에 주의해야 할 심장 건강 관리"
  },
  {
    id: 2,
    title: "독감 예방 접종 안내",
    description: "2025-2026 절기 독감 예방접종"
  },
  {
    id: 3,
    title: "암 조기 검진의 중요성",
    description: "정기 검진으로 지키는 건강"
  },
  {
    id: 4,
    title: "척추 건강 관리법",
    description: "바른 자세와 생활 습관"
  }
];

function InfoSection() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getAllNotices();

        // 최신 5개만 가져오기
        setNotices(data.slice(0, 5));
      } catch (error) {
        console.error('공지사항 로딩 실패:', error);
        // 에러 발생 시 빈 배열 유지
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 날짜 포맷 함수 (YYYY-MM-DD -> YYYY.MM.DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  // 공지사항 더보기 클릭
  const handleNoticeMore = async () => {
    try {
      const sessionData = await checkSession();
      if (!sessionData.loggedIn) {
        alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
        navigate('/login');
        return;
      }
      navigate('/notice');
    } catch (error) {
      console.error('세션 확인 실패:', error);
      alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
      navigate('/login');
    }
  };

  // 공지사항 클릭 시 상세 페이지로 이동
  const handleNoticeClick = async (noticeId) => {
    try {
      const sessionData = await checkSession();
      if (!sessionData.loggedIn) {
        alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
        navigate('/login');
        return;
      }
      navigate(`/notice?id=${noticeId}`);
    } catch (error) {
      console.error('세션 확인 실패:', error);
      alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
      navigate('/login');
    }
  };

  return (
    <section id="info" className="section section-info">
      <div className="info-container">
        <div className="info-box">
          <h2>
            공지사항
            <span className="more-btn" onClick={handleNoticeMore} style={{ cursor: 'pointer' }}>더보기 +</span>
          </h2>
          <ul className="notice-list">
            {loading ? (
              <li className="notice-item">
                <span className="notice-title">로딩 중...</span>
              </li>
            ) : notices.length > 0 ? (
              notices.map((notice) => (
                <li
                  key={notice.noticeId}
                  className="notice-item"
                  onClick={() => handleNoticeClick(notice.noticeId)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="notice-title">{notice.title}</span>
                  <span className="notice-date">{formatDate(notice.createdAt)}</span>
                </li>
              ))
            ) : (
              <li className="notice-item">
                <span className="notice-title">등록된 공지사항이 없습니다.</span>
              </li>
            )}
          </ul>
        </div>

        <div className="info-box">
          <h2>
            건강정보
            <span className="more-btn">더보기 +</span>
          </h2>
          <div className="health-grid">
            {healthInfoData.map((info) => (
              <div key={info.id} className="health-card">
                <h4>{info.title}</h4>
                <p>{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
