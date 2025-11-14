import React, { useState } from 'react';
import '../../../pages/Signup.css';

const Step2 = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [name, setName] = useState(formData.name || '');
  const [phone, setPhone] = useState(formData.phone || '');
  const [verificationCode, setVerificationCode] = useState(formData.verificationCode || '');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendCode = () => {
    if (!name || !phone) {
      alert('이름과 휴대폰 번호를 입력해주세요.');
      return;
    }
    setIsCodeSent(true);
    alert('인증번호가 발송되었습니다.');
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    if (verificationCode === '1234') {
      setIsVerified(true);
      updateFormData({ name, phone, verificationCode });
      alert('인증이 완료되었습니다.');
      nextStep();
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleNext = () => {
    if (!isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }
    updateFormData({ name, phone, verificationCode });
    nextStep();
  };

  const handlePrev = () => {
    updateFormData({ name, phone, verificationCode });
    prevStep();
  };

  return (
    <div className="container">
      <h1>일반 회원가입</h1>

      <div className="steps">
        <span>01. 약관동의</span>
        <span className="active">02. 사용자정보인증</span>
        <span>03. 회원정보 입력</span>
        <span>04. 회원가입 완료</span>
      </div>

      {!isCodeSent ? (
        <div className="verify-box">
          <div className="verify-icon">
            <svg viewBox="0 0 64 64" width="80" height="80">
              <rect x="12" y="20" width="40" height="28" rx="2" fill="none" stroke="#111" strokeWidth="2"/>
              <path d="M12 24 L32 36 L52 24" fill="none" stroke="#111" strokeWidth="2"/>
              <circle cx="32" cy="34" r="3" fill="#111"/>
            </svg>
          </div>
          <div className="verify-title">휴대폰 인증</div>
          <div className="verify-sub">본인 명의의 휴대폰으로 인증해주세요</div>

          <div className="verify-form">
            <div className="form-row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                disabled={isVerified}
              />
            </div>
            <div className="form-row">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="휴대폰 번호 (010-0000-0000)"
                disabled={isVerified}
              />
            </div>
          </div>

          <button className="verify-btn-main" onClick={handleSendCode}>
            인증하기
          </button>
        </div>
      ) : (
        <div className="verify-box">
          <div className="verify-icon">
            <svg viewBox="0 0 64 64" width="80" height="80">
              <rect x="12" y="20" width="40" height="28" rx="2" fill="none" stroke="#111" strokeWidth="2"/>
              <path d="M12 24 L32 36 L52 24" fill="none" stroke="#111" strokeWidth="2"/>
              <circle cx="32" cy="34" r="3" fill="#111"/>
            </svg>
          </div>
          <div className="verify-title">휴대폰 인증</div>
          <div className="verify-sub">
            등록하신 휴대폰으로 인증번호를 발송했습니다.<br />
            아래 입력창에 인증번호 6자리를 입력해주세요.
          </div>

          <div className="input-area">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
              maxLength="6"
            />
            <button className="verify-btn" onClick={handleVerifyCode}>
              확인
            </button>
          </div>
          <a href="#" className="resend" onClick={(e) => { e.preventDefault(); handleSendCode(); }}>
            인증번호 재전송
          </a>
        </div>
      )}

      <div className="nav-buttons">
        <button onClick={handlePrev}>이전단계</button>
        <button onClick={handleNext} disabled={!isVerified}>다음단계</button>
      </div>
    </div>
  );
};

export default Step2;
