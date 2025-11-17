import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

const questions = [
  "초조하거나 불안하거나 조마조마하게 느낌",
  "걱정하는 것을 멈추거나 조절할 수 없음",
  "여러 가지 것들에 대해 걱정을 너무 많이 함",
  "편하게 있기가 어려움",
  "너무 안절부절못해서 가만히 있기 힘듦",
  "쉽게 짜증이 나거나 쉽게 성을 냄",
  "마치 끔찍한 일이 일어날 것 같아 두려움",
];

const options = [
  { label: "전혀 그렇지 않다", value: 0 },
  { label: "며칠 동안", value: 1 },
  { label: "7일 이상", value: 2 },
  { label: "거의 매일", value: 3 },
];

function AnxietyTestModal({ onClose }) {
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
        description: "불안 증상이 거의 없는 정상 상태입니다.",
        recommendation: "건강한 상태를 유지하세요. 규칙적인 생활과 적절한 운동이 도움이 됩니다."
      };
    } else if (total < 10) {
      return {
        level: "경도 불안",
        color: "#ffc107",
        description: "가벼운 불안 증상이 있습니다.",
        recommendation: "스트레스 관리와 이완 기법(명상, 호흡 운동 등)을 시도해보세요."
      };
    } else if (total < 15) {
      return {
        level: "중등도 불안",
        color: "#fd7e14",
        description: "중간 정도의 불안 증상을 보이고 있습니다.",
        recommendation: "전문가 상담을 권장합니다. 인지행동치료가 효과적일 수 있습니다."
      };
    } else {
      return {
        level: "심각한 불안",
        color: "#dc3545",
        description: "심각한 수준의 불안 증상입니다.",
        recommendation: "즉시 정신건강의학과 전문의 상담을 받으시기 바랍니다."
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {!showResult ? (
          <>
            <div className="modal-header">
              <h2>불안장애 체크 (GAD-7)</h2>
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
                <div className="score-max">/ 21점</div>
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
                <p>불안 증상이 지속되거나 일상생활에 지장이 있다면 반드시 전문의와 상담하세요.</p>
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

export default AnxietyTestModal;
