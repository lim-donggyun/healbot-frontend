import React from "react";

const healthArticles = [
  {
    title: "겨울철 심혈관 질환 예방법",
    description: "추운 날씨에 주의해야 할 심장 건강 관리",
  },
  {
    title: "독감 예방 접종 안내",
    description: "2025-2026 절기 독감 예방접종",
  },
  {
    title: "암 조기 검진의 중요성",
    description: "정기 검진으로 지키는 건강",
  },
  {
    title: "척추 건강 관리법",
    description: "바른 자세와 생활 습관",
  },
];

function HealthInfo() {
  return (
    <div className="info-box">
      <h2>
        건강정보
        <span className="more-btn">더보기 +</span>
      </h2>
      <div className="health-grid">
        {healthArticles.map((article, index) => (
          <div key={index} className="health-card">
            <h4>{article.title}</h4>
            <p>{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthInfo;
