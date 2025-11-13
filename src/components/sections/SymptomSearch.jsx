import React, { useState } from "react";
import BodyPartsSelector from "./BodyPartsSelector";
import QuickLinks from "./QuickLinks";
import AIChatbotSearch from "./AIChatbotSearch";
import SymptomSelector from "./SymptomSelector";

function SymptomSearch() {
  const [aiSymptoms, setAiSymptoms] = useState([]);
  const [showSymptomSelector, setShowSymptomSelector] = useState(false);

  const handleAISymptomsFound = (symptoms) => {
    setAiSymptoms(symptoms);
    setShowSymptomSelector(true);
  };

  const handleBodyPartClick = () => {
    setShowSymptomSelector(true);
  };

  return (
    <section id="search" className="section section-search">
      <div className="search-wrapper">
        <h1>어떤 증상이 있으신가요?</h1>

        {!showSymptomSelector ? (
          <>
            <BodyPartsSelector onBodyPartClick={handleBodyPartClick} />

            <div className="search-methods">
              <div>
                <p className="search-method-title">
                  ① 증상을 직접 입력해주세요
                </p>
                <div className="symptom-search-box">
                  <input
                    type="text"
                    className="symptom-search-input"
                    placeholder="예: 두통, 발열, 복통 등 증상을 입력하세요"
                    onFocus={() => setShowSymptomSelector(true)}
                  />
                  <button className="symptom-search-btn">검색하기</button>
                </div>
              </div>

              <AIChatbotSearch onSymptomsFound={handleAISymptomsFound} />
            </div>

            <QuickLinks />
          </>
        ) : (
          <div className="symptom-selector-wrapper">
            <button
              className="back-btn"
              onClick={() => setShowSymptomSelector(false)}
            >
              ← 뒤로가기
            </button>
            <SymptomSelector aiSymptoms={aiSymptoms} />
          </div>
        )}
      </div>
    </section>
  );
}

export default SymptomSearch;
