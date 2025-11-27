import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotices } from "../../../utils/noticeApi";
import { checkSession } from "../../../utils/memberApi";
import { seasonalHealthList } from "../../../data/seasonalHealthData";

function InfoSection({ onHealthInfoClick }) {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const data = await getAllNotices();
        setNotices(data.slice(0, 5));
      } catch (error) {
        console.error('공지사항 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0].replace(/-/g, '.');
  };

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

  const handleNoticeClick = async (noticeId) => {
    try {
      const sessionData = await checkSession();
      if (!sessionData.loggedIn) {
        alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
        navigate('/login');
        return;
      }
      navigate('/notice', { state: { openModalForId: noticeId } });
    } catch (error) {
      console.error('세션 확인 실패:', error);
      alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
      navigate('/login');
    }
  };

  const seasonalData = useMemo(() => {
    const month = new Date().getMonth();
    let season;
    if (month >= 2 && month <= 4) {
      season = "봄"; // March, April, May
    } else if (month >= 5 && month <= 7) {
      season = "여름"; // June, July, August
    } else if (month >= 8 && month <= 10) {
      season = "가을"; // September, October, November
    } else {
      season = "겨울"; // December, January, February
    }
    return seasonalHealthList.filter(item => item.category === season).slice(0, 4);
  }, []);

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
            현재 유행하는 질병
            <span onClick={() => navigate('/seasonal-health')} className="more-btn" style={{ cursor: 'pointer' }}>더보기 +</span>
          </h2>
          <div className="health-grid">
            {seasonalData.map((info) => (
              <div key={info.id} className="health-card" onClick={() => onHealthInfoClick(info)}>
                <div className="health-card-image" style={{backgroundImage: `url(${info.image})`}}></div>
                <div className="health-card-content">
                  <h4>{info.name}</h4>
                  <p>{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
