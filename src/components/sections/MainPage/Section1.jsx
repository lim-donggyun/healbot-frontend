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
            <h1>환자 최우선의 초일류 병원</h1>
            <p>고려대학교 구로병원이 여러분의 건강한 내일을 책임집니다</p>
            <button className="slide-btn">자세히 보기</button>
          </div>
          <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
            <h1>첨단 의료 시스템</h1>
            <p>최신 의료 장비와 우수한 의료진으로 최상의 진료를 제공합니다</p>
            <button className="slide-btn">진료과 보기</button>
          </div>
          <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
            <h1>24시간 응급의료센터</h1>
            <p>365일 24시간 응급환자를 위한 신속한 진료 체계를 갖추고 있습니다</p>
            <button className="slide-btn">응급실 안내</button>
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
