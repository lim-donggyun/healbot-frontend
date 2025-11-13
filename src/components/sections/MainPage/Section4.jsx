import React from "react";

function InfoSection() {
  return (
    <section id="info" className="section section-info">
      <div className="info-container">
        <div className="info-box">
          <h2>
            공지사항
            <span className="more-btn">더보기 +</span>
          </h2>
          <ul className="notice-list">
            <li className="notice-item">
              <span className="notice-title">2025년 설 연휴 진료 안내</span>
              <span className="notice-date">2025.11.01</span>
            </li>
            <li className="notice-item">
              <span className="notice-title">외래 진료 시간 변경 안내</span>
              <span className="notice-date">2025.10.28</span>
            </li>
            <li className="notice-item">
              <span className="notice-title">주차장 이용 안내</span>
              <span className="notice-date">2025.10.25</span>
            </li>
            <li className="notice-item">
              <span className="notice-title">모바일 앱 업데이트 안내</span>
              <span className="notice-date">2025.10.20</span>
            </li>
            <li className="notice-item">
              <span className="notice-title">신규 의료진 소개</span>
              <span className="notice-date">2025.10.15</span>
            </li>
          </ul>
        </div>

        <div className="info-box">
          <h2>
            건강정보
            <span className="more-btn">더보기 +</span>
          </h2>
          <div className="health-grid">
            <div className="health-card">
              <h4>겨울철 심혈관 질환 예방법</h4>
              <p>추운 날씨에 주의해야 할 심장 건강 관리</p>
            </div>
            <div className="health-card">
              <h4>독감 예방 접종 안내</h4>
              <p>2025-2026 절기 독감 예방접종</p>
            </div>
            <div className="health-card">
              <h4>암 조기 검진의 중요성</h4>
              <p>정기 검진으로 지키는 건강</p>
            </div>
            <div className="health-card">
              <h4>척추 건강 관리법</h4>
              <p>바른 자세와 생활 습관</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
