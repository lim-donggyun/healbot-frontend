import React from 'react';
import '../../../pages/Signup.css';

const Step3 = ({ formData }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    // 로그인 페이지로 이동
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <h1>일반 회원가입</h1>

      <div className="steps">
        <span>01. 약관동의</span>
        <span>02. 회원정보 입력</span>
        <span className="active">03. 회원가입 완료</span>
      </div>

      <div className="completion-section">
        <div className="completion-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="8 12 11 15 16 9"></polyline>
          </svg>
        </div>

        <h2 className="completion-title">회원가입이 완료되었습니다!</h2>

        <p className="completion-message">
          <strong>{formData.name}</strong>님, 환영합니다!<br />
          회원가입이 성공적으로 완료되었습니다.
        </p>

        <div className="completion-info">
          <div className="info-item">
            <span className="info-label">이메일</span>
            <span className="info-value">{formData.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">휴대폰</span>
            <span className="info-value">{formData.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">생년월일</span>
            <span className="info-value">{formData.birthdate}</span>
          </div>
        </div>

        <div className="completion-notice">
          <p>가입하신 이메일로 환영 메일이 발송되었습니다.</p>
          <p>로그인 후 모든 서비스를 이용하실 수 있습니다.</p>
        </div>
      </div>

      <div className="button-row">
        <button className="btn-cancel" onClick={handleGoHome}>홈으로</button>
        <button className="btn-next active" onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default Step3;
