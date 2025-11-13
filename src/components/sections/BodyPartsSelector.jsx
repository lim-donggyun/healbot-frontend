import React from "react";

const bodyParts = [
  {
    name: "머리",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    name: "눈/귀/코",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
  },
  {
    name: "목/입",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
      </svg>
    ),
  },
  {
    name: "가슴",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
      </svg>
    ),
  },
  {
    name: "배",
    icon: (
      <svg viewBox="0 0 24 24">
        <ellipse cx="12" cy="11" rx="7" ry="9" />
        <path d="M12 2v20" />
      </svg>
    ),
  },
  {
    name: "팔/다리",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M15.5 5.5h-7a6 6 0 1 0 0 12h7a6 6 0 1 0 0-12z" />
        <circle cx="8.5" cy="11.5" r="1.5" />
        <circle cx="15.5" cy="11.5" r="1.5" />
      </svg>
    ),
  },
];

function BodyPartsSelector({ onBodyPartClick }) {
  const handleClick = (partName) => {
    if (onBodyPartClick) {
      onBodyPartClick(partName);
    }
  };

  return (
    <div className="body-parts-section">
      <h2>신체 부위를 선택해주세요</h2>
      <div className="body-parts-grid">
        {bodyParts.map((part, index) => (
          <div
            key={index}
            className="body-part-card"
            onClick={() => handleClick(part.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="body-part-icon">{part.icon}</div>
            <h3>{part.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BodyPartsSelector;
