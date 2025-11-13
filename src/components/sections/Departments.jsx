import React from "react";

const departments = [
  {
    icon: "🫀",
    name: "심장혈관센터",
    description: "심혈관 질환 전문 진료 및 최첨단 치료",
  },
  {
    icon: "🧠",
    name: "뇌신경센터",
    description: "뇌졸중, 신경계 질환 전문 치료",
  },
  {
    icon: "🦴",
    name: "척추관절센터",
    description: "척추 및 관절 질환 비수술·수술 치료",
  },
  {
    icon: "🎗️",
    name: "암센터",
    description: "통합암치료 및 최신 항암치료",
  },
  {
    icon: "👶",
    name: "여성의학센터",
    description: "산부인과 전문 진료 및 난임치료",
  },
  {
    icon: "💊",
    name: "건강검진센터",
    description: "맞춤형 종합건강검진 프로그램",
  },
];

function Departments() {
  return (
    <section id="departments" className="section section-departments">
      <div className="departments-container">
        <div className="departments-header">
          <h2>전문 진료과 & 센터</h2>
          <p>각 분야 최고의 전문의료진이 여러분의 건강을 지킵니다</p>
        </div>
        <div className="departments-grid">
          {departments.map((dept, index) => (
            <div key={index} className="department-card">
              <div className="department-icon">{dept.icon}</div>
              <h3>{dept.name}</h3>
              <p>{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Departments;
