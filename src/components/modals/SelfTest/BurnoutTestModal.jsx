import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

const questions = [
  "일 때문에 정서적으로 지쳐있다고 느낀다",
  "하루 일과가 끝나면 완전히 녹초가 된 느낌이다",
  "아침에 일어나 또 하루 일을 해야 한다고 생각하면 피곤함을 느낀다",
  "내가 하는 일이 사람들에게 긍정적인 영향을 미치고 있다고 느끼지 못한다",
  "업무에 대한 열정이 식었다고 느낀다",
  "업무와 관련된 사람들에게 냉담해졌다",
  "업무를 통해 가치 있는 많은 것들을 성취했다고 느낀다 (역채점)",
  "평소보다 업무에 대한 관심이 줄었다",
  "내 업무가 다른 사람들의 삶에 어떤 영향을 미치는지 관심이 없다",
  "업무 성과에 대해 냉소적이 되었다",
  "업무를 효과적으로 처리할 수 있다는 자신감이 있다 (역채점)",
  "나는 내 업무를 잘 해낼 수 있는 능력이 있다고 느낀다 (역채점)",
];

const options = [
  { label: "전혀 그렇지 않다", value: 0 },
  { label: "거의 그렇지 않다", value: 1 },
  { label: "가끔 그렇다", value: 2 },
  { label: "자주 그렇다", value: 3 },
  { label: "매우 자주 그렇다", value: 4 },
];

const reverseQuestions = [6, 10, 11]; // 7번째, 11번째, 12번째 질문 (인덱스 6, 10, 11)

function BurnoutTestModal({ onClose }) {
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
    const total = answers.reduce((sum, val, idx) => {
      const score = val || 0;
      // 역채점 문항 처리
      return sum + (reverseQuestions.includes(idx) ? 4 - score : score);
    }, 0);

    if (total < 18) {
      return {
        level: "정상",
        color: "#28a745",
        description: "번아웃 증상이 거의 없습니다.",
        recommendation: "현재 건강한 업무 상태를 유지하고 있습니다. 일과 삶의 균형을 계속 유지하세요."
      };
    } else if (total < 30) {
      return {
        level: "경미한 번아웃",
        color: "#ffc107",
        description: "가벼운 번아웃 증상이 나타나고 있습니다.",
        recommendation: "충분한 휴식과 취미 활동이 필요합니다. 업무 외 시간에 재충전하세요."
      };
    } else if (total < 42) {
      return {
        level: "중등도 번아웃",
        color: "#fd7e14",
        description: "상당한 번아웃 증상을 보이고 있습니다.",
        recommendation: "업무 패턴 조정이 필요합니다. 휴가나 전문가 상담을 고려해보세요."
      };
    } else {
      return {
        level: "심각한 번아웃",
        color: "#dc3545",
        description: "심각한 번아웃 상태입니다.",
        recommendation: "즉시 휴식이 필요하며 전문가 상담을 강력히 권장합니다. 업무 환경 변화를 고려하세요."
      };
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  const result = showResult ? calculateResult() : null;
  const totalScore = showResult
    ? answers.reduce((sum, val, idx) => {
        const score = val || 0;
        return sum + (reverseQuestions.includes(idx) ? 4 - score : score);
      }, 0)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="self-test-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {!showResult ? (
          <>
            <div className="modal-header">
              <h2>번아웃 증후군 테스트</h2>
              <p className="modal-subtitle">최근 업무와 관련하여 다음의 감정을 얼마나 자주 느꼈나요?</p>
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
                <div className="score-max">/ 48점</div>
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
                <p>번아웃 증상이 지속되면 업무 환경 개선 및 전문가 상담이 필요합니다.</p>
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

export default BurnoutTestModal;
