import React, { useState, useEffect, useRef } from "react";
import { symptomsByBodyPart } from "../../../data/symptomsData";
import { searchSymptomsWithAI, searchDiseases } from "../../../utils/api";

const bodyParts = [
  { key: "머리", label: "머리", tab: "머리" },
  { key: "목", label: "목", tab: "목" },
  { key: "가슴", label: "가슴", tab: "가슴" },
  { key: "배", label: "배", tab: "배" },
  { key: "등", label: "등", tab: "등" },
  { key: "엉덩이", label: "엉덩이", tab: "엉덩이" },
  { key: "팔", label: "팔", tab: "팔" },
  { key: "다리", label: "다리", tab: "다리" },
  { key: "그외", label: "그 외", isExpandable: true },
];

const otherBodyParts = [
  { key: "눈", label: "눈", tab: "눈" },
  { key: "귀", label: "귀", tab: "귀" },
  { key: "코", label: "코", tab: "코" },
  { key: "입", label: "입", tab: "입" },
  { key: "전신", label: "전신", tab: "전신" },
  { key: "피부", label: "피부", tab: "피부" },
  { key: "유방", label: "유방", tab: "유방" },
  { key: "생식기", label: "생식기", tab: "생식기" },
  { key: "골반", label: "골반", tab: "골반" },
  { key: "손", label: "손", tab: "손" },
  { key: "발", label: "발", tab: "발" },
  { key: "기타", label: "기타", tab: "기타" },
];

function SymptomSearchNew() {
  const [selectedBodyPart, setSelectedBodyPart] = useState("머리");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showOtherParts, setShowOtherParts] = useState(false);
  const popoverRef = useRef(null);
  const triggerButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setAiInput(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(event.target)
      ) {
        setShowOtherParts(false);
      }
    };

    const handleScroll = () => {
      setShowOtherParts(false);
    };

    if (showOtherParts) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showOtherParts]);

  const handleBodyPartClick = (partKey, isExpandable, event) => {
    if (isExpandable) {
      if (event) {
        const rect = event.currentTarget.getBoundingClientRect();
        setPopoverPosition({
          top: rect.bottom + 5,
          right: window.innerWidth - rect.right,
        });
      }
      setShowOtherParts(!showOtherParts);
    } else {
      setSelectedBodyPart(partKey);
      setShowOtherParts(false);
    }
  };

  const [popoverPosition, setPopoverPosition] = useState({ top: 0, right: 0 });

  const handleSymptomClick = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleAiSearch = async () => {
    if (!aiInput.trim()) {
      alert("증상을 입력해주세요.");
      return;
    }

    setIsAiLoading(true);
    try {
      const symptoms = await searchSymptomsWithAI(aiInput);
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

  const handleReset = () => {
    setSelectedSymptoms([]);
    setSelectedBodyPart("머리");
    setAiInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAiSearch();
    }
  };

  const currentSymptoms = symptomsByBodyPart[selectedBodyPart] || [];

  const handleGridWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const element = e.currentTarget;
    element.scrollTop += e.deltaY;
  };

  return (
    <section id="search" className="section section-search">
      <div className="search-wrapper">
        <h1>어떤 증상이 있으신가요?</h1>

        {/* AI 검색 입력창 */}
        <div className="ai-search-container">
          <div className="symptom-search-box">
            <input
              type="text"
              className="symptom-search-input"
              placeholder="AI에게 증상 또는 질환을 자유롭게 설명해보세요                      [예: 오늘따라 머리가 아프고 속이 쓰려] "
              value={aiInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isAiLoading}
            />
            <button className="ai-search-btn" onClick={handleAiSearch} disabled={isAiLoading} aria-label="AI 검색">
              {isAiLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 신체 부위와 증상 선택 영역 */}
        <div className="symptom-selection-container">
          {/* 왼쪽: 인체 이미지 영역 */}
          <div className="body-image-area">
            <div className="body-placeholder">{/* 여기에 나중에 이미지가 들어갈 자리 */}</div>
          </div>

          {/* 오른쪽: 탭과 증상 선택 영역 */}
          <div className="symptoms-area">
            {/* 신체 부위 탭 */}
            <div className="body-parts-tabs">
              {bodyParts.map((part) => {
                // "그 외" 버튼의 경우, 선택된 부위가 otherBodyParts에 있으면 해당 이름 표시
                let displayLabel = part.label;
                if (part.isExpandable) {
                  const selectedOtherPart = otherBodyParts.find((otherPart) => otherPart.tab === selectedBodyPart);
                  if (selectedOtherPart) {
                    displayLabel = selectedOtherPart.label;
                  }
                }

                return (
                  <button
                    key={part.key}
                    ref={part.isExpandable ? triggerButtonRef : null}
                    className={`tab-btn ${!part.isExpandable && selectedBodyPart === part.tab ? "active" : ""} ${
                      part.isExpandable && (showOtherParts || otherBodyParts.some((op) => op.tab === selectedBodyPart))
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) => handleBodyPartClick(part.tab, part.isExpandable, e)}>
                    {displayLabel}
                    {part.isExpandable && <span className="expand-icon">{showOtherParts ? "▲" : "▼"}</span>}
                  </button>
                );
              })}
            </div>

            {/* 증상 선택 체크박스 영역 */}
            <div className="symptoms-checkbox-area" onWheel={handleGridWheel}>
              {currentSymptoms.map((symptom, index) => (
                <label key={index} className="symptom-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleSymptomClick(symptom)}
                  />
                  <span className="symptom-label">{symptom}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 선택된 증상 표시 및 검색 버튼 */}
        <div className="selected-symptoms-display">
          <div className="selected-symptoms-text">
            <span className="selected-label">선택된 증상:</span>
            <div className="selected-list">
              {selectedSymptoms.length === 0 ? (
                <span className="no-symptoms">선택된 증상이 없습니다</span>
              ) : (
                selectedSymptoms.map((symptom, index) => (
                  <span key={index} className="symptom-tag">
                    {symptom}
                    <button
                      className="symptom-remove-btn"
                      onClick={() => handleSymptomClick(symptom)}
                      aria-label={`${symptom} 제거`}>
                      ✕
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="search-buttons">
            <button className="search-submit-btn" onClick={handleSearch}>
              질병 검색하기
            </button>
            <button className="search-reset-btn" onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 팝오버: 그 외 부위 선택 */}
      {showOtherParts && (
        <div
          ref={popoverRef}
          className="body-parts-popover"
          style={{
            top: `${popoverPosition.top}px`,
            right: `${popoverPosition.right}px`,
          }}>
          <div className="popover-header">세부 부위 선택</div>
          <div className="popover-grid">
            {otherBodyParts.map((part) => (
              <button
                key={part.key}
                className={`popover-item ${selectedBodyPart === part.tab ? "active" : ""}`}
                onClick={() => handleBodyPartClick(part.tab, false)}>
                {part.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default SymptomSearchNew;
