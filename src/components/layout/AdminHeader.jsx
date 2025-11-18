import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSession } from "../../utils/api";
import "../../pages/MainPage.css";
import "./AdminHeader.css";

function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 항상 hover 상태를 유지해야 하는 페이지들
  const alwaysScrolledPages = ['/login', '/signup', '/find-id', '/find-pass', '/admin-dashboard', '/admin/members'];
  const isAlwaysScrolled = alwaysScrolledPages.includes(location.pathname);

  // 세션 확인
  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await checkSession();
        setIsLoggedIn(data.loggedIn);
        setIsAdmin(data.admin_YN === 'Y');

        // 로그인되어 있고 관리자인 경우, 관리자 페이지가 아니면 admin-dashboard로 이동
        if (data.loggedIn && data.admin_YN === 'Y' && !location.pathname.startsWith('/admin')) {
          navigate('/admin-dashboard');
        }
      } catch (error) {
        console.error('세션 확인 실패:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    verifySession();
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const mainSection = document.getElementById("main");
      const searchSection = document.getElementById("search");

      if (mainSection && searchSection) {
        const searchSectionEnd = searchSection.offsetTop + searchSection.offsetHeight;
        setIsScrolled(window.scrollY >= searchSectionEnd - 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      // 메인페이지에서는 맨 위로 스크롤
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // 다른 페이지에서는 메인페이지로 이동
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('/react/api/member/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        alert('로그아웃 되었습니다.');
        navigate('/');
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleSymptomSearchClick = () => {
    if (location.pathname === "/") {
      // 메인페이지에서는 섹션2로 스크롤
      const searchSection = document.getElementById("search");
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // 다른 페이지에서는 메인페이지의 섹션2로 이동
      navigate("/#search");
    }
  };

  const handleOutsideClick = (e) => {
    const hamburgerIcon = document.getElementById("nav-icon2");
    const hamburgerMenu = document.getElementById("hamburgerMenu");

    if (hamburgerIcon && hamburgerMenu && !hamburgerIcon.contains(e.target) && !hamburgerMenu.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
      {/* 헤더 */}
      <header className={`admin-header ${isMenuOpen ? "menu-open" : ""} ${isAlwaysScrolled || isScrolled ? "scrolled" : ""}`}>
        <div className="header-wrapper">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            <img
              src="https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/healbot/main/whiteLogo.png"
              alt="HealBot"
              className="logo-white"
            />
            <img
              src="https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/healbot/main/blackLogo.png"
              alt="HealBot"
              className="logo-black"
            />
          </div>
          <div className="header-right">
            <nav>
              <div className="nav-item">
                <span className="nav-link" onClick={handleSymptomSearchClick} style={{ cursor: "pointer" }}>
                  증상검색
                </span>
              </div>

              <div className="nav-item">
                <span className="nav-link">병원 검색하기</span>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">의료기관 찾기</div>
                      <a href="/hospitals">병원 찾기</a>
                      <a href="/emergency">응급실 찾기</a>
                      <a href="/hospitals?open=night">야간 진료</a>
                      <a href="/hospitals?open=weekend">주말 진료</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">내과 계열</div>
                      <a href="/hospitals?dept=internal">내과</a>
                      <a href="/hospitals?dept=gastro">소화기내과</a>
                      <a href="/hospitals?dept=cardio">심장내과</a>
                      <a href="/hospitals?dept=neuro">신경과</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">외과 계열</div>
                      <a href="/hospitals?dept=surgery">외과</a>
                      <a href="/hospitals?dept=ortho">정형외과</a>
                      <a href="/hospitals?dept=neuro-surg">신경외과</a>
                      <a href="/hospitals?dept=plastic">성형외과</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">기타 진료과</div>
                      <a href="/hospitals?dept=pediatrics">소아청소년과</a>
                      <a href="/hospitals?dept=obgyn">산부인과</a>
                      <a href="/hospitals?dept=derma">피부과</a>
                      <a href="/hospitals?dept=more" className="highlight-link">
                        전체 진료과 보기
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <span className="nav-link">건강정보</span>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">질병 정보</div>
                      <a href="/health-info?cat=disease">질병 백과</a>
                      <a href="/health-info?cat=symptom">증상별 질병</a>
                      <a href="/health-info?cat=chronic">만성질환</a>
                      <a href="/health-info?cat=infection">감염병</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">건강 관리</div>
                      <a href="/health-info?cat=prevention">예방법</a>
                      <a href="/health-info?cat=nutrition">영양 가이드</a>
                      <a href="/health-info?cat=exercise">운동 정보</a>
                      <a href="/health-info?cat=mental">정신 건강</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">약물 정보</div>
                      <a href="/health-info?cat=medicine">약물 검색</a>
                      <a href="/health-info?cat=side-effect">부작용 정보</a>
                      <a href="/health-info?cat=interaction">약물 상호작용</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">미디어</div>
                      <a href="/health-info?cat=video">건강 영상</a>
                      <a href="/health-info?cat=webinar">전문의 강의</a>
                      <a href="/health-info?cat=infographic">인포그래픽</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <a href="/community" className="nav-link">
                  커뮤니티
                </a>
              </div>
            </nav>
            <div className="utility-menu">
              <div className="header-search-container">
                <input type="text" className="header-search-input" placeholder="통합 검색..." />
              </div>
              <div className="utility-divider"></div>
              <button className="utility-btn user-icon-btn" onClick={handleLoginClick}>
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </button>
              {isLoggedIn && (
                <>
                  <div className="utility-divider"></div>
                  <button className="utility-btn logout-icon-btn" onClick={handleLogoutClick}>
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" className="logout-icon">
                      {/* 문 프레임 */}
                      <rect x="7" y="4" width="10" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="none" className="door-frame" />
                      {/* 문짝 (왼쪽 경첩 기준으로 회전) */}
                      <rect x="7" y="4" width="10" height="16" rx="1" fill="currentColor" className="door" style={{ transformOrigin: '7px 12px' }} />
                      {/* 문 손잡이 */}
                      <circle cx="15" cy="12" r="0.8" fill="white" className="door-handle" />
                    </svg>
                  </button>
                </>
              )}
              <div className="utility-divider"></div>
              <button className="utility-btn emergency-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 4, verticalAlign: "middle" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                응급
              </button>
              <div className="utility-divider"></div>
              <div id="nav-icon2" className={isMenuOpen ? "open" : ""} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 햄버거 드롭다운 메뉴 */}
      <div className={`hamburger-menu ${isMenuOpen ? "show" : ""}`} id="hamburgerMenu">
        <div className="hamburger-menu-content">
          <div className="hamburger-menu-column">
            <div className="hamburger-menu-title">고객지원</div>
            <a href="/faq">FAQ</a>
            <a href="/customer-service">고객센터</a>
            <a href="/inquiry">1:1 문의</a>
          </div>
          <div className="hamburger-menu-column">
            <div className="hamburger-menu-title">서비스</div>
            <a href="/about">서비스 소개</a>
            <a href="/notice">공지사항</a>
            <a href="/event">이벤트</a>
          </div>
          <div className="hamburger-menu-column">
            <div className="hamburger-menu-title">정보</div>
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/partners">제휴 문의</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
