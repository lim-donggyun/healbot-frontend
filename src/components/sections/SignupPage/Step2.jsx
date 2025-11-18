import React, { useState, useEffect } from "react";
import "../../../pages/Signup.css";
import { signup, checkIdAvailability } from "../../../utils/api";

const Step2 = ({ formData, updateFormData, nextStep, prevStep, socialId }) => {
  const [userId, setUserId] = useState(formData.userId || "");
  const [name, setName] = useState(formData.name || "");
  const [email, setEmail] = useState(formData.email || "");
  const [password, setPassword] = useState(formData.password || "");
  const [passwordConfirm, setPasswordConfirm] = useState(formData.passwordConfirm || "");
  const [birthdate, setBirthdate] = useState(formData.birthdate || "");
  const [age, setAge] = useState(formData.age || "");
  const [gender, setGender] = useState(formData.gender || "");
  const [address, setAddress] = useState(formData.address || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [idCheckStatus, setIdCheckStatus] = useState("");
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // 소셜 로그인인 경우 처리
  const isSocialSignup = !!socialId;

  useEffect(() => {
    if (isSocialSignup) {
      setUserId(socialId);
      setIdCheckStatus("available");
    }
  }, [socialId, isSocialSignup]);

  const validateIdFormat = (id) => {
    return /^[A-Za-z0-9]{6,20}$/.test(id);
  };

  // 전화번호 010-0000-0000형식 검사
  const validatePhoneFormat = (value) => {
    return /^010-\d{4}-\d{4}$/.test(value);
  };

  const handleCheckId = async () => {
    setIdCheckMessage("");
    setIdCheckStatus("");

    const idVal = userId.trim();
    if (!idVal) {
      setIdCheckMessage("아이디를 입력해주세요.");
      setIdCheckStatus("unavailable");
      return;
    }
    if (!validateIdFormat(idVal)) {
      setIdCheckMessage("아이디는 영문/숫자 6~20자만 가능합니다.");
      setIdCheckStatus("unavailable");
      return;
    }

    setIdCheckStatus("checking");
    setIdCheckMessage("확인중...");

    try {
      const available = await checkIdAvailability(idVal);

      if (available) {
        setIdCheckStatus("available");
        setIdCheckMessage("사용 가능한 아이디입니다.");
      } else {
        setIdCheckStatus("unavailable");
        setIdCheckMessage("이미 사용중인 아이디입니다. 다른 아이디를 선택하세요.");
      }
    } catch (error) {
      setIdCheckStatus("unavailable");
      setIdCheckMessage("중복확인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const checkPasswordMatch = () => {
    if (!password && !passwordConfirm) {
      setPasswordMessage("");
      return false;
    }
    if (password === passwordConfirm) {
      setPasswordMessage("비밀번호가 일치합니다.");
      return true;
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      return false;
    }
  };

  const calcAgeFromBirth = (birthDateString) => {
    if (!birthDateString) return "";
    const bd = new Date(birthDateString);
    if (isNaN(bd)) return "";
    const today = new Date();
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return age >= 0 ? String(age) : "";
  };

  const handleBirthdateChange = (e) => {
    const birthValue = e.target.value;
    setBirthdate(birthValue);
    const calculatedAge = calcAgeFromBirth(birthValue);
    setAge(calculatedAge);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = () => {
    if (!phone) {
      alert("휴대폰 번호를 입력해주세요.");
      return;
    }
    // 형식 체크
    if(!validatePhoneFormat(phone.trim())){
      alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
      return;
    }
    setIsCodeSent(true);
    alert("인증번호가 발송되었습니다. (테스트: 1234)");
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    if (verificationCode === "1234") {
      setIsPhoneVerified(true);
      alert("인증이 완료되었습니다.");
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleNext = async () => {
    // 이름 검증
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    // 소셜 로그인이 아닌 경우만 아이디/비밀번호 검증
    if (!isSocialSignup) {
      if (!userId.trim()) {
        alert("아이디를 입력해주세요.");
        return;
      }
      if (idCheckStatus !== "available") {
        alert("아이디 중복확인을 해주세요. (사용 가능한 아이디여야 합니다.)");
        return;
      }
      if (!password) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      if (!checkPasswordMatch()) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    if (!email || !validateEmail(email)) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }
    if (!birthdate) {
      alert("생년월일을 입력해주세요.");
      return;
    }
    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (!address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (!isPhoneVerified) {
      alert("휴대폰 인증을 완료해주세요.");
      return;
    }

    // 백엔드 API 호출
    try {
      const signupData = {
        memberId: isSocialSignup ? socialId : userId,
        loginType: isSocialSignup ? socialId.split('_')[0] : 'normal',
        socialId: isSocialSignup ? socialId : null,
        password: isSocialSignup ? null : password,
        userName: name,
        email: email,
        phone: phone,
        bornDate: birthdate,
        gender: gender,
        address: address
      };

      const result = await signup(signupData);

      if (result === 1) {
        // 회원가입 성공
        updateFormData({
          userId,
          name,
          email,
          password,
          passwordConfirm,
          birthdate,
          age,
          gender,
          address,
          phone,
          verificationCode,
        });
        nextStep();
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handlePrev = () => {
    updateFormData({ userId, name, email, password, passwordConfirm, birthdate, age, gender, address, phone });
    prevStep();
  };

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="container">
      <h1>{isSocialSignup ? "소셜 회원가입" : "일반 회원가입"}</h1>

      <div className="steps">
        <span>01. 약관동의</span>
        <span className="active">02. 회원정보 입력</span>
        <span>03. 회원가입 완료</span>
      </div>

      <form className="signup-form">
        {/* 소셜 로그인이 아닐 때만 아이디/비밀번호 표시 */}
        {!isSocialSignup && (
          <>
            <label htmlFor="userId">아이디 *</label>
            <div className="row">
              <div className="col">
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setIdCheckStatus("");
                    setIdCheckMessage("");
                  }}
                  placeholder="영문/숫자 6~20자"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="id-check-btn"
                  onClick={handleCheckId}
                  disabled={idCheckStatus === "checking"}>
                  {idCheckStatus === "checking" ? "확인중..." : "중복확인"}
                </button>
              </div>
            </div>
            {idCheckMessage && (
              <div className={`message ${idCheckStatus === "available" ? "msg-ok" : "msg-err"}`}>{idCheckMessage}</div>
            )}

            <label htmlFor="pw">비밀번호 *</label>
            <input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordMatch();
              }}
            />

            <label htmlFor="pwConfirm">비밀번호 확인 *</label>
            <input
              id="pwConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                checkPasswordMatch();
              }}
            />
            {passwordMessage && (
              <div className={`message ${password === passwordConfirm ? "msg-ok" : "msg-err"}`}>{passwordMessage}</div>
            )}
          </>
        )}

        <label htmlFor="name">이름 *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
        />

        <label htmlFor="email">이메일 *</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />

        <label htmlFor="phone">전화번호 *</label>
        <div className="row">
          <div className="col">
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              disabled={isPhoneVerified}
            />
          </div>
          <div>
            <button
              type="button"
              className="id-check-btn"
              onClick={handleSendCode}
              disabled={isCodeSent || isPhoneVerified}>
              {isPhoneVerified ? "인증완료" : "인증번호 발송"}
            </button>
          </div>
        </div>

        {/* 인증번호 발송 후 인증번호 입력창 표시 */}
        {isCodeSent && !isPhoneVerified && (
          <div className="row" style={{ marginTop: "10px" }}>
            <div className="col">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 입력 (1234)"
                maxLength="6"
              />
            </div>
            <div>
              <button type="button" className="id-check-btn" onClick={handleVerifyCode}>
                확인
              </button>
            </div>
          </div>
        )}
        {isPhoneVerified && <div className="message msg-ok">휴대폰 인증이 완료되었습니다.</div>}
        <label htmlFor="birth">생년월일 *</label>
        <div className="row">
          <div className="col">
            <input id="birth" type="date" value={birthdate} onChange={handleBirthdateChange} max={getTodayString()} />{" "}
          </div>
          <div style={{ width: "140px" }}>
            <input id="age" type="text" className="readonly" value={age} placeholder="만 나이" readOnly />
          </div>
        </div>
        <div className="message">생년월일 입력 시 만 나이가 자동 계산됩니다.</div>

        <label>성별 *</label>
        <div className="gender">
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={gender === "M"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            남자
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={gender === "F"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            여자
          </label>
        </div>

        <label htmlFor="address">주소 *</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="기본 주소"
        />
      </form>

      <div className="btn-group">
        <button type="button" onClick={handlePrev}>
          이전단계
        </button>
        <button type="button" onClick={handleNext}>
          다음단계
        </button>
      </div>
    </div>
  );
};

export default Step2;
