import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotices } from "../../../utils/noticeApi";
import { getFeaturedDiseases, getDiseaseByName } from "../../../utils/diseasesApi";
import { checkSession } from "../../../utils/memberApi";
import { seasonalHealthList } from "../../../data/seasonalHealthData";

function InfoSection({ onHealthInfoClick }) {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [featuredDiseases, setFeaturedDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  // 드래그 방지
  useEffect(() => {
    document.body.style.setProperty('user-select', 'none', 'important');
    document.body.style.setProperty('-webkit-user-select', 'none', 'important');
  }, []);

  // Fetch notices and featured diseases
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch notices
        const noticeData = await getAllNotices();
        setNotices(noticeData.slice(0, 5));

        // Fetch featured diseases
        const featuredList = await getFeaturedDiseases();
        if (featuredList && featuredList.length > 0) {
          const diseaseDetailsPromises = featuredList.map((disease) => getDiseaseByName(disease.diseaseName));
          const diseaseDetails = await Promise.all(diseaseDetailsPromises);
          setFeaturedDiseases(diseaseDetails);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0].replace(/-/g, ".");
  };

  const handleNoticeMore = async () => {
    try {
      const sessionData = await checkSession();
      if (!sessionData.loggedIn) {
        alert("로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.");
        navigate("/login");
        return;
      }
      navigate("/notice");
    } catch (error) {
      console.error("세션 확인 실패:", error);
      alert("로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.");
      navigate("/login");
    }
  };

  const handleNoticeClick = async (noticeId) => {
    try {
      const sessionData = await checkSession();
      if (!sessionData.loggedIn) {
        alert("로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.");
        navigate("/login");
        return;
      }
      navigate("/notice", { state: { openModalForId: noticeId } });
    } catch (error) {
      console.error("세션 확인 실패:", error);
      alert("로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.");
      navigate("/login");
    }
  };

  return (
    <section id="info" className="section section-info">
      <div className="info-container">
        <div className="info-box">
          <h2>
            공지사항
            <span className="more-btn" onClick={handleNoticeMore} style={{ cursor: "pointer" }}>
              더보기 +
            </span>
          </h2>
          <ul className="notice-list">
            {loading ? (
              <li key="loading" className="notice-item">
                <span className="notice-title">로딩 중...</span>
              </li>
            ) : notices.length > 0 ? (
              notices.map((notice) => (
                <li
                  key={notice.noticeNo}
                  className="notice-item"
                  onClick={() => handleNoticeClick(notice.noticeNo)}
                  style={{ cursor: "pointer" }}>
                  <span className="notice-title">{notice.noticeSubject}</span>
                  <span className="notice-date">{formatDate(notice.createdAt)}</span>
                </li>
              ))
            ) : (
              <li key="empty" className="notice-item">
                <span className="notice-title">등록된 공지사항이 없습니다.</span>
              </li>
            )}
          </ul>
        </div>

        <div className="info-box">
          <h2>현재 유행하는 질병</h2>
          <div className="health-grid">
            {featuredDiseases.map((disease, index) => (
              <div
                key={index}
                className="health-card"
                onClick={() => onHealthInfoClick(disease)}
                style={{ cursor: "pointer" }}>
                <div className="health-card-image" style={{ backgroundImage: `url(${disease.이미지})` }}></div>
                <div className="health-card-content">
                  <h4>{disease.질환명}</h4>
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
