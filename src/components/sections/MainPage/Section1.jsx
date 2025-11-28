import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainSlider() {
  const navigate = useNavigate();
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
            <h1>어디가 아프신가요?</h1>
            <p>증상을 입력하면 예상 질환과 적합한 진료과를 안내해드립니다</p>
            <button className="slide-btn" onClick={() => navigate('/disease-result')}>질환 찾기</button>
          </div>
          <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
            <h1>가장 빠른 병원 찾기</h1>
            <p>지도에서 내 주변 병원을 한눈에 확인하세요</p>
            <button className="slide-btn" onClick={() => navigate('/hospitals')}>병원 찾기</button>
          </div>
          <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
            <h1>응급실 빠른 찾기</h1>
            <p>응급 상황 시 가장 가까운 응급실을 실시간 안내</p>
            <button className="slide-btn" onClick={() => navigate('/hospitals?emergency=true')}>응급실 찾기</button>
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
