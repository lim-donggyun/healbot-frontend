import React, { useState } from "react";
import "./SeasonalHealthPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { seasonalHealthList } from "../data/seasonalHealthData";

function SeasonalHealthPage() {
  const [selectedCategory, setSelectedCategory] = useState("봄");

  // 카테고리별 필터링
  const categories = ["봄", "여름", "가을", "겨울"];

  const filteredHealth = seasonalHealthList.filter((item) => item.category === selectedCategory);

  return (
    <div className="seasonal-health-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="seasonal-health-page-container">
        {/* 페이지 헤더 */}
        <div className="seasonal-page-header">
          <div className="header-content">
            <h1>계절 건강</h1>
            <p className="header-subtitle">계절별 건강 관리 방법을 확인하세요</p>
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

        {/* 계절 건강 그리드 */}
        <div className="seasonal-health-content">
          <div className="seasonal-health-grid">
            {filteredHealth.map((item) => (
              <div key={item.id} className="seasonal-health-card">
                <div className="seasonal-health-image-container">
                  <img src={item.image} alt={item.name} className="seasonal-health-image" />
                </div>

                <div className="seasonal-health-content-area">
                  <h3 className="seasonal-health-name">{item.name}</h3>
                  <p className="seasonal-health-description">{item.description}</p>
                  <p className="seasonal-health-details">{item.details}</p>

                  <div className="seasonal-health-tips">
                    <div className="tips-title">실천 방법</div>
                    <div className="tips-list">
                      {item.tips.map((tip, idx) => (
                        <span key={idx} className="tip-badge">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SeasonalHealthPage;
