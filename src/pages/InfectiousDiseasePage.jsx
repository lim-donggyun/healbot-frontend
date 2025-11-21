import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InfectiousDiseasePage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { getDiseaseByName } from "../utils/diseasesApi";

// 감염병 목록 (카테고리와 이름만 하드코딩, 상세정보는 API로 가져오기)
const infectiousDiseasesList = [
  {
    id: 1,
    name: "결핵(Tuberculosis)",
    category: "세균성 감염",
  },
  {
    id: 2,
    name: "폐렴(Pneumonia)",
    category: "세균성 감염",
  },
  {
    id: 3,
    name: "인플루엔자(Influenza)",
    category: "바이러스성 감염",
  },
  {
    id: 4,
    name: "수두(Varicella (chickenpox))",
    category: "바이러스성 감염",
  },
  {
    id: 5,
    name: "홍역(Measles)",
    category: "바이러스성 감염",
  },
  {
    id: 6,
    name: "급성 A형 간염(Acute hepatitis A)",
    category: "바이러스성 감염",
  },
  {
    id: 7,
    name: "급성 B형 간염(Acute hepatitis B)",
    category: "바이러스성 감염",
  },
  {
    id: 8,
    name: "급성 C형 간염(Acute hepatitis C)",
    category: "바이러스성 감염",
  },
  {
    id: 9,
    name: "대상포진(Herpes zoster)",
    category: "바이러스성 감염",
  },
  {
    id: 10,
    name: "백일해(Pertussis)",
    category: "세균성 감염",
  },
  {
    id: 11,
    name: "콜레라(Cholera)",
    category: "세균성 감염",
  },
  {
    id: 12,
    name: "장티푸스(typhoid fever)",
    category: "세균성 감염",
  },
  {
    id: 13,
    name: "말라리아(Malaria)",
    category: "기생충 감염",
  },
  {
    id: 14,
    name: "아메바성 이질(Amebic dysentery)",
    category: "기생충 감염",
  },
  {
    id: 15,
    name: "뎅기열(Dengue fever)",
    category: "바이러스성 감염",
  },
  {
    id: 16,
    name: "파상풍(Tetanus)",
    category: "세균성 감염",
  },
  {
    id: 17,
    name: "디프테리아(Diphtheritia)",
    category: "세균성 감염",
  },
  {
    id: 18,
    name: "일본 뇌염(Japanese encephalitis)",
    category: "바이러스성 감염",
  },
  {
    id: 19,
    name: "광견병(Rabies)",
    category: "바이러스성 감염",
  },
  {
    id: 20,
    name: "요충증(Enterobiasis)",
    category: "기생충 감염",
  },
  {
    id: 21,
    name: "선모충증(Trichinellosis)",
    category: "기생충 감염",
  },
];

function InfectiousDiseasePage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [diseasesData, setDiseasesData] = useState({});
  const [loadingDiseases, setLoadingDiseases] = useState({});
  const navigate = useNavigate();

  // 카테고리별 필터링
  const categories = ["전체", "세균성 감염", "바이러스성 감염", "기생충 감염"];

  const filteredDiseases =
    selectedCategory === "전체"
      ? infectiousDiseasesList
      : infectiousDiseasesList.filter((disease) => disease.category === selectedCategory);

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
      const promises = infectiousDiseasesList.map((disease) => loadDiseaseData(disease.name));
      await Promise.all(promises);
    };
    loadAllDiseases();
  }, []);

  return (
    <div className="infectious-disease-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="infectious-disease-page-container">
        {/* 페이지 헤더 */}
        <div className="infectious-page-header">
          <div className="header-content">
            <h1>감염병 정보</h1>
            <p className="header-subtitle">주요 감염병에 대한 정보를 확인하세요</p>
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
        <div className="infectious-disease-content">
          <div className="infectious-disease-grid">
            {filteredDiseases.map((disease) => {
              const diseaseData = diseasesData[disease.name];
              const isLoading = loadingDiseases[disease.name];

              return (
                <div
                  key={disease.id}
                  className="infectious-disease-card"
                  onClick={() => handleDiseaseClick(disease)}
                  style={{ cursor: isLoading ? "wait" : "pointer" }}>
                  {diseaseData?.이미지 && (
                    <div className="infectious-disease-image-container">
                      <img src={diseaseData.이미지} alt={disease.name} className="infectious-disease-image" />
                    </div>
                  )}

                  <div className="infectious-disease-content-area">
                    <div className="infectious-disease-category-badge">{disease.category}</div>
                    <h3 className="infectious-disease-name">{disease.name}</h3>
                    {diseaseData?.전체증상목록 && (
                      <div className="infectious-disease-symptoms">
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
                  <button className="find-department-btn">진료과 찾기</button>
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

export default InfectiousDiseasePage;
