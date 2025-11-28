import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChronicDiseasePage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { getDiseaseByName } from "../utils/diseasesApi";

// 만성질환 목록 (카테고리와 이름만 하드코딩, 상세정보는 API로 가져오기)
const chronicDiseasesList = [
  {
    id: 1,
    name: "고혈압(Essential (primary) hypertension)",
    category: "심혈관계",
  },
  {
    id: 2,
    name: "당뇨병(Diabetes mellitus)",
    category: "내분비계",
  },
  {
    id: 3,
    name: "협심증(Angina pectoris)",
    category: "심혈관계",
  },
  {
    id: 4,
    name: "만성 전립선염(Chronic prostatitis)",
    category: "비뇨기계",
  },
  {
    id: 5,
    name: "만성 기관지염(Chronic bronchitis)",
    category: "호흡기계",
  },
  {
    id: 6,
    name: "골다공증(Osteoporosis)",
    category: "근골격계",
  },
  {
    id: 7,
    name: "류마티스 관절염(Rheumatoid arthritis)",
    category: "근골격계",
  },
  {
    id: 8,
    name: "위식도 역류성 질환(Gastro-esophagus reflux disease)",
    category: "소화기계",
  },
  {
    id: 9,
    name: "갑상선기능저하증(Hypothyroidism)",
    category: "내분비계",
  },
  {
    id: 10,
    name: "천식(Asthma)",
    category: "호흡기계",
  },
  {
    id: 11,
    name: "궤양성 대장염(Ulcerative colitis)",
    category: "소화기계",
  },
  {
    id: 12,
    name: "만성 위염(Chronic gastritis)",
    category: "소화기계",
  },
  {
    id: 13,
    name: "통풍(Gout)",
    category: "근골격계",
  },
  {
    id: 14,
    name: "뇌전증(Epilepsy)",
    category: "신경계",
  },
  {
    id: 15,
    name: "강직성 척추염(Ankylosing spondylitis)",
    category: "근골격계",
  },
  {
    id: 16,
    name: "파킨슨병(Parkinson's disease)",
    category: "신경계",
  },
  {
    id: 17,
    name: "알츠하이머병(Alzheimer's disease)",
    category: "신경계",
  },
  {
    id: 18,
    name: "만성 피로 증후군(Chronic Fatigue Syndrome)",
    category: "내분비계",
  },
  {
    id: 19,
    name: "만성 췌장염(Chronic pancreatitis)",
    category: "소화기계",
  },
  {
    id: 20,
    name: "크론병(Crohn's disease)",
    category: "소화기계",
  },
  {
    id: 21,
    name: "요실금(Urinary incontinence)",
    category: "비뇨기계",
  },
];

function ChronicDiseasePage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [diseasesData, setDiseasesData] = useState({});
  const [loadingDiseases, setLoadingDiseases] = useState({});
  const navigate = useNavigate();

  // 카테고리별 필터링
  const categories = ["전체", "심혈관계", "내분비계", "비뇨기계", "호흡기계", "근골격계", "소화기계", "신경계"];

  const filteredDiseases =
    selectedCategory === "전체"
      ? chronicDiseasesList
      : chronicDiseasesList.filter((disease) => disease.category === selectedCategory);

  // 질병 데이터 로드 (클릭 시)
  const loadDiseaseData = async (diseaseName) => {
    if (diseasesData[diseaseName]) {
      return diseasesData[diseaseName];
    }

    setLoadingDiseases((prev) => ({ ...prev, [diseaseName]: true }));
    try {
      const data = await getDiseaseByName(diseaseName);
      setDiseasesData((prev) => ({ ...prev, [diseaseName]: data }));
      return data;
    } catch (error) {
      console.error("질병 정보 로드 실패:", error);
      return null;
    } finally {
      setLoadingDiseases((prev) => ({ ...prev, [diseaseName]: false }));
    }
  };

  // 질병 카드 클릭 핸들러
  const handleDiseaseClick = async (disease) => {
    const diseaseData = await loadDiseaseData(disease.name);
    if (diseaseData) {
      setSelectedDisease({ ...disease, ...diseaseData });
      setShowDetailModal(true);
    }
  };

  // 페이지 로드 시 모든 질병 데이터 미리 로드
  useEffect(() => {
    const loadAllDiseases = async () => {
      const promises = chronicDiseasesList.map((disease) => loadDiseaseData(disease.name));
      await Promise.all(promises);
    };
    loadAllDiseases();
  }, []);

  return (
    <div className="chronic-disease-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="chronic-disease-page-container">
        {/* 페이지 헤더 */}
        <div className="chronic-page-header">
          <div className="header-content">
            <h1>만성질환 정보</h1>
            <p className="header-subtitle">주요 만성질환에 대한 정보를 확인하세요</p>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="category-filter-section">
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 질환 그리드 */}
        <div className="chronic-disease-content">
          <div className="chronic-disease-grid">
            {filteredDiseases.map((disease) => {
              const diseaseData = diseasesData[disease.name];
              const isLoading = loadingDiseases[disease.name];

              return (
                <div
                  key={disease.id}
                  className="chronic-disease-card"
                  onClick={() => handleDiseaseClick(disease)}
                  style={{ cursor: isLoading ? "wait" : "pointer" }}>
                  {diseaseData?.이미지 && (
                    <div className="chronic-disease-image-container">
                      <img src={diseaseData.이미지} alt={disease.name} className="chronic-disease-image" />
                    </div>
                  )}

                  <div className="chronic-disease-content-area">
                    <div className="chronic-disease-category-badge">{disease.category}</div>
                    <h3 className="chronic-disease-name">{disease.name}</h3>
                    {diseaseData?.전체증상목록 && (
                      <div className="chronic-disease-symptoms">
                        {diseaseData.전체증상목록
                          .split(", ")
                          .slice(0, 4)
                          .map((symptom, idx) => (
                            <span key={idx} className="symptom-tag">
                              {symptom}
                            </span>
                          ))}
                        {diseaseData.전체증상목록.split(", ").length > 4 && (
                          <span className="symptom-tag more">+{diseaseData.전체증상목록.split(", ").length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
                  {selectedDisease.이미지 && (
                    <div className="detail-image-container">
                      <img
                        src={selectedDisease.이미지}
                        alt={selectedDisease.질환명 || selectedDisease.name}
                        className="detail-image"
                      />
                    </div>
                  )}
                  <button
                    className="find-department-btn"
                    onClick={() => {
                      const department = selectedDisease.진료과;
                      if (department) {
                        navigate(`/hospitals?dept=${encodeURIComponent(department)}`);
                      } else {
                        alert('진료과 정보가 없습니다.');
                      }
                    }}
                  >
                    병원 찾기
                  </button>
                </div>

                {/* 오른쪽: 정보 */}
                <div className="detail-right">
                  <div className="detail-section">
                    <h3 className="detail-section-title">질환명</h3>
                    <p className="detail-text">{selectedDisease.질환명 || selectedDisease.name}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">진료과</h3>
                    <p className="detail-text">{selectedDisease.진료과 || "정보 없음"}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">설명</h3>
                    <p className="detail-text">{selectedDisease.설명 || "정보 없음"}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">증상</h3>
                    <div className="detail-symptoms-list">
                      {selectedDisease.전체증상목록 &&
                        selectedDisease.전체증상목록.split(", ").map((symptom, idx) => (
                          <span key={idx} className="detail-symptom-badge">
                            {symptom}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ChronicDiseasePage;
