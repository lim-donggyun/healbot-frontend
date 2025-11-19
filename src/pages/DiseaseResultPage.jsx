import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DiseaseResultPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { symptomsByBodyPart } from "../data/symptomsData";
import { searchSymptomsWithAI, searchDiseases, getPopularDiseases, getSymptomDetails } from "../utils/diseasesApi";

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

function DiseaseResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 전달받은 검색 결과 데이터
  const [diseaseData, setDiseaseData] = useState(location.state?.diseaseData);
  const [searchedSymptoms, setSearchedSymptoms] = useState(location.state?.symptoms || []);

  // 검색 기능 상태
  const [selectedBodyPart, setSelectedBodyPart] = useState("머리");
  const [selectedSymptoms, setSelectedSymptoms] = useState(location.state?.symptoms || []);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showOtherParts, setShowOtherParts] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, right: 0 });

  // 증상 설명 모달 상태
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [selectedSymptomInfo, setSelectedSymptomInfo] = useState({ name: "", description: "" });
  const [isLoadingSymptom, setIsLoadingSymptom] = useState(false);

  // 데이터가 없으면 빈 배열로 초기화 (초기 페이지 표시)
  const diseaseList = diseaseData?.data || [];

  // 초기 로딩 시 인기 질환 가져오기
  useEffect(() => {
    const fetchPopularDiseases = async () => {
      if (!diseaseData) {
        setIsLoading(true);
        try {
          const response = await getPopularDiseases();
          console.log("인기 질환 응답:", response);
          if (response.success && response.data) {
            console.log("질환 데이터:", response.data);
            setDiseaseData({ data: response.data });
            setSearchedSymptoms([]);
          } else {
            console.log("응답 성공하지 않음 또는 데이터 없음");
          }
        } catch (error) {
          console.error("인기 질환 조회 실패:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPopularDiseases();
  }, []);

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (showSymptomModal || showDetailModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showSymptomModal, showDetailModal]);

  // Section2의 함수들
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
      // 증상 선택 없이 검색하면 인기 질환 표시
      setIsLoading(true);
      try {
        const response = await getPopularDiseases();
        if (response.success && response.data) {
          setDiseaseData({ data: response.data });
          setSearchedSymptoms([]);
        }
      } catch (error) {
        console.error("인기 질환 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchDiseases(selectedSymptoms);
      console.log("검색 결과:", result);
      setDiseaseData(result);
      setSearchedSymptoms(selectedSymptoms);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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

  // 증상 설명 조회
  const handleSymptomInfo = async (symptomName, e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoadingSymptom(true);
    setShowSymptomModal(true);
    setSelectedSymptomInfo({ name: symptomName, description: "로딩 중..." });

    try {
      const description = await getSymptomDetails(symptomName);
      setSelectedSymptomInfo({ name: symptomName, description });
    } catch (error) {
      setSelectedSymptomInfo({ name: symptomName, description: "증상 정보를 불러올 수 없습니다." });
    } finally {
      setIsLoadingSymptom(false);
    }
  };

  const handleBackToSearch = () => {
    navigate("/");
    // 메인 페이지로 이동 후 검색 섹션으로 스크롤
    setTimeout(() => {
      const searchSection = document.getElementById("search");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="disease-result-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="disease-result-page-container">
        {/* 페이지 헤더 */}
        <div className="result-page-header">
          <div className="header-content">
            <h1>
              {diseaseList.length > 0
                ? searchedSymptoms.length > 0
                  ? `매칭된 질병 ${diseaseList.length}개`
                  : "많이 찾는 질병"
                : "많이 찾는 질병"}
            </h1>
          </div>
        </div>

        {/* 고정 검색 영역 */}
        <div className="fixed-search-section">
          <div className="search-wrapper">
            {/* AI 검색 입력창 */}
            <div className="ai-search-container">
              <div className="symptom-search-box">
                <input
                  type="text"
                  className="symptom-search-input"
                  placeholder="AI에게 증상 또는 질환을 자유롭게 설명해보세요              [예: 오늘따라 머리가 아프고 속이 쓰려]"
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
                          part.isExpandable &&
                          (showOtherParts || otherBodyParts.some((op) => op.tab === selectedBodyPart))
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
                      <button
                        className="symptom-info-btn"
                        onClick={(e) => handleSymptomInfo(symptom, e)}
                        title="증상 설명 보기">
                        ?
                      </button>
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
        </div>

        {/* 검색 결과 콘텐츠 */}
        <div className="result-page-content">
          {isLoading ? null : diseaseList.length === 0 && diseaseData ? (
            <div className="no-results">
              <h2>검색 결과가 없습니다</h2>
              <p className="no-results-hint">위의 검색 영역에서 다른 증상으로 다시 검색해보세요.</p>
            </div>
          ) : diseaseList.length > 0 ? (
            <>
              {/* 질병 그리드 */}
              <div className="disease-grid">
                {diseaseList
                  .filter((disease) => disease != null)
                  .map((disease, index) => {
                    // 한국어 필드명 매핑
                    const diseaseName = disease.질환명 || disease.disease_name || "정보 없음";
                    const imageUrl = disease.이미지 || disease.image_url;
                    const description = disease.설명 || disease.description;
                    const department = disease.진료과 || disease.department;
                    const allSymptoms = disease.전체증상목록 || disease.all_symptoms || "";
                    const score = disease.일치도 || disease.score;

                    // 전체증상목록을 배열로 변환
                    const symptomsArray =
                      typeof allSymptoms === "string" ? allSymptoms.split(",").map((s) => s.trim()) : [];

                    return (
                      <div
                        key={index}
                        className="disease-card"
                        data-rank={index + 1}
                        onClick={() => {
                          setSelectedDisease(disease);
                          setShowDetailModal(true);
                        }}
                        style={{ cursor: "pointer" }}>
                        <div className="disease-rank">{index + 1}</div>

                        {imageUrl && (
                          <div className="disease-image-container">
                            <img src={imageUrl} alt={diseaseName} className="disease-image" />
                          </div>
                        )}

                        <div className="disease-content">
                          <h3 className="disease-name">{diseaseName}</h3>

                          {score !== undefined && (
                            <div className="score-section">
                              <span className="score-label">일치도</span>
                              <div className="score-bar-container">
                                <div className="score-bar" style={{ width: `${score * 10}%` }}>
                                  <span className="score-text">{score.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* 질병 상세 정보 모달 */}
      {showDetailModal && selectedDisease && (
        <div className="detail-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn-top" onClick={() => setShowDetailModal(false)}>
              ✕
            </button>
            <div className="detail-modal-body">
              <div className="detail-content-grid">
                {/* 왼쪽: 이미지 */}
                <div className="detail-left">
                  {(selectedDisease.이미지 || selectedDisease.image_url) && (
                    <div className="detail-image-container">
                      <img
                        src={selectedDisease.이미지 || selectedDisease.image_url}
                        alt={selectedDisease.질환명 || selectedDisease.disease_name}
                        className="detail-image"
                      />
                    </div>
                  )}
                  <button className="find-department-btn">진료과 찾기</button>
                </div>

                {/* 오른쪽: 정보 */}
                <div className="detail-right">
                  <div className="detail-section">
                    <h3 className="detail-section-title">질환명</h3>
                    <p className="detail-text">
                      {selectedDisease.질환명 || selectedDisease.disease_name || "정보 없음"}
                    </p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">진료과</h3>
                    <p className="detail-text">{selectedDisease.진료과 || selectedDisease.department || "정보 없음"}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">설명</h3>
                    <p className="detail-text">{selectedDisease.설명 || selectedDisease.description || "정보 없음"}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">증상</h3>
                    <div className="detail-symptoms-list">
                      {(typeof (selectedDisease.전체증상목록 || selectedDisease.all_symptoms) === "string"
                        ? (selectedDisease.전체증상목록 || selectedDisease.all_symptoms).split(",").map((s) => s.trim())
                        : []
                      ).map((symptom, idx) => {
                        const isMatched = searchedSymptoms.includes(symptom);
                        return (
                          <span key={idx} className={`detail-symptom-badge ${isMatched ? "matched" : ""}`}>
                            {symptom}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {(selectedDisease.일치도 || selectedDisease.score) !== undefined && (
                    <div className="detail-section">
                      <h3 className="detail-section-title">일치도</h3>
                      <div className="detail-score-container">
                        <div className="detail-score-bar">
                          <div
                            className="score-bar"
                            style={{ width: `${(selectedDisease.일치도 || selectedDisease.score) * 10}%` }}>
                            <span className="detail-score-text">
                              {(selectedDisease.일치도 || selectedDisease.score).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 증상 설명 모달 */}
      {showSymptomModal && (
        <div className="symptom-modal-overlay" onClick={() => setShowSymptomModal(false)}>
          <div className="symptom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="symptom-modal-header">
              <h3>{selectedSymptomInfo.name}</h3>
              <button className="symptom-modal-close-btn" onClick={() => setShowSymptomModal(false)}>
                ✕
              </button>
            </div>
            <div className="symptom-modal-body">
              <p>{selectedSymptomInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DiseaseResultPage;
