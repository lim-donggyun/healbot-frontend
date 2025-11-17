import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

const questions = [
  "지난 한 달 동안, 아무 이유 없이 피곤하다고 느낀 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 긴장감을 느낀 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 너무 불안해서 어떤 것으로도 진정할 수 없었던 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 절망감을 느낀 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 안절부절못하거나 들떠 있다고 느낀 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 너무 안절부절못해서 가만히 앉아 있을 수 없었던 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 우울감을 느낀 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 모든 일이 힘들게 느껴진 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 너무 우울해서 어떤 것으로도 기분이 나아질 수 없었던 적이 얼마나 자주 있었나요?",
  "지난 한 달 동안, 본인이 가치 없는 사람이라고 느낀 적이 얼마나 자주 있었나요?",
];

const options = [
  { label: "전혀 없음", value: 1 },
  { label: "가끔", value: 2 },
  { label: "자주", value: 3 },
  { label: "거의 항상", value: 4 },
  { label: "항상", value: 5 },
];

function StressTestModal({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;

    // 모달이 열릴 때 html, body 스크롤 막기
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // 모달이 닫힐 때 html, body 스크롤 복구
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

    if (total < 20) {
      return {
        level: "정상",
        color: "#28a745",
        description: "현재 스트레스 수준이 정상 범위입니다.",
        recommendation: "현재의 건강한 생활습관을 유지하세요."
      };
    } else if (total < 25) {
      return {
        level: "경도",
        color: "#ffc107",
        description: "가벼운 스트레스 증상이 있습니다.",
        recommendation: "충분한 휴식과 스트레스 관리가 필요합니다."
      };
    } else if (total < 30) {
      return {
        level: "중등도",
        color: "#fd7e14",
        description: "중간 수준의 스트레스를 경험하고 있습니다.",
        recommendation: "전문가 상담을 고려해보시기 바랍니다."
      };
    } else {
      return {
        level: "심각",
        color: "#dc3545",
        description: "심각한 스트레스 상태입니다.",
        recommendation: "즉시 전문의 상담을 받으시길 권장합니다."
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
              <h2>스트레스 자가진단 (K10)</h2>
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
                다음 →
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
                <div className="score-max">/ 50점</div>
              </div>

              <div className="result-level" style={{ backgroundColor: result.color }}>
                {result.level}
              </div>

              <div className="result-description">
                <p><strong>{result.description}</strong></p>
                <p>{result.recommendation}</p>
              </div>

              <div className="result-notice">
                <p>⚠️ 본 검사는 참고용이며 전문적인 진단을 대체할 수 없습니다.</p>
                <p>증상이 지속되거나 심각한 경우 반드시 전문의와 상담하시기 바랍니다.</p>
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

export default StressTestModal;
