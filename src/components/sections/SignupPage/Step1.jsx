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

  const handleTerms1Change = (value) => {
    setTerms1(value);
    // 개별 약관 변경 시 전체 동의 상태 확인
    if (!value) {
      setAllAgree(false);
    } else if (value && terms2 && terms3) {
      setAllAgree(true);
    }
  };

  const handleTerms2Change = (value) => {
    setTerms2(value);
    // 개별 약관 변경 시 전체 동의 상태 확인
    if (!value) {
      setAllAgree(false);
    } else if (terms1 && value && terms3) {
      setAllAgree(true);
    }
  };

  const handleTerms3Change = (value) => {
    setTerms3(value);
    // 개별 약관 변경 시 전체 동의 상태 확인
    if (!value) {
      setAllAgree(false);
    } else if (terms1 && terms2 && value) {
      setAllAgree(true);
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
        <strong>HealBot 서비스 이용약관</strong><br /><br />

        <strong>제1조 (목적)</strong><br />
        본 약관은 HealBot(이하 "회사")에서 운영하는 의료정보 제공 플랫폼에서 제공하는 서비스(이하 "서비스")를
        이용함에 있어 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />

        <strong>제2조 (약관의 효력과 변경)</strong><br />
        1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.<br />
        2. 회사는 필요하다고 인정되는 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.<br />
        3. 회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.<br /><br />

        <strong>제3조 (회원가입)</strong><br />
        1. 회원가입은 이용자가 약관의 내용에 동의하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 체결됩니다.<br />
        2. 회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.<br />
        &nbsp;&nbsp;- 실명이 아니거나 타인의 명의를 이용한 경우<br />
        &nbsp;&nbsp;- 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우<br />
        &nbsp;&nbsp;- 부정한 용도로 서비스를 이용하고자 하는 경우<br /><br />

        <strong>제4조 (서비스의 제공)</strong><br />
        1. 회사는 다음과 같은 서비스를 제공합니다.<br />
        &nbsp;&nbsp;- AI 기반 의료정보 및 건강정보 제공<br />
        &nbsp;&nbsp;- 질환 검색 및 관련 정보 제공<br />
        &nbsp;&nbsp;- 의료기관 정보 안내<br />
        &nbsp;&nbsp;- 건강 관련 커뮤니티 서비스<br />
        &nbsp;&nbsp;- 기타 회사가 정하는 서비스<br />
        2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등 불가피한 사유가 있는 경우 서비스 제공을 일시 중단할 수 있습니다.<br /><br />

        <strong>제5조 (회원의 의무)</strong><br />
        1. 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항 등을 준수하여야 합니다.<br />
        2. 회원은 회원가입 신청 또는 회원정보 변경 시 모든 사항을 사실에 근거하여 작성하여야 하며, 허위 또는 타인의 정보를 등록할 경우 일체의 권리를 주장할 수 없습니다.<br />
        3. 회원은 본인의 ID 및 비밀번호를 제3자가 이용하게 해서는 안 됩니다.<br /><br />

        <strong>제6조 (개인정보의 보호)</strong><br />
        회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 이용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.<br /><br />

        <strong>제7조 (정보의 제공 및 면책)</strong><br />
        1. 본 서비스에서 제공하는 의료정보는 참고용이며, 실제 진단이나 치료를 대체할 수 없습니다.<br />
        2. 회원은 건강상 문제가 있을 경우 반드시 의료기관을 방문하여 전문의의 진료를 받아야 합니다.<br />
        3. 회사는 서비스를 통해 제공되는 정보의 정확성, 완전성에 대해 보증하지 않으며, 이를 이용한 결과에 대한 책임을 지지 않습니다.<br /><br />

        <strong>제8조 (면책조항)</strong><br />
        1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br />
        2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.<br />
        3. 회사는 회원이 서비스를 이용하여 기대하는 이익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.<br /><br />

        <strong>제9조 (분쟁해결)</strong><br />
        본 약관에 명시되지 않은 사항은 관계법령 및 상관례에 따릅니다.
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms1"
            checked={terms1}
            onChange={() => handleTerms1Change(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms1"
            checked={!terms1}
            onChange={() => handleTerms1Change(false)}
          /> 동의하지 않습니다.
        </label>
      </div>

      <h2>개인정보 수집 및 이용 (필수)</h2>
      <div className="box">
        <strong>1. 개인정보의 수집 목적</strong><br />
        HealBot은 회원가입, 원활한 서비스 제공, 회원 관리를 위하여 아래와 같이 개인정보를 수집·이용합니다.<br /><br />

        <strong>2. 수집하는 개인정보 항목</strong><br />
        <strong>[필수항목]</strong><br />
        - 회원가입 시: 이름, 아이디, 비밀번호, 이메일, 휴대폰번호, 생년월일, 성별, 주소<br />
        - 소셜 로그인 시: 소셜 계정 정보(카카오/네이버 고유 ID, 이름, 이메일)<br /><br />

        <strong>3. 개인정보의 이용 목적</strong><br />
        - 회원 식별 및 본인 확인<br />
        - 서비스 제공 및 맞춤형 정보 제공<br />
        - 회원 문의사항 응대 및 공지사항 전달<br />
        - 부정 이용 방지 및 서비스 개선<br />
        - 통계 분석 및 서비스 품질 향상<br /><br />

        <strong>4. 개인정보의 보유 및 이용 기간</strong><br />
        회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다. 단, 관계법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.<br />
        - 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)<br />
        - 소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)<br />
        - 접속 로그 기록: 3개월 (통신비밀보호법)<br /><br />

        <strong>5. 개인정보 제공</strong><br />
        회사는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.<br />
        - 회원이 사전에 동의한 경우<br />
        - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우<br /><br />

        <strong>6. 개인정보의 파기 절차 및 방법</strong><br />
        회원의 개인정보는 목적 달성 후 지체없이 파기되며, 전자적 파일은 복구 불가능한 방법으로 영구 삭제하고, 종이 문서는 분쇄하거나 소각합니다.<br /><br />

        <strong>7. 정보주체의 권리</strong><br />
        회원은 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms2"
            checked={terms2}
            onChange={() => handleTerms2Change(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms2"
            checked={!terms2}
            onChange={() => handleTerms2Change(false)}
          /> 동의하지 않습니다.
        </label>
      </div>

      <h2>마케팅 및 광고 활용 동의 (선택)</h2>
      <div className="box auto-height">
        <strong>1. 마케팅 활용 목적</strong><br />
        회사는 회원에게 다음과 같은 마케팅 정보를 제공하기 위해 개인정보를 활용합니다.<br />
        - 신규 서비스 및 이벤트 안내<br />
        - 맞춤형 건강정보 및 의료정보 제공<br />
        - 설문조사 및 프로모션 참여 안내<br />
        - 광고성 정보 전송 (이메일, SMS, 푸시알림)<br /><br />

        <strong>2. 수집 항목</strong><br />
        이름, 이메일, 휴대폰번호, 서비스 이용 기록<br /><br />

        <strong>3. 보유 및 이용 기간</strong><br />
        회원 탈퇴 시 또는 동의 철회 시까지<br /><br />

        <strong>4. 동의 거부 권리 및 불이익</strong><br />
        마케팅 정보 수신에 대한 동의를 거부하실 수 있으며, 거부 시에도 HealBot의 기본 서비스 이용에는 제한이 없습니다. 다만, 각종 이벤트 및 프로모션 안내를 받지 못할 수 있습니다.
      </div>
      <div className="agree-options">
        <label>
          <input
            type="radio"
            name="terms3"
            checked={terms3}
            onChange={() => handleTerms3Change(true)}
          /> 동의합니다.
        </label>
        <label>
          <input
            type="radio"
            name="terms3"
            checked={!terms3}
            onChange={() => handleTerms3Change(false)}
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
