import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { findId } from "../utils/api";
import "./FindId.css";

const FindId = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = await findId(name, email);

      if (userId) {
        // 소셜 로그인 회원인지 확인
        if (userId === "SOCIAL_LOGIN") {
          alert("카카오톡, 네이버 가입자는 아이디 찾기가 불가합니다.\n소셜 로그인을 이용해주세요.");
        } else {
          alert(`회원님의 아이디는 "${userId}" 입니다.`);
        }
      } else {
        alert("입력하신 정보와 일치하는 회원 정보가 없습니다.");
      }
    } catch (error) {
      alert("아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="find-id-wrapper">
      <Header />
      <div className="page">
        <div className="card">
          <div className="avatar">?</div>

          <h2 className="title">아이디 찾기</h2>
          <p className="subtitle">등록된 이메일로 아이디를 찾을 수 있습니다.</p>

          <div className="section-header">이메일</div>

          <form className="form" onSubmit={handleSubmit}>
            <label className="label">이름</label>
            <div className="input-wrap">
              <input
                type="text"
                placeholder="실명을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              {isLoading ? "찾는 중..." : "아이디 찾기"}
            </button>

            <div className="links-row">
              <span>
                ←{" "}
                <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                  로그인으로 돌아가기
                </a>
              </span>
              <span>
                ◇{" "}
                <a onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>
                  회원가입
                </a>
              </span>
            </div>
          </form>

          <p className="help">
            도움이 필요하시면 <a href="/support">고객센터</a>로 문의해주세요
          </p>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FindId;
