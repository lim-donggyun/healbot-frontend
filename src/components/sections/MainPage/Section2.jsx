import React, { useState } from "react";
import { symptomsByBodyPart } from "../../data/symptomsData";
import { searchSymptomsWithAI, searchDiseases } from "../../utils/api";

const bodyParts = [
  { key: "머리/얼굴", label: "머리/얼굴", icon: "🧠" },
  { key: "목/어깨", label: "목/어깨", icon: "💪" },
  { key: "가슴", label: "가슴", icon: "❤️" },
  { key: "배/골반", label: "배/골반", icon: "🔵" },
  { key: "등/엉덩이", label: "등/엉덩이", icon: "🦴" },
  { key: "팔/손", label: "팔/손", icon: "✋" },
  { key: "다리/발", label: "다리/발", icon: "🦵" },
  { key: "전신/피부", label: "전신/피부", icon: "🌡️" },
  { key: "기타", label: "기타 부위", icon: "❓" },
];

function SymptomSearchNew() {
  const [selectedBodyPart, setSelectedBodyPart] = useState("머리/얼굴");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 신체 부위 클릭
  const handleBodyPartClick = (partKey) => {
    setSelectedBodyPart(partKey);
  };

  // 증상 클릭
  const handleSymptomClick = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // AI 검색
  const handleAiSearch = async () => {
    if (!aiInput.trim()) {
      alert("증상을 입력해주세요.");
      return;
    }

    setIsAiLoading(true);
    try {
      const symptoms = await searchSymptomsWithAI(aiInput);
      // AI로 반환된 증상들을 선택 목록에 추가
      setSelectedSymptoms((prev) => {
        const newSymptoms = [...prev];
        symptoms.forEach((symptom) => {
          if (!newSymptoms.includes(symptom)) {
            newSymptoms.push(symptom);
          }
        });
        return newSymptoms;
      });
      setAiInput("");
    } catch (error) {
      alert("AI 검색 중 오류가 발생했습니다.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 검색하기
  const handleSearch = async () => {
    if (selectedSymptoms.length === 0) {
      alert("증상을 선택해주세요.");
      return;
    }

    try {
      const result = await searchDiseases(selectedSymptoms);
      console.log("검색 결과:", result);
      alert("검색 완료! 콘솔을 확인하세요.");
    } catch (error) {
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  // 초기화
  const handleReset = () => {
    setSelectedSymptoms([]);
    setSelectedBodyPart("머리/얼굴");
    setAiInput("");
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAiSearch();
    }
  };

  // 현재 선택된 신체 부위의 증상 목록
  const currentSymptoms = symptomsByBodyPart[selectedBodyPart] || [];

  // 증상 그리드 휠 스크롤 시 페이지 스크롤 방지
  const handleGridWheel = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    // 위로 스크롤 중이고 최상단이 아니거나, 아래로 스크롤 중이고 최하단이 아니면 페이지 스크롤 방지
    if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="search" className="section section-search">
      <div className="search-wrapper">
        <h1>어떤 증상이 있으신가요?</h1>

        {/* 신체 부위 선택 */}
        <div className="body-parts-section">
          <h2>신체 부위를 선택해주세요</h2>
          <div className="body-parts-grid">
            {bodyParts.map((part) => (
              <div
                key={part.key}
                className={`body-part-card ${
                  selectedBodyPart === part.key ? "active" : ""
                }`}
                onClick={() => handleBodyPartClick(part.key)}
              >
                <div className="body-part-icon">{part.icon}</div>
                <h3>{part.label}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* AI 챗봇과 대화하기 */}
        <div className="search-methods">
          <div className="ai-chatbot-header">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" x2="8" y1="16" y2="16" />
              <line x1="16" x2="16" y1="16" y2="16" />
            </svg>
            AI 챗봇과 대화하기
          </div>

          {/* 증상 검색창 */}
          <div className="symptom-search-box">
            <input
              type="text"
              className="symptom-search-input"
              placeholder="예: 두통, 발열, 복통 등 증상을 입력하세요"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAiLoading}
            />
            <button
              className="ai-search-btn"
              onClick={handleAiSearch}
              disabled={isAiLoading}
            >
              {isAiLoading ? "검색중..." : "검색"}
            </button>
          </div>

          {/* 선택된 증상 표시 */}
          <div className="selected-symptoms">
            <span className="selected-label">매칭된 증상:</span>
            <span
              className="selected-list"
              style={{
                color: selectedSymptoms.length === 0 ? "#999" : "#333",
              }}
            >
              {selectedSymptoms.length === 0
                ? "매칭된 증상 없음"
                : selectedSymptoms.join(", ")}
            </span>
          </div>

          {/* 증상 카테고리 */}
          <div className="symptom-categories">
            <div
              className="category-grid"
              onWheel={handleGridWheel}
            >
              {currentSymptoms.map((symptom, index) => (
                <button
                  key={index}
                  className={`category-btn ${
                    selectedSymptoms.includes(symptom) ? "active" : ""
                  }`}
                  onClick={() => handleSymptomClick(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* 검색하기 & 초기화 버튼 */}
          <div className="search-buttons">
            <button className="search-submit-btn" onClick={handleSearch}>
              검색하기
            </button>
            <button className="search-reset-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>

        {/* 빠른 링크 */}
        <div className="quick-links">
          <button className="quick-link-btn">
            <svg viewBox="0 0 24 24">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            가까운 병원 찾기
          </button>
          <button className="quick-link-btn">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            응급 상황인가요?
          </button>
          <button className="quick-link-btn">
            <svg viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            건강정보 보기
          </button>
        </div>
      </div>
    </section>
  );
}

export default SymptomSearchNew;
