import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

const questions = [
  "일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못함",
  "기분이 가라앉거나, 우울하거나, 희망이 없다고 느낌",
  "잠이 들거나 계속 잠을 자는 것이 어려움, 또는 잠을 너무 많이 잠",
  "피곤하다고 느끼거나 기운이 거의 없음",
  "식욕이 줄었거나 과식을 함",
  "자신을 부정적으로 봄 - 혹은 자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴",
  "신문을 읽거나 텔레비전 보는 것과 같은 일에 집중하기가 어려움",
  "다른 사람들이 주목할 정도로 너무 느리게 움직이거나 말을 함. 또는 반대로 평상시보다 많이 움직여서, 너무 안절부절못하거나 들떠 있음",
  "자신이 죽는 것이 더 낫다고 생각하거나 자해를 생각함",
];

const options = [
  { label: "전혀 그렇지 않다", value: 0 },
  { label: "며칠 동안", value: 1 },
  { label: "7일 이상", value: 2 },
  { label: "거의 매일", value: 3 },
];

function DepressionTestModal({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((sum, val) => sum + (val || 0), 0);

    if (total < 5) {
      return {
        level: "정상",
        color: "#28a745",
        description: "우울 증상이 거의 없는 정상 상태입니다.",
        recommendation: "현재 상태를 유지하며, 규칙적인 생활과 운동을 계속하세요."
      };
    } else if (total < 10) {
      return {
        level: "경도 우울",
        color: "#ffc107",
        description: "가벼운 우울 증상이 있습니다.",
        recommendation: "스트레스 관리와 충분한 휴식이 필요합니다. 증상이 2주 이상 지속되면 상담을 고려하세요."
      };
    } else if (total < 15) {
      return {
        level: "중등도 우울",
        color: "#fd7e14",
        description: "중간 정도의 우울 증상을 보이고 있습니다.",
        recommendation: "전문가 상담을 권장합니다. 적절한 치료로 증상이 호전될 수 있습니다."
      };
    } else if (total < 20) {
      return {
        level: "중고도 우울",
        color: "#dc3545",
        description: "상당한 우울 증상이 있습니다.",
        recommendation: "즉시 정신건강의학과 전문의 상담을 받으시기 바랍니다."
      };
    } else {
      return {
        level: "심각한 우울",
        color: "#c82333",
        description: "매우 심각한 우울 상태입니다.",
        recommendation: "긴급하게 전문의 진료가 필요합니다. 즉시 가까운 병원을 방문하세요."
      };
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  const result = showResult ? calculateResult() : null;
  const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="self-test-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {!showResult ? (
          <>
            <div className="modal-header">
              <h2>우울증 선별검사 (PHQ-9)</h2>
              <p className="modal-subtitle">지난 2주 동안 다음의 문제들로 인해 얼마나 자주 불편을 느꼈나요?</p>
              <p className="modal-subtitle">총 {questions.length}문항 · {currentQuestion + 1}/{questions.length}</p>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="question-section">
              <p className="question-number">Q{currentQuestion + 1}</p>
              <p className="question-text">{questions[currentQuestion]}</p>

              <div className="options-grid">
                {options.map((option) => (
                  <button
                    key={option.value}
                    className={`option-btn ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                ← 이전
              </button>
              <span className="question-indicator">
                {currentQuestion + 1} / {questions.length}
              </span>
              <button
                className="nav-btn next-btn"
                onClick={() => handleAnswer(answers[currentQuestion])}
                disabled={answers[currentQuestion] === null}
              >
                {currentQuestion === questions.length - 1 ? '결과 보기' : '다음 →'}
              </button>
            </div>
          </>
        ) : (
          <div className="result-section">
            <div className="modal-header">
              <h2>검사 결과</h2>
            </div>

            <div className="result-card">
              <div className="result-score" style={{ borderColor: result.color }}>
                <div className="score-label">총점</div>
                <div className="score-value" style={{ color: result.color }}>{totalScore}점</div>
                <div className="score-max">/ 27점</div>
              </div>

              <div className="result-level" style={{ backgroundColor: result.color }}>
                {result.level}
              </div>

              <div className="result-description">
                <p><strong>{result.description}</strong></p>
                <p>{result.recommendation}</p>
              </div>

              <div className="result-notice">
                <p>⚠️ 본 검사는 선별 도구이며 전문적인 진단을 대체할 수 없습니다.</p>
                <p>우울감이 2주 이상 지속되거나 일상생활에 지장이 있다면 반드시 전문의와 상담하세요.</p>
              </div>

              <div className="result-actions">
                <button className="action-btn secondary" onClick={restartTest}>
                  다시 검사하기
                </button>
                <button className="action-btn primary" onClick={onClose}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepressionTestModal;
