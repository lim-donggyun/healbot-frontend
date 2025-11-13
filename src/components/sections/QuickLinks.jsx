import React from "react";

const quickLinks = [
  {
    label: "가까운 병원 찾기",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
        <path d="M12 3v6" />
      </svg>
    ),
  },
  {
    label: "응급 상황인가요?",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    label: "건강정보 보기",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

function QuickLinks() {
  return (
    <div className="quick-links">
      {quickLinks.map((link, index) => (
        <button key={index} className="quick-link-btn">
          {link.icon}
          {link.label}
        </button>
      ))}
    </div>
  );
}

export default QuickLinks;
