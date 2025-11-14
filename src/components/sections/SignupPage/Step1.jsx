import React, { useState } from 'react';
import '../../../pages/Signup.css';

const Step1 = ({ formData, updateFormData, nextStep }) => {
  const [allAgree, setAllAgree] = useState(false);
  const [terms1, setTerms1] = useState(formData.terms1 || false);
  const [terms2, setTerms2] = useState(formData.terms2 || false);
  const [terms3, setTerms3] = useState(formData.terms3 || false);

  const handleAllAgree = () => {
    const newValue = !allAgree;
    setAllAgree(newValue);
    if (newValue) {
      setTerms1(true);
      setTerms2(true);
      setTerms3(true);
    } else {
      setTerms1(false);
      setTerms2(false);
      setTerms3(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('회원가입을 취소하시겠습니까?')) {
      window.location.href = '/';
    }
  };

  const handleNext = () => {
    if (!terms1 || !terms2) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    updateFormData({ terms1, terms2, terms3 });
    nextStep();
  };

  return (
    <div className="container">
      <h1>일반 회원가입</h1>

      <div className="steps">
        <span className="active">01. 약관동의</span>
        <span>02. 회원정보 입력</span>
        <span>03. 회원가입 완료</span>
      </div>

      <div className={`all-agree ${allAgree ? 'active' : ''}`} onClick={handleAllAgree} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        서비스 전체 약관에 동의합니다.
      </div>

      <h2>이용약관 (필수)</h2>
      <div className="box">
        <strong>HealBot 홈페이지 회원가입약관</strong><br /><br />
        제1조 (목적)<br />
        본 약관은 HealBot에서 운영하는 인터넷 홈페이지에서 제공하는 인터넷 관련 서비스(이하 "서비스")를
        이용함에 있어 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />
        제2조 (약관의 효력과 변경)<br />
        1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.<br />
        2. 회사는 필요하다고 인정되는 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력이 발생합니다.<br />
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms1"
            checked={terms1}
            onChange={() => setTerms1(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms1"
            checked={!terms1}
            onChange={() => setTerms1(false)}
          /> 동의하지 않습니다.
        </label>
      </div>

      <h2>개인정보 수집 및 이용 (필수)</h2>
      <div className="box">
        <strong>1. 개인정보의 수집 목적 및 이용</strong><br /><br />
        HealBot은 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br /><br />
        - 서비스 제공<br />
        - 회원관리<br />
        - 새로운 서비스 및 행사 정보 안내<br /><br />
        수집 항목: 이름, 이메일 등<br />
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms2"
            checked={terms2}
            onChange={() => setTerms2(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms2"
            checked={!terms2}
            onChange={() => setTerms2(false)}
          /> 동의하지 않습니다.
        </label>
      </div>

      <h2>수집하는 개인정보 및 마케팅 광고활용 (선택)</h2>
      <div className="box auto-height">
        수집한 개인정보의 마케팅 및 광고 활용에 동의합니다.
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms3"
            checked={terms3}
            onChange={() => setTerms3(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms3"
            checked={!terms3}
            onChange={() => setTerms3(false)}
          /> 동의하지 않습니다.
        </label>
      </div>

      <h2>동의거부시 불이익에 관한 사항</h2>
      <div className="box auto-height info-highlight">
        귀하는 동의를 거부할 수 있습니다. 다만, 필수 항목에 대한 동의가 없을 경우 회원가입이 제한될 수 있습니다.<br />
        선택 항목에 대한 동의 거부 시에도 기본 서비스 이용은 가능합니다.
      </div>

      <div className="button-row">
        <button className="btn-cancel" onClick={handleCancel}>가입취소</button>
        <button
          className={`btn-next ${terms1 && terms2 ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!terms1 || !terms2}
        >
          다음단계
        </button>
      </div>
    </div>
  );
};

export default Step1;
