import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSession } from "../../utils/memberApi";
import { searchAll } from "../../utils/searchApi";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 항상 hover 상태를 유지해야 하는 페이지들 (관리자 페이지도 포함)
  const alwaysScrolledPages = [
    '/login', '/signup', '/find-id', '/find-pass', '/mypage',
    '/search-result', '/community', '/hospitals',
    '/about', '/faq', '/customer-service', '/inquiry',
    '/notice', '/terms', '/privacy', '/partners', '/review'
  ];
  const isAlwaysScrolled = alwaysScrolledPages.includes(location.pathname) || location.pathname.startsWith('/admin') || location.pathname.startsWith('/mypage') || location.pathname.startsWith('/review');

  // 세션 확인
  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await checkSession();
        setIsLoggedIn(data.loggedIn);
        setIsAdmin(data.admin_YN === 'Y');
      } catch (error) {
        console.error('세션 확인 실패:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    verifySession();
  }, [location.pathname]);

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
      // 관리자면 관리자 페이지로, 일반 사용자면 마이페이지로
      if (isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/mypage");
      }
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
      // 다른 페이지에서는 메인페이지로 이동 후 섹션2로 스크롤
      navigate("/");
      // 페이지 로드 후 스크롤
      setTimeout(() => {
        const searchSection = document.getElementById("search");
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
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

  // 통합 검색 처리
  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchKeyword.trim() !== "") {
      try {
        const result = await searchAll(searchKeyword.trim());
        console.log("=== 통합 검색 결과 ===");
        console.log("검색어:", result.keyword);
        console.log("증상 정보:", result.symptomInfo);
        console.log("병원 결과:", result.results.hospitals);
        console.log("질병 결과:", result.results.diseases);
        console.log("공지사항 결과:", result.results.notices);
        console.log("커뮤니티 결과:", result.results.communities);
        console.log("=====================");

        // 통합 검색 결과 페이지로 이동
        navigate("/search-result", {
          state: {
            searchData: result
          }
        });

        // 검색어 초기화
        setSearchKeyword("");
      } catch (error) {
        console.error("통합 검색 실패:", error);
      }
    }
  };

  return (
    <>
      {/* 헤더 */}
      <header className={`${isMenuOpen ? "menu-open" : ""} ${isAlwaysScrolled || isScrolled ? "scrolled" : ""}`}>
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
                      <a href="/hospitals?emergency=true">응급실 찾기</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">주요 진료과</div>
                      <a href="/hospitals?dept=내과">내과</a>
                      <a href="/hospitals?dept=외과">외과</a>
                      <a href="/hospitals?dept=정형외과">정형외과</a>
                      <a href="/hospitals?dept=소아청소년과">소아청소년과</a>
                      <a href="/hospitals?dept=산부인과">산부인과</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">전문 진료과</div>
                      <a href="/hospitals?dept=신경과">신경과</a>
                      <a href="/hospitals?dept=신경외과">신경외과</a>
                      <a href="/hospitals?dept=정신건강의학과">정신건강의학과</a>
                      <a href="/hospitals?dept=재활의학과">재활의학과</a>
                      <a href="/hospitals?dept=성형외과">성형외과</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">기타 진료과</div>
                      <a href="/hospitals?dept=안과">안과</a>
                      <a href="/hospitals?dept=이비인후과">이비인후과</a>
                      <a href="/hospitals?dept=피부과">피부과</a>
                      <a href="/hospitals?dept=치과">치과</a>
                      <a href="/hospitals?dept=비뇨의학과">비뇨의학과</a>
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
                      <a href="/disease-result">질병 백과</a>
                      <a href="/chronic-diseases">만성질환</a>
                      <a href="/infectious-diseases">감염병</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">건강 관리</div>
                      <a href="/prevention">예방법</a>
                      <a href="/nutrition">영양 가이드</a>
                      <a href="/exercise">운동 정보</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">헬스케어 플러스</div>
                      <a href="/mental-health">정신 건강</a>
                      <a href="/seasonal-health">계절 건강</a>
                      <a href="/health-checkup">건강 검진 가이드</a>
                    </div>
                    <div className="dropdown-column">
                      <div className="dropdown-column-title">응급 의료</div>
                      <a href="/first-aid">응급 처치법</a>
                      <a href="/home-medicine">가정 상비약</a>
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
                <input
                  type="text"
                  className="header-search-input"
                  placeholder="통합 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={handleSearch}
                />
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
                    </svg>
                  </button>
                </>
              )}
              <div className="utility-divider"></div>
              <a
                href="/hospitals?emergency=true"
                className="utility-btn emergency-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 4, verticalAlign: "middle" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                응급
              </a>
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
            <a
              href="/notice"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const sessionData = await checkSession();
                  if (!sessionData.loggedIn) {
                    alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
                    navigate('/login');
                    return;
                  }
                  navigate('/notice');
                } catch (error) {
                  console.error('세션 확인 실패:', error);
                  alert('로그인되어 있지 않을 경우 로그인 해야 이용 가능합니다.');
                  navigate('/login');
                }
              }}
            >
              공지사항
            </a>
            <a href="/review/:hospitalId">리뷰</a>
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

export default Header;
