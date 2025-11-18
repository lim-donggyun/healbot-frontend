import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { searchDiseases } from "../utils/api";
import { FaSearch, FaLightbulb, FaHospital, FaPills, FaBell, FaComments } from "react-icons/fa";
import "./SearchResultPage.css";

function SearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state?.searchData;

  // 탭 상태
  const [activeTab, setActiveTab] = useState("integrated");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState({
    hospitals: 1,
    diseases: 1,
    notices: 1,
    communities: 1
  });

  // 질병 상세 모달 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

  // 섹션 ref
  const hospitalSectionRef = useRef(null);
  const diseaseSectionRef = useRef(null);
  const noticeSectionRef = useRef(null);
  const communitySectionRef = useRef(null);

  const ITEMS_PER_PAGE = {
    hospitals: 5,
    diseases: 10,
    notices: 2,
    communities: 2
  };

  if (!searchData) {
    return (
      <div className="search-result-page-wrapper">
        <Header />
        <div className="search-result-container">
          <div className="no-search-data">
            <h2>검색 결과가 없습니다</h2>
            <p>검색어를 입력해주세요.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { keyword, symptomInfo, matchedSymptoms = [], results } = searchData;
  const { hospitals = [], diseases = [], notices = null, communities = null } = results || {};

  // 증상으로 질병 검색
  const handleSymptomSearch = async () => {
    if (!matchedSymptoms || matchedSymptoms.length === 0) return;

    try {
      const result = await searchDiseases(matchedSymptoms);
      navigate("/disease-result", {
        state: {
          diseaseData: result,
          symptoms: matchedSymptoms
        }
      });
    } catch (error) {
      console.error("증상 검색 실패:", error);
      alert("증상 검색 중 오류가 발생했습니다.");
    }
  };

  // 키워드 하이라이트 함수 (띄어쓰기 무시)
  const highlightKeyword = (text, keyword) => {
    if (!text || !keyword) return text;

    // 띄어쓰기를 제거한 키워드와 텍스트로 매칭
    const keywordNoSpace = keyword.replace(/\s/g, '');
    const textNoSpace = text.replace(/\s/g, '');

    // 띄어쓰기 제거한 텍스트에서 키워드 위치 찾기
    const lowerTextNoSpace = textNoSpace.toLowerCase();
    const lowerKeywordNoSpace = keywordNoSpace.toLowerCase();
    const startIndex = lowerTextNoSpace.indexOf(lowerKeywordNoSpace);

    if (startIndex === -1) return text;

    // 원본 텍스트에서 매칭되는 부분 찾기
    let currentIndex = 0;
    let charCount = 0;
    let matchStart = -1;
    let matchEnd = -1;

    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        if (charCount === startIndex && matchStart === -1) {
          matchStart = i;
        }
        charCount++;
        if (charCount === startIndex + keywordNoSpace.length) {
          matchEnd = i + 1;
          break;
        }
      }
    }

    if (matchStart === -1 || matchEnd === -1) return text;

    return (
      <>
        {text.substring(0, matchStart)}
        <span className="highlight">{text.substring(matchStart, matchEnd)}</span>
        {text.substring(matchEnd)}
      </>
    );
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tab, sectionRef) => {
    setActiveTab(tab);
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 페이지네이션 함수
  const getPaginatedItems = (items, category) => {
    const startIndex = (currentPage[category] - 1) * ITEMS_PER_PAGE[category];
    const endIndex = startIndex + ITEMS_PER_PAGE[category];
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items, category) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE[category]);
  };

  const handlePageChange = (category, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [category]: page
    }));
  };

  // 페이지네이션 컴포넌트
  const Pagination = ({ category, totalItems }) => {
    const totalPages = getTotalPages(totalItems, category);
    if (totalPages <= 1) return null;

    const current = currentPage[category];
    const maxVisible = 5;

    // 현재 페이지가 속한 그룹의 시작 페이지 계산 (1-5, 6-10, 11-15...)
    const currentGroup = Math.ceil(current / maxVisible);
    const startPage = (currentGroup - 1) * maxVisible + 1;
    const endPage = Math.min(currentGroup * maxVisible, totalPages);

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    // 이전 그룹으로 이동
    const handlePrevGroup = () => {
      const prevGroupLastPage = startPage - 1;
      if (prevGroupLastPage >= 1) {
        handlePageChange(category, prevGroupLastPage);
      }
    };

    // 다음 그룹으로 이동
    const handleNextGroup = () => {
      const nextGroupFirstPage = endPage + 1;
      if (nextGroupFirstPage <= totalPages) {
        handlePageChange(category, nextGroupFirstPage);
      }
    };

    return (
      <div className="pagination">
        {/* 이전 버튼 */}
        <button
          className="pagination-nav-btn"
          onClick={handlePrevGroup}
          disabled={startPage === 1}
        >
          이전
        </button>

        {/* 페이지 번호 */}
        {pageNumbers.map(page => (
          <button
            key={page}
            className={`pagination-btn ${current === page ? 'active' : ''}`}
            onClick={() => handlePageChange(category, page)}
          >
            {page}
          </button>
        ))}

        {/* 다음 버튼 */}
        <button
          className="pagination-nav-btn"
          onClick={handleNextGroup}
          disabled={endPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <div className="search-result-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="search-result-container">
        {/* 페이지 헤더 */}
        <div className="search-result-header">
          <h1>
            <FaSearch className="search-icon" />
            "{keyword}" 검색 결과
          </h1>
        </div>

        {/* 탭 메뉴 */}
        <div className="tab-menu">
          <button
            className={`tab-btn ${activeTab === "integrated" ? "active" : ""}`}
            onClick={() => setActiveTab("integrated")}
          >
            통합검색 ({hospitals.length + diseases.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "hospitals" ? "active" : ""}`}
            onClick={() => handleTabClick("hospitals", hospitalSectionRef)}
          >
            병원 ({hospitals.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "diseases" ? "active" : ""}`}
            onClick={() => handleTabClick("diseases", diseaseSectionRef)}
          >
            질병 ({diseases.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "notices" ? "active" : ""}`}
            onClick={() => handleTabClick("notices", noticeSectionRef)}
          >
            공지사항 (0)
          </button>
          <button
            className={`tab-btn ${activeTab === "communities" ? "active" : ""}`}
            onClick={() => handleTabClick("communities", communitySectionRef)}
          >
            커뮤니티 (0)
          </button>
        </div>

        {/* 증상 정보 카드 (있을 경우) */}
        {symptomInfo && activeTab === "integrated" && (
          <div className="symptom-info-card">
            <div className="symptom-info-header">
              <FaLightbulb className="symptom-icon" />
              <h2>증상 정보</h2>
            </div>
            <div className="symptom-info-body">
              {symptomInfo.split('\n\n').map((symptomText, index) => {
                const [symptomName, ...descParts] = symptomText.split(': ');
                const description = descParts.join(': ');
                return (
                  <div key={index} className="symptom-item">
                    <h3>{symptomName}</h3>
                    <p>{description}</p>
                  </div>
                );
              })}
              <button className="symptom-search-btn" onClick={handleSymptomSearch}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                해당 증상으로 질병 검색하기
              </button>
            </div>
          </div>
        )}

        {/* 통합검색 탭 */}
        {activeTab === "integrated" && (
          <>
            {/* 병원 검색 결과 - 통합검색에서는 상위 5개만 */}
            {hospitals.length > 0 && (
              <div className="result-section">
                <div className="result-section-header">
                  <h2>
                    <FaHospital className="section-icon" />
                    병원 (총 {hospitals.length}건)
                  </h2>
                  {hospitals.length > 5 && (
                    <button
                      className="more-btn"
                      onClick={() => handleTabClick("hospitals", hospitalSectionRef)}
                    >
                      더보기 +
                    </button>
                  )}
                </div>
                <div className="result-section-body">
                  <div className="hospital-list">
                    {hospitals.slice(0, 5).map((hospital, index) => (
                      <div key={index} className="list-item">
                        <h3>{highlightKeyword(hospital.hospitalName, keyword)}</h3>
                        <p className="hospital-address">{highlightKeyword(hospital.address, keyword)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 질병 검색 결과 - 통합검색에서는 상위 4개만 2x2 그리드 */}
            {diseases.length > 0 && (
              <div className="result-section">
                <div className="result-section-header">
                  <h2>
                    <FaPills className="section-icon" />
                    질병 (총 {diseases.length}건)
                  </h2>
                  {diseases.length > 4 && (
                    <button
                      className="more-btn"
                      onClick={() => handleTabClick("diseases", diseaseSectionRef)}
                    >
                      더보기 +
                    </button>
                  )}
                </div>
                <div className="result-section-body">
                  <div className="disease-grid-2x2">
                    {diseases.slice(0, 4).map((disease, index) => {
                      // 대소문자 모두 처리
                      const imageUrl = disease.imageUrl || disease.IMAGEURL || disease.imageurl;
                      const diseaseName = disease.diseaseName || disease.DISEASENAME || disease.diseasename;
                      const description = disease.description || disease.DESCRIPTION;

                      return (
                        <div
                          key={index}
                          className="disease-card-horizontal"
                          onClick={() => {
                            setSelectedDisease(disease);
                            setShowDetailModal(true);
                          }}
                        >
                          {imageUrl && (
                            <div className="disease-image">
                              <img src={imageUrl} alt={diseaseName} />
                            </div>
                          )}
                          <div className="disease-content">
                            <h3>{highlightKeyword(diseaseName, keyword)}</h3>
                            <p className="disease-description">
                              {highlightKeyword(description?.substring(0, 100), keyword)}...
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 공지사항 검색 결과 - 통합검색에서는 상위 2개만 */}
            {notices && notices.length > 0 && (
              <div className="result-section">
                <div className="result-section-header">
                  <h2>
                    <FaBell className="section-icon" />
                    공지사항 (총 {notices.length}건)
                  </h2>
                  {notices.length > 2 && (
                    <button
                      className="more-btn"
                      onClick={() => handleTabClick("notices", noticeSectionRef)}
                    >
                      더보기 +
                    </button>
                  )}
                </div>
                <div className="result-section-body">
                  <div className="hospital-list">
                    {notices.slice(0, 2).map((notice, index) => (
                      <div key={index} className="list-item">
                        <h3>{highlightKeyword(notice.title, keyword)}</h3>
                        <p>{highlightKeyword(notice.content?.substring(0, 100), keyword)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 커뮤니티 검색 결과 - 통합검색에서는 상위 2개만 */}
            {communities && communities.length > 0 && (
              <div className="result-section">
                <div className="result-section-header">
                  <h2>
                    <FaComments className="section-icon" />
                    커뮤니티 (총 {communities.length}건)
                  </h2>
                  {communities.length > 2 && (
                    <button
                      className="more-btn"
                      onClick={() => handleTabClick("communities", communitySectionRef)}
                    >
                      더보기 +
                    </button>
                  )}
                </div>
                <div className="result-section-body">
                  <div className="hospital-list">
                    {communities.slice(0, 2).map((community, index) => (
                      <div key={index} className="list-item">
                        <h3>{highlightKeyword(community.title, keyword)}</h3>
                        <p>{highlightKeyword(community.content?.substring(0, 100), keyword)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 병원 탭 */}
        {activeTab === "hospitals" && (
          <div className="result-section" ref={hospitalSectionRef}>
            <div className="result-section-header">
              <h2>
                <FaHospital className="section-icon" />
                병원 (총 {hospitals.length}건)
              </h2>
            </div>
            <div className="result-section-body">
              {hospitals.length === 0 ? (
                <div className="no-results">검색 결과가 없습니다.</div>
              ) : (
                <>
                  <div className="hospital-list">
                    {getPaginatedItems(hospitals, 'hospitals').map((hospital, index) => (
                      <div key={index} className="list-item">
                        <h3>{highlightKeyword(hospital.hospitalName, keyword)}</h3>
                        <p className="hospital-address">{highlightKeyword(hospital.address, keyword)}</p>
                      </div>
                    ))}
                  </div>
                  <Pagination category="hospitals" totalItems={hospitals} />
                </>
              )}
            </div>
          </div>
        )}

        {/* 질병 탭 - 5줄 2x2 그리드로 10개씩 */}
        {activeTab === "diseases" && (
          <div className="result-section" ref={diseaseSectionRef}>
            <div className="result-section-header">
              <h2>
                <FaPills className="section-icon" />
                질병 (총 {diseases.length}건)
              </h2>
            </div>
            <div className="result-section-body">
              {diseases.length === 0 ? (
                <div className="no-results">검색 결과가 없습니다.</div>
              ) : (
                <>
                  <div className="disease-grid-2x2">
                    {getPaginatedItems(diseases, 'diseases').map((disease, index) => {
                      // 대소문자 모두 처리
                      const imageUrl = disease.imageUrl || disease.IMAGEURL || disease.imageurl;
                      const diseaseName = disease.diseaseName || disease.DISEASENAME || disease.diseasename;
                      const description = disease.description || disease.DESCRIPTION;

                      return (
                        <div
                          key={index}
                          className="disease-card-horizontal"
                          onClick={() => {
                            setSelectedDisease(disease);
                            setShowDetailModal(true);
                          }}
                        >
                          {imageUrl && (
                            <div className="disease-image">
                              <img src={imageUrl} alt={diseaseName} />
                            </div>
                          )}
                          <div className="disease-content">
                            <h3>{highlightKeyword(diseaseName, keyword)}</h3>
                            <p className="disease-description">
                              {highlightKeyword(description?.substring(0, 150), keyword)}...
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Pagination category="diseases" totalItems={diseases} />
                </>
              )}
            </div>
          </div>
        )}

        {/* 공지사항 탭 */}
        {activeTab === "notices" && (
          <div className="result-section" ref={noticeSectionRef}>
            <div className="result-section-header">
              <h2>
                <FaBell className="section-icon" />
                공지사항 (총 0건)
              </h2>
            </div>
            <div className="result-section-body">
              <div className="no-results">검색 결과가 없습니다.</div>
            </div>
          </div>
        )}

        {/* 커뮤니티 탭 */}
        {activeTab === "communities" && (
          <div className="result-section" ref={communitySectionRef}>
            <div className="result-section-header">
              <h2>
                <FaComments className="section-icon" />
                커뮤니티 (총 0건)
              </h2>
            </div>
            <div className="result-section-body">
              <div className="no-results">검색 결과가 없습니다.</div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* 질병 상세 정보 모달 */}
      {showDetailModal && selectedDisease && (() => {
        // 대소문자 모두 처리
        const imageUrl = selectedDisease.imageUrl || selectedDisease.IMAGEURL || selectedDisease.imageurl;
        const diseaseName = selectedDisease.diseaseName || selectedDisease.DISEASENAME || selectedDisease.diseasename;
        const description = selectedDisease.description || selectedDisease.DESCRIPTION;
        const department = selectedDisease.department || selectedDisease.DEPARTMENT;
        const symptoms = selectedDisease.symptoms || selectedDisease.SYMPTOMS;

        return (
          <div className="detail-modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn-top" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
              <div className="detail-modal-body">
                <div className="detail-content-grid">
                  {/* 왼쪽: 이미지 */}
                  <div className="detail-left">
                    {imageUrl && (
                      <div className="detail-image-container">
                        <img
                          src={imageUrl}
                          alt={diseaseName}
                          className="detail-image"
                        />
                      </div>
                    )}
                    <button className="find-department-btn">
                      진료과 찾기
                    </button>
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="detail-right">
                    <div className="detail-section">
                      <h3 className="detail-section-title">질환명</h3>
                      <p className="detail-text">{diseaseName || "정보 없음"}</p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">진료과</h3>
                      <p className="detail-text">{department || "정보 없음"}</p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">설명</h3>
                      <p className="detail-text">{description || "정보 없음"}</p>
                    </div>

                    {symptoms && (
                      <div className="detail-section">
                        <h3 className="detail-section-title">증상</h3>
                        <div className="detail-symptoms-list">
                          {(typeof symptoms === "string"
                            ? symptoms.split(",").map((s) => s.trim())
                            : []
                          ).map((symptom, idx) => (
                            <span key={idx} className="detail-symptom-badge">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default SearchResultPage;
