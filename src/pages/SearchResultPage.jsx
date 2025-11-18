import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import "./SearchResultPage.css";

function SearchResultPage() {
  const location = useLocation();
  const searchData = location.state?.searchData;

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

  const { keyword, symptomInfo, results } = searchData;
  const { hospitals = [], diseases = [], notices = null, communities = null } = results || {};

  return (
    <div className="search-result-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="search-result-container">
        {/* 페이지 헤더 */}
        <div className="search-result-header">
          <h1>
            <span className="search-icon">🔍</span> "{keyword}" 검색 결과
          </h1>
        </div>

        {/* 증상 정보 카드 (있을 경우) */}
        {symptomInfo && (
          <div className="symptom-info-card">
            <div className="symptom-info-header">
              <span className="symptom-icon">💡</span>
              <h2>증상 정보</h2>
            </div>
            <div className="symptom-info-body">
              <h3>{keyword}</h3>
              <p>{symptomInfo}</p>
            </div>
          </div>
        )}

        {/* 병원 검색 결과 */}
        <div className="result-section">
          <div className="result-section-header">
            <h2>
              <span className="section-icon">🏥</span> 병원
            </h2>
            <span className="result-count">{hospitals.length}건</span>
          </div>
          <div className="result-section-body">
            {hospitals.length === 0 ? (
              <div className="no-results">검색 결과가 없습니다.</div>
            ) : (
              <div className="hospital-grid">
                {hospitals.map((hospital, index) => (
                  <div key={index} className="hospital-card">
                    <h3>{hospital.hospitalName}</h3>
                    <p className="hospital-address">{hospital.address}</p>
                    {hospital.phone && <p className="hospital-phone">📞 {hospital.phone}</p>}
                    {hospital.operatingHours && (
                      <p className="hospital-hours">🕐 {hospital.operatingHours}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 질병 검색 결과 */}
        <div className="result-section">
          <div className="result-section-header">
            <h2>
              <span className="section-icon">💊</span> 질병
            </h2>
            <span className="result-count">{diseases.length}건</span>
          </div>
          <div className="result-section-body">
            {diseases.length === 0 ? (
              <div className="no-results">검색 결과가 없습니다.</div>
            ) : (
              <div className="disease-grid">
                {diseases.map((disease, index) => (
                  <div key={index} className="disease-card">
                    {disease.imageUrl && (
                      <img src={disease.imageUrl} alt={disease.diseaseName} />
                    )}
                    <h3>{disease.diseaseName}</h3>
                    <p className="disease-description">
                      {disease.description?.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 공지사항 검색 결과 */}
        <div className="result-section">
          <div className="result-section-header">
            <h2>
              <span className="section-icon">📢</span> 공지사항
            </h2>
            <span className="result-count">0건</span>
          </div>
          <div className="result-section-body">
            <div className="no-results">검색 결과가 없습니다.</div>
          </div>
        </div>

        {/* 커뮤니티 검색 결과 */}
        <div className="result-section">
          <div className="result-section-header">
            <h2>
              <span className="section-icon">💬</span> 커뮤니티
            </h2>
            <span className="result-count">0건</span>
          </div>
          <div className="result-section-body">
            <div className="no-results">검색 결과가 없습니다.</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SearchResultPage;
