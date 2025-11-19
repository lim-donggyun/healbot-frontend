import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { findId, verifyIdAndEmail, resetPassword } from "../utils/memberApi";
import "./FindAccount.css";

const FindAccount = () => {
  const navigate = useNavigate();

  // 아이디 찾기 상태
  const [findIdName, setFindIdName] = useState("");
  const [findIdEmail, setFindIdEmail] = useState("");
  const [isFindIdLoading, setIsFindIdLoading] = useState(false);

  // 비밀번호 찾기 상태
  const [currentStep, setCurrentStep] = useState("find"); // 'find' or 'reset'
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFindPwLoading, setIsFindPwLoading] = useState(false);

  // 아이디 찾기 처리
  const handleFindId = async (e) => {
    e.preventDefault();

    if (!findIdName || !findIdEmail) {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    setIsFindIdLoading(true);

    try {
      const foundId = await findId(findIdName, findIdEmail);

      if (foundId) {
        if (foundId === "SOCIAL_LOGIN") {
          alert("카카오톡, 네이버 가입자는 아이디 찾기가 불가합니다.\n소셜 로그인을 이용해주세요.");
        } else {
          alert(`회원님의 아이디는 "${foundId}" 입니다.`);
        }
      } else {
        alert("입력하신 정보와 일치하는 회원 정보가 없습니다.");
      }
    } catch (error) {
      alert("아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsFindIdLoading(false);
    }
  };

  // 비밀번호 찾기 - 1단계: 아이디/이메일 확인
  const handleFindPassword = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsFindPwLoading(true);

    try {
      const data = await verifyIdAndEmail(userId, email);

      if (data.verified) {
        alert("아이디와 이메일이 확인되었습니다.\n비밀번호 재설정 페이지로 이동합니다.");
        setCurrentStep("reset");
      } else {
        alert("입력하신 정보와 일치하는 회원 정보가 없습니다.\n소셜 로그인 회원은 비밀번호 찾기가 불가합니다.");
      }
    } catch (error) {
      alert("비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsFindPwLoading(false);
    }
  };

  // 비밀번호 찾기 - 2단계: 비밀번호 재설정
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword.trim()) {
      alert("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.\n다시 확인해주세요.");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    setIsFindPwLoading(true);

    try {
      const data = await resetPassword(userId, newPassword);

      if (data.success) {
        alert(`비밀번호가 성공적으로 변경되었습니다!\n새로운 비밀번호로 로그인해주세요.`);
        navigate("/login");
      } else {
        alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsFindPwLoading(false);
    }
  };

  return (
    <div className="find-account-wrapper">
      <Header />

      <div className="page">
        <h1 className="find-account-title">계정 찾기</h1>
        <p className="find-account-subtitle">아이디 또는 비밀번호를 찾으실 수 있습니다.</p>

        <div className="find-account-container">
          {/* 좌측: 아이디 찾기 */}
          <div className="find-section">
            <h2 className="section-title">아이디 찾기</h2>
            <form className="find-form" onSubmit={handleFindId}>
              <label className="find-label">이름</label>
              <input
                type="text"
                className="find-input"
                placeholder="실명을 입력해주세요"
                value={findIdName}
                onChange={(e) => setFindIdName(e.target.value)}
                required
              />

              <label className="find-label">이메일</label>
              <input
                type="email"
                className="find-input"
                placeholder="example@email.com"
                value={findIdEmail}
                onChange={(e) => setFindIdEmail(e.target.value)}
                required
              />

              <button type="submit" className="find-submit" disabled={isFindIdLoading}>
                {isFindIdLoading ? "찾는 중..." : "아이디 찾기"}
              </button>
            </form>
          </div>

          {/* 우측: 비밀번호 찾기 */}
          <div className="find-section">
            {currentStep === "find" ? (
              <>
                <h2 className="section-title">비밀번호 찾기</h2>
                <form className="find-form" onSubmit={handleFindPassword}>
                  <label className="find-label">아이디</label>
                  <input
                    type="text"
                    className="find-input"
                    placeholder="아이디를 입력해주세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />

                  <label className="find-label">이메일</label>
                  <input
                    type="email"
                    className="find-input"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <button type="submit" className="find-submit" disabled={isFindPwLoading}>
                    {isFindPwLoading ? "확인 중..." : "비밀번호 찾기"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="section-title">비밀번호 재설정</h2>
                <p className="reset-subtitle">{userId}님의 새로운 비밀번호를 설정해주세요.</p>
                <form className="find-form" onSubmit={handleResetPassword}>
                  <label className="find-label">새 비밀번호</label>
                  <div className="password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="find-input"
                      placeholder="8자 이상 입력해주세요"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      👁
                    </button>
                  </div>
                  <div className="hint">영문, 숫자, 특수문자를 포함해야 합니다.</div>

                  <label className="find-label">비밀번호 확인</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="find-input"
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
                      👁
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className={`match-status ${newPassword === confirmPassword ? "match" : "no-match"}`}>
                      {newPassword === confirmPassword ? "✓ 비밀번호가 일치합니다" : "✗ 비밀번호가 일치하지 않습니다"}
                    </div>
                  )}

                  <button type="submit" className="find-submit" disabled={isFindPwLoading}>
                    {isFindPwLoading ? "변경 중..." : "비밀번호 변경하기"}
                  </button>

                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setCurrentStep("find")}
                  >
                    ← 뒤로가기
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="find-links">
          <span>
            ← <a onClick={() => navigate("/login")}>로그인으로 돌아가기</a>
          </span>
          <span>
            | <a onClick={() => navigate("/signup")}>회원가입</a>
          </span>
        </div>

        <p className="find-help">
          도움이 필요하시면 <a href="/support">고객센터</a>로 문의해주세요
        </p>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FindAccount;
