import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

const questions = [
  "잠들기 어려운 정도",
  "잠을 유지하기 어려운 정도 (중간에 자주 깸)",
  "너무 일찍 깨는 정도",
  "현재 수면 패턴에 대해 얼마나 만족하십니까?",
  "수면 문제로 인해 낮 동안 생활(예: 피로, 일할 능력, 집중력, 기억력, 기분 등)이 얼마나 방해받고 있다고 생각하십니까?",
  "수면 문제로 인한 삶의 질 저하가 다른 사람들에게 얼마나 눈에 띈다고 생각하십니까?",
  "현재 수면 문제에 대해 얼마나 걱정하고 있습니까?",
];

const optionsForFirst3 = [
  { label: "전혀 없음", value: 0 },
  { label: "약간", value: 1 },
  { label: "보통", value: 2 },
  { label: "심함", value: 3 },
  { label: "매우 심함", value: 4 },
];

const optionsForSatisfaction = [
  { label: "매우 만족", value: 0 },
  { label: "만족", value: 1 },
  { label: "보통", value: 2 },
  { label: "불만족", value: 3 },
  { label: "매우 불만족", value: 4 },
];

const optionsForInterference = [
  { label: "전혀 없음", value: 0 },
  { label: "약간", value: 1 },
  { label: "어느 정도", value: 2 },
  { label: "많이", value: 3 },
  { label: "매우 많이", value: 4 },
];

function SleepTestModal({ onClose }) {
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

  const getOptionsForQuestion = (index) => {
    if (index < 3) return optionsForFirst3;
    if (index === 3) return optionsForSatisfaction;
    return optionsForInterference;
  };

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

    if (total < 8) {
      return {
        level: "불면증 없음",
        color: "#28a745",
        description: "임상적으로 유의미한 불면증이 없습니다.",
        recommendation: "현재의 좋은 수면 습관을 유지하세요. 규칙적인 수면 시간을 지키는 것이 중요합니다."
      };
    } else if (total < 15) {
      return {
        level: "경미한 불면증",
        color: "#ffc107",
        description: "역치 이하의 불면증 증상이 있습니다.",
        recommendation: "수면 위생을 개선하세요: 규칙적인 취침 시간, 카페인 제한, 침실 환경 개선 등을 시도해보세요."
      };
    } else if (total < 22) {
      return {
        level: "중등도 불면증",
        color: "#fd7e14",
        description: "중간 정도의 불면증 증상을 보이고 있습니다.",
        recommendation: "수면 전문의 상담을 권장합니다. 인지행동치료(CBT-I)가 효과적일 수 있습니다."
      };
    } else {
      return {
        level: "심각한 불면증",
        color: "#dc3545",
        description: "심각한 불면증 상태입니다.",
        recommendation: "즉시 수면 전문의나 정신건강의학과 전문의 상담을 받으시기 바랍니다."
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
              <h2>수면의 질 평가 (ISI)</h2>
              <p className="modal-subtitle">지난 2주 동안의 수면 패턴에 대해 답해주세요</p>
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
                {getOptionsForQuestion(currentQuestion).map((option) => (
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
                <div className="score-max">/ 28점</div>
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
                <p>불면증이 지속되면 수면의 질뿐만 아니라 전반적인 건강에도 영향을 미칠 수 있으니 전문가 상담을 권장합니다.</p>
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

export default SleepTestModal;
