import React, { useState, useEffect } from "react";
import { symptomsByBodyPart, defaultSymptoms } from "../../data/symptomsData";
import { searchDiseases } from "../../utils/api";
import "./SymptomSelector.css";

function SymptomSelector({ aiSymptoms = [] }) {
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [displayedSymptoms, setDisplayedSymptoms] = useState(defaultSymptoms);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const bodyParts = [
    { name: "머리", key: "머리" },
    { name: "눈/귀/코", key: "눈/귀/코" },
    { name: "목/입", key: "목/입" },
    { name: "가슴", key: "가슴" },
    { name: "배", key: "배" },
    { name: "팔/다리", key: "팔/다리" },
  ];

  // AI 증상이 추가되면 자동으로 선택
  useEffect(() => {
    if (aiSymptoms.length > 0) {
      setSelectedSymptoms((prev) => {
        const newSymptoms = [...prev];
        aiSymptoms.forEach((symptom) => {
          if (!newSymptoms.includes(symptom)) {
            newSymptoms.push(symptom);
          }
        });
        return newSymptoms;
      });

      // AI 증상을 표시된 증상 목록에 추가
      setDisplayedSymptoms((prev) => {
        const newDisplayed = [...prev];
        aiSymptoms.forEach((symptom) => {
          if (!newDisplayed.includes(symptom)) {
            newDisplayed.push(symptom);
          }
        });
        return newDisplayed;
      });
    }
  }, [aiSymptoms]);

  const handleBodyPartClick = (bodyPartKey) => {
    if (selectedBodyPart === bodyPartKey) {
      setSelectedBodyPart(null);
      setDisplayedSymptoms(defaultSymptoms);
    } else {
      setSelectedBodyPart(bodyPartKey);
      setDisplayedSymptoms(symptomsByBodyPart[bodyPartKey] || []);
      setScrollTop(0);
    }
  };

  const handleSymptomClick = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const handleSearch = async () => {
    if (selectedSymptoms.length === 0) {
      alert("증상을 선택해주세요.");
      return;
    }

    try {
      const result = await searchDiseases(selectedSymptoms);
      console.log("검색 결과:", result);
      // TODO: 검색 결과 페이지로 이동하거나 결과 표시
      alert("검색 완료! 콘솔을 확인하세요.");
    } catch (error) {
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  // 표시할 증상을 15개씩 분할
  const visibleSymptoms = displayedSymptoms.slice(0, 15 + Math.floor(scrollTop / 50) * 15);

  return (
    <div className="symptom-selector-container">
      <h2 className="symptom-selector-title">AI 챗봇과 대화하기</h2>
      <p className="symptom-selector-subtitle">
        예: 두통, 발열, 복통 등 증상을 입력하세요
      </p>

      {/* 신체 부위 탭 */}
      <div className="body-parts-tabs">
        {bodyParts.map((part) => (
          <button
            key={part.key}
            className={`body-part-tab ${
              selectedBodyPart === part.key ? "active" : ""
            }`}
            onClick={() => handleBodyPartClick(part.key)}
          >
            {part.name}
          </button>
        ))}
      </div>

      {/* 매칭된 증상 표시 */}
      <div className="matched-symptoms">
        <span className="matched-label">
          {selectedSymptoms.length === 0
            ? "매칭된 증상 없음"
            : `매칭된 증상: ${selectedSymptoms.join(", ")}`}
        </span>
      </div>

      {/* 증상 선택 그리드 (스크롤 가능) */}
      <div className="symptoms-scroll-container" onScroll={handleScroll}>
        <div className="symptoms-grid">
          {visibleSymptoms.map((symptom, index) => (
            <button
              key={index}
              className={`symptom-btn ${
                selectedSymptoms.includes(symptom) ? "selected" : ""
              }`}
              onClick={() => handleSymptomClick(symptom)}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* 검색하기 버튼 */}
      <button className="symptom-search-submit-btn" onClick={handleSearch}>
        검색하기
      </button>
    </div>
  );
}

export default SymptomSelector;
