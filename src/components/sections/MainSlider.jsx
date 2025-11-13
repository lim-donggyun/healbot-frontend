import React, { useEffect } from "react";

const slides = [
  {
    title: "환자 최우선의 초일류 병원",
    description: "고려대학교 구로병원이 여러분의 건강한 내일을 책임집니다",
    buttonText: "자세히 보기",
  },
  {
    title: "첨단 의료 시스템",
    description: "최신 의료 장비와 우수한 의료진으로 최상의 진료를 제공합니다",
    buttonText: "진료과 보기",
  },
  {
    title: "24시간 응급의료센터",
    description:
      "365일 24시간 응급환자를 위한 신속한 진료 체계를 갖추고 있습니다",
    buttonText: "응급실 안내",
  },
];

function MainSlider() {
  useEffect(() => {
    let currentSlide = 0;
    const slideElements = document.querySelectorAll(".slide");
    const slideDots = document.querySelectorAll(".slider-controls .slider-dot");

    function changeSlide(index) {
      if (!slideElements.length) return;
      slideElements[currentSlide].classList.remove("active");
      slideDots[currentSlide].classList.remove("active");

      currentSlide = index;

      slideElements[currentSlide].classList.add("active");
      slideDots[currentSlide].classList.add("active");
    }

    slideDots.forEach((dot, index) => {
      dot.addEventListener("click", () => changeSlide(index));
    });

    const slideInterval = setInterval(() => {
      if (!slideElements.length) return;
      const nextIndex = (currentSlide + 1) % slideElements.length;
      changeSlide(nextIndex);
    }, 5000);

    return () => {
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <section id="main" className="section section-main">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${index === 0 ? "active" : ""}`}>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
            <button className="slide-btn">{slide.buttonText}</button>
          </div>
        ))}
        <div className="slider-controls">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${index === 0 ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MainSlider;
