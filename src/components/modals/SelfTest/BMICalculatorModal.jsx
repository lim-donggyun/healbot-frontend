import React, { useState, useEffect } from "react";
import "./SelfTestModal.css";

function BMICalculatorModal({ onClose }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [bmi, setBmi] = useState(0);

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

  const calculateBMI = (e) => {
    e.preventDefault();

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(calculatedBMI);
      setShowResult(true);
    }
  };

  const getBMICategory = () => {
    if (bmi < 18.5) {
      return {
        level: "저체중",
        color: "#17a2b8",
        description: "현재 체중이 정상보다 낮습니다.",
        recommendation: "균형 잡힌 영양 섭취와 적절한 운동으로 건강한 체중을 유지하세요.",
        healthRisks: ["영양 결핍 위험", "면역력 저하", "골다공증 위험 증가"],
        range: "18.5 미만"
      };
    } else if (bmi < 23) {
      return {
        level: "정상",
        color: "#28a745",
        description: "건강한 체중 범위입니다.",
        recommendation: "현재 체중을 유지하세요. 규칙적인 운동과 균형 잡힌 식사를 계속하세요.",
        healthRisks: ["건강한 상태입니다"],
        range: "18.5 ~ 22.9"
      };
    } else if (bmi < 25) {
      return {
        level: "과체중",
        color: "#ffc107",
        description: "체중이 정상보다 약간 높습니다.",
        recommendation: "식습관 개선과 규칙적인 운동으로 체중 관리가 필요합니다.",
        healthRisks: ["대사증후군 주의", "심혈관 질환 위험 증가"],
        range: "23.0 ~ 24.9"
      };
    } else if (bmi < 30) {
      return {
        level: "비만",
        color: "#fd7e14",
        description: "비만 단계입니다.",
        recommendation: "체중 감량이 필요합니다. 전문가의 도움을 받아 체계적인 체중 관리 프로그램을 시작하세요.",
        healthRisks: ["당뇨병 위험", "고혈압", "심혈관 질환", "관절 질환"],
        range: "25.0 ~ 29.9"
      };
    } else {
      return {
        level: "고도비만",
        color: "#dc3545",
        description: "고도비만 상태로 건강에 위험할 수 있습니다.",
        recommendation: "즉시 의료 전문가와 상담하여 체중 관리 계획을 수립하시기 바랍니다.",
        healthRisks: ["심각한 대사질환 위험", "수면무호흡증", "암 발생률 증가", "수명 단축"],
        range: "30.0 이상"
      };
    }
  };

  const getIdealWeight = () => {
    const heightInMeters = parseFloat(height) / 100;
    const idealBMI = 21.5;
    const ideal = idealBMI * heightInMeters * heightInMeters;
    return ideal.toFixed(1);
  };

  const getWeightDifference = () => {
    const ideal = parseFloat(getIdealWeight());
    const current = parseFloat(weight);
    const diff = current - ideal;
    return diff.toFixed(1);
  };

  const getBMR = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageNum = parseFloat(age);

    if (gender === "male") {
      return Math.round(10 * weightInKg + 6.25 * heightInCm - 5 * ageNum + 5);
    } else {
      return Math.round(10 * weightInKg + 6.25 * heightInCm - 5 * ageNum - 161);
    }
  };

  const getTDEE = () => {
    const bmr = getBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
  };

  const restartCalculator = () => {
    setHeight("");
    setWeight("");
    setAge("");
    setGender("");
    setActivityLevel("");
    setShowResult(false);
    setBmi(0);
  };

  const result = showResult ? getBMICategory() : null;
  const weightDiff = showResult ? parseFloat(getWeightDifference()) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="self-test-modal-content bmi-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {!showResult ? (
          <>
            <div className="modal-header">
              <h2>⚖️ 건강 지수 계산기</h2>
              <p className="modal-subtitle">체질량지수(BMI)와 기초대사량을 확인하세요</p>
            </div>

            <form className="bmi-form" onSubmit={calculateBMI}>
              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="height">키 (cm)</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="예: 170"
                    min="100"
                    max="250"
                    step="0.1"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="weight">체중 (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="예: 65"
                    min="20"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="age">나이</label>
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="예: 30"
                    min="10"
                    max="120"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>성별</label>
                  <div className="gender-buttons">
                    <button
                      type="button"
                      className={`gender-btn ${gender === 'male' ? 'selected' : ''}`}
                      onClick={() => setGender('male')}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      className={`gender-btn ${gender === 'female' ? 'selected' : ''}`}
                      onClick={() => setGender('female')}
                    >
                      여성
                    </button>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="activity">활동 수준</label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="sedentary">거의 운동 안함 (주 0-1회)</option>
                  <option value="light">가벼운 운동 (주 1-3회)</option>
                  <option value="moderate">보통 운동 (주 3-5회)</option>
                  <option value="active">활발한 운동 (주 6-7회)</option>
                  <option value="veryActive">매우 활발한 운동 (하루 2회)</option>
                </select>
              </div>

              <button type="submit" className="calculate-btn">
                계산하기
              </button>
            </form>

            <div className="bmi-info">
              <h3>BMI 기준 (한국 기준)</h3>
              <div className="bmi-scale">
                <div className="bmi-bar">
                  <div className="bmi-section" style={{backgroundColor: "#17a2b8", flex: "3.5"}}>
                    <span className="bmi-label">저체중</span>
                  </div>
                  <div className="bmi-divider">
                    <span className="bmi-value">18.5</span>
                  </div>
                  <div className="bmi-section" style={{backgroundColor: "#28a745", flex: "4.5"}}>
                    <span className="bmi-label">정상</span>
                  </div>
                  <div className="bmi-divider">
                    <span className="bmi-value">23</span>
                  </div>
                  <div className="bmi-section" style={{backgroundColor: "#ffc107", flex: "2"}}>
                    <span className="bmi-label">과체중</span>
                  </div>
                  <div className="bmi-divider">
                    <span className="bmi-value">25</span>
                  </div>
                  <div className="bmi-section" style={{backgroundColor: "#fd7e14", flex: "5"}}>
                    <span className="bmi-label">비만</span>
                  </div>
                  <div className="bmi-divider">
                    <span className="bmi-value">30</span>
                  </div>
                  <div className="bmi-section" style={{backgroundColor: "#dc3545", flex: "5"}}>
                    <span className="bmi-label">고도비만</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="result-section">
            <div className="modal-header">
              <h2>건강 지수 분석 결과</h2>
            </div>

            <div className="result-card">
              <div className="bmi-metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">BMI</div>
                  <div className="metric-value" style={{ color: result.color }}>
                    {bmi.toFixed(1)}
                  </div>
                  <div className="metric-unit">kg/m²</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">기초대사량</div>
                  <div className="metric-value" style={{ color: "#3284b1" }}>
                    {getBMR()}
                  </div>
                  <div className="metric-unit">kcal/일</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">권장 칼로리</div>
                  <div className="metric-value" style={{ color: "#3284b1" }}>
                    {getTDEE()}
                  </div>
                  <div className="metric-unit">kcal/일</div>
                </div>
              </div>

              <div className="body-stats">
                <div className="stat-item">
                  <span className="stat-label">현재 체중</span>
                  <span className="stat-value">{weight}kg</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">표준 체중</span>
                  <span className="stat-value">{getIdealWeight()}kg</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">체중 차이</span>
                  <span className="stat-value" style={{
                    color: weightDiff > 0 ? '#fd7e14' : weightDiff < 0 ? '#17a2b8' : '#28a745'
                  }}>
                    {weightDiff > 0 ? '+' : ''}{weightDiff}kg
                  </span>
                </div>
              </div>

              <div className="result-level" style={{ backgroundColor: result.color }}>
                {result.level} ({result.range})
              </div>

              <div className="result-description">
                <p><strong>{result.description}</strong></p>
                <p>{result.recommendation}</p>
              </div>

              <div className="health-risks">
                <h4>건강 위험도</h4>
                <ul>
                  {result.healthRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="result-notice">
                <p>ℹ️ BMI는 참고 지표이며, 근육량, 체지방률 등 개인차를 반영하지 못합니다.</p>
                <p>정확한 건강 상태는 전문의와 상담하시기 바랍니다.</p>
              </div>

              <div className="result-actions">
                <button className="action-btn secondary" onClick={restartCalculator}>
                  다시 계산하기
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

export default BMICalculatorModal;
