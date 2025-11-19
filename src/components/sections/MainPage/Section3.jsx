import React, { useState, useEffect } from "react";
import StressTestModal from "../../modals/SelfTest/StressTestModal";
import DepressionTestModal from "../../modals/SelfTest/DepressionTestModal";
import AnxietyTestModal from "../../modals/SelfTest/AnxietyTestModal";
import BurnoutTestModal from "../../modals/SelfTest/BurnoutTestModal";
import SleepTestModal from "../../modals/SelfTest/SleepTestModal";
import BMICalculatorModal from "../../modals/SelfTest/BMICalculatorModal";

const selfTests = [
  {
    id: "stress",
    title: "스트레스 자가진단",
    subtitle: "약 3분 소요",
    description: "일상생활에서 느끼는 스트레스 수준을 확인해보세요. K10 척도 기반 검사입니다.",
    image: "https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    id: "depression",
    title: "우울증 선별검사",
    subtitle: "약 3분 소요",
    description: "PHQ-9 기반 우울 증상을 체크합니다. 전문적인 평가가 필요한지 확인하세요.",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    id: "anxiety",
    title: "불안장애 체크",
    subtitle: "약 2분 소요",
    description: "GAD-7 척도를 통해 불안 증상의 정도를 측정합니다.",
    image: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    id: "burnout",
    title: "번아웃 증후군 테스트",
    subtitle: "약 4분 소요",
    description: "정서적 소진과 업무 관련 스트레스를 평가합니다. MBI 간소화 버전입니다.",
    image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    id: "sleep",
    title: "수면의 질 평가",
    subtitle: "약 2분 소요",
    description: "ISI(불면증 심각도 지수)를 통해 수면 문제를 확인합니다.",
    image: "https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
  {
    id: "bmi",
    title: "BMI 계산기",
    subtitle: "약 1분 소요",
    description: "키와 체중을 입력하여 체질량지수(BMI)를 계산하고 건강 상태를 확인하세요.",
    image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  },
];

function Section3() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (testId) => {
    setActiveModal(testId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    if (activeModal) {
      document.body.classList.add('modal-open');
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');
    };
  }, [activeModal]);

  return (
    <>
      <section id="self-test" className="section section-self-test">
        <div className="self-test-container">
          <div className="self-test-header">
            <h2>건강 자가진단</h2>
            <p>나의 건강 상태를 스스로 체크해보세요</p>
          </div>
          <div className="self-test-wrapper">
            {selfTests.map((test) => (
              <div key={test.id} className="test-card" onClick={() => openModal(test.id)}>
                <div className="test-card__card-link"></div>
                <img src={test.image} alt={test.title} className="test-card__image" />
                <div className="test-card__text-wrapper">
                  <h2 className="test-card__title">
                    <span className="test-card__icon">{test.icon}</span>
                    {test.title}
                  </h2>
                  <div className="test-card__post-date">{test.subtitle}</div>
                  <div className="test-card__details-wrapper">
                    <p className="test-card__excerpt">{test.description}</p>
                    <button className="test-card__read-more">
                      검사 시작 <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {activeModal === "stress" && <StressTestModal onClose={closeModal} />}
      {activeModal === "depression" && <DepressionTestModal onClose={closeModal} />}
      {activeModal === "anxiety" && <AnxietyTestModal onClose={closeModal} />}
      {activeModal === "burnout" && <BurnoutTestModal onClose={closeModal} />}
      {activeModal === "sleep" && <SleepTestModal onClose={closeModal} />}
      {activeModal === "bmi" && <BMICalculatorModal onClose={closeModal} />}
    </>
  );
}

export default Section3;
