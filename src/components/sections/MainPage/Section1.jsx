import React, { useEffect, useState } from "react";

function MainSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoSlide = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  useEffect(() => {
    // 드래그 방지
    document.body.style.setProperty('user-select', 'none', 'important');
    document.body.style.setProperty('-webkit-user-select', 'none', 'important');
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [isAutoPlay]);

  return (
    <>
      {/* 섹션 1: 메인 비주얼 슬라이더 */}
      <section id="main" className="section section-main">
        <div className="slider-container">
          <div className={`slide ${currentSlide === 0 ? "active" : ""}`}>
            <h1>어디가 아프신가요?</h1>
            <p>증상을 입력하면 예상 질환과 적합한 진료과를 안내해드립니다</p>
            <a href="/disease-result" className="slide-btn">질환 찾기</a>
          </div>
          <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
            <h1>가장 빠른 병원 찾기</h1>
            <p>지도에서 내 주변 병원을 한눈에 확인하세요</p>
            <a href="/hospitals" className="slide-btn">병원 찾기</a>
          </div>
          <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
            <h1>응급실 빠른 찾기</h1>
            <p>응급 상황 시 가장 가까운 응급실을 실시간 안내</p>
            <a href="/hospitals?emergency=true" className="slide-btn">응급실 찾기</a>
          </div>
          <div className="slider-controls">
            <div className={`slider-dot ${currentSlide === 0 ? "active" : ""}`} onClick={() => changeSlide(0)}></div>
            <div className={`slider-dot ${currentSlide === 1 ? "active" : ""}`} onClick={() => changeSlide(1)}></div>
            <div className={`slider-dot ${currentSlide === 2 ? "active" : ""}`} onClick={() => changeSlide(2)}></div>
            <button className="slider-control-btn" id="playPauseBtn" onClick={toggleAutoSlide}>
              <span id="playPauseIcon">{isAutoPlay ? "❚❚" : "▶"}</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainSlider;
