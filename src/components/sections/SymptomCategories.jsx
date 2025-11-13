import React from "react";

const categories = [
  {
    name: "발열",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
  },
  {
    name: "통증",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2v20" />
        <path d="m19 15-7 7-7-7" />
      </svg>
    ),
  },
  {
    name: "소화기",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" x2="9.01" y1="9" y2="9" />
        <line x1="15" x2="15.01" y1="9" y2="9" />
      </svg>
    ),
  },
  {
    name: "호흡기",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    name: "피부",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M12 2v2" />
        <path d="M12 22v-2" />
        <path d="m17 20.66-1-1.73" />
        <path d="M11 10.27 7 3.34" />
        <path d="m20.66 17-1.73-1" />
        <path d="m3.34 7 1.73 1" />
        <path d="M14 12h8" />
        <path d="M2 12h2" />
        <path d="m20.66 7-1.73 1" />
        <path d="m3.34 17 1.73-1" />
        <path d="m17 3.34-1 1.73" />
        <path d="m11 13.73-4 6.93" />
      </svg>
    ),
  },
  {
    name: "외상",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    name: "수면",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M2 12h2" />
        <path d="M9 4v16" />
        <path d="m3 9 3 3-3 3" />
        <path d="M12 6 9 9l3 3" />
        <path d="m6 12 3 3 3-3" />
        <path d="m18 12 3 3-3 3" />
        <path d="M15 6l3 3-3 3" />
        <path d="M22 12h-2" />
      </svg>
    ),
  },
  {
    name: "정신",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    name: "근골격",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 9.5v6m-3-3h6" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
      </svg>
    ),
  },
  {
    name: "감각기관",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 4h.01" />
        <path d="M20 12h.01" />
        <path d="M12 20h.01" />
        <path d="M4 12h.01" />
        <path d="M17.657 6.343h.01" />
        <path d="M17.657 17.657h.01" />
        <path d="M6.343 17.657h.01" />
        <path d="M6.343 6.343h.01" />
      </svg>
    ),
  },
];

function SymptomCategories() {
  return (
    <div className="symptom-categories">
      <p className="search-method-title">② 또는 카테고리에서 선택하세요</p>
      <div className="category-grid">
        {categories.map((category, index) => (
          <button key={index} className="category-btn">
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SymptomCategories;
