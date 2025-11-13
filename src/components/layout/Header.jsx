import React from "react";
import Navigation from "./Navigation";

function Header() {
  return (
    <header>
      <div className="header-wrapper">
        <div className="logo">
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
          <Navigation />

          <div className="utility-menu">
            <div className="header-search-container">
              <input
                type="text"
                className="header-search-input"
                placeholder="통합 검색..."
              />
            </div>
            <div className="utility-divider"></div>
            <button className="utility-btn">로그인</button>
            <div className="utility-divider"></div>
            <button className="utility-btn">회원가입</button>
            <div className="utility-divider"></div>
            <button className="utility-btn emergency-btn">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                style={{ marginRight: 4, verticalAlign: "middle" }}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                <path
                  d="M2 17l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              응급
            </button>
            <div className="utility-divider"></div>
            <div id="nav-icon2">
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
  );
}

export default Header;
