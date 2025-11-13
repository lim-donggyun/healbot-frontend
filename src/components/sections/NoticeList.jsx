import React from "react";

const notices = [
  { title: "2025년 설 연휴 진료 안내", date: "2025.11.01" },
  { title: "외래 진료 시간 변경 안내", date: "2025.10.28" },
  { title: "주차장 이용 안내", date: "2025.10.25" },
  { title: "모바일 앱 업데이트 안내", date: "2025.10.20" },
  { title: "신규 의료진 소개", date: "2025.10.15" },
];

function NoticeList() {
  return (
    <div className="info-box">
      <h2>
        공지사항
        <span className="more-btn">더보기 +</span>
      </h2>
      <ul className="notice-list">
        {notices.map((notice, index) => (
          <li key={index} className="notice-item">
            <span className="notice-title">{notice.title}</span>
            <span className="notice-date">{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoticeList;
