import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { verifyIdAndEmail, resetPassword } from "../utils/api";
import "./FindPw.css";

const FindPw = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("find"); // 'find' or 'reset'
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

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

    // 비밀번호 길이 확인
    if (newPassword.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.\n다시 확인해주세요.");
      return;
    }

    // 비밀번호 강도 확인 (영문, 숫자, 특수문자 포함)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <div className="find-pw-wrapper">
      <Header />

      {currentStep === "find" ? (
        <div className="page">
          <div className="card">
            <div className="avatar">🔑</div>

            <h2 className="title">비밀번호 찾기</h2>
            <p className="subtitle">등록된 이메일로 비밀번호를 찾을 수 있습니다.</p>

            <div className="section-header">이메일</div>

            <form className="form" onSubmit={handleFindPassword}>
              <label className="label">아이디</label>
              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>

              <label className="label">이메일</label>
              <div className="input-wrap">
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit" disabled={isLoading}>
                {isLoading ? "확인 중..." : "비밀번호 찾기"}
              </button>

              <div className="links-row">
                <span>
                  ← <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>로그인으로 돌아가기</a>
                </span>
                <span>
                  ◇ <a onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>회원가입</a>
                </span>
              </div>
            </form>

            <p className="help">
              도움이 필요하시면 <a href="/support">고객센터</a>로 문의해주세요
            </p>
          </div>
        </div>
      ) : (
        <div className="page">
          <div className="card">
            <div className="avatar reset">🔐</div>

            <h2 className="title">비밀번호 재설정</h2>
            <p className="subtitle">
              {userId ? `${userId}님의 ` : ""}새로운 비밀번호를 설정해주세요.
            </p>

            <div className="section-header">비밀번호 설정</div>

            <form className="form" onSubmit={handleResetPassword}>
              <label className="label">새 비밀번호</label>
              <div className="input-wrap">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="8자 이상 입력해주세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showNewPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="hint">영문, 숫자, 특수문자를 포함해야 합니다.</div>

              <label className="label">비밀번호 확인</label>
              <div className="input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {confirmPassword && (
                <div className={`match-status ${newPassword === confirmPassword ? "match" : "no-match"}`}>
                  {newPassword === confirmPassword ? "✓ 비밀번호가 일치합니다" : "✗ 비밀번호가 일치하지 않습니다"}
                </div>
              )}

              <button type="submit" className="submit" disabled={isLoading}>
                {isLoading ? "변경 중..." : "비밀번호 변경하기"}
              </button>

              <div className="links-row">
                <span>
                  ← <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>로그인으로 돌아가기</a>
                </span>
              </div>
            </form>

            <div className="security-info">
              <div className="info-icon">ℹ️</div>
              <div className="info-text">
                보안을 위해 주기적으로 비밀번호를 변경하시는 것을 권장합니다.
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FindPw;
