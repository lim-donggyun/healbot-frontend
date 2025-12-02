import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "./CustomerService.css";

function CustomerService() {
  return (
    <div className="cs-page-wrapper">
      <Header />
      <div className="page">
        <h1>고객센터</h1>
        <p className="cs-subtitle">무엇을 도와드릴까요?</p>

        <div className="cs-quick-menu">
          <a href="/faq" className="cs-quick-card">
            <div className="cs-quick-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>자주 묻는 질문</h3>
            <p>가장 많이 묻는 질문과 답변을 확인하세요</p>
          </a>
          <a href="/inquiry" className="cs-quick-card">
            <div className="cs-quick-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>1:1 문의</h3>
            <p>개인 문의사항을 남겨주세요</p>
          </a>
          <a href="/notice" className="cs-quick-card">
            <div className="cs-quick-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3>공지사항</h3>
            <p>최신 소식과 업데이트를 확인하세요</p>
          </a>
        </div>

        <section className="cs-section">
          <h2>서비스 이용 안내</h2>
          <div className="cs-guide-grid">
            <div className="cs-guide-card">
              <h3>
                <svg
                  className="guide-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                증상 검색 이용 방법
              </h3>
              <ol>
                <li>메인 페이지에서 증상 검색 섹션으로 이동</li>
                <li>현재 겪고 있는 증상을 자세히 입력</li>
                <li>AI 분석 결과 확인</li>
                <li>추천 병원 및 대처 방법 확인</li>
              </ol>
              <p className="guide-note">※ AI 분석 결과는 참고용이며, 정확한 진단은 의료 전문가와 상담하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>
                <svg
                  className="guide-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5">
                  <path d="M12 2v20M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </svg>
                병원 찾기 이용 방법
              </h3>
              <ol>
                <li>헤더의 "병원 검색하기" 메뉴 클릭</li>
                <li>진료과목 또는 지역 선택</li>
                <li>검색 결과에서 원하는 병원 선택</li>
                <li>병원 정보 및 진료시간 확인</li>
              </ol>
              <p className="guide-note">※ 야간 진료, 주말 진료 필터를 활용하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>
                <svg
                  className="guide-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                응급실 찾기 이용 방법
              </h3>
              <ol>
                <li>"응급실 찾기" 메뉴 선택</li>
                <li>현재 위치 또는 지역 입력</li>
                <li>실시간 가용 병상 정보 확인</li>
                <li>가까운 응급실로 이동</li>
              </ol>
              <p className="guide-note">※ 응급 상황 시 119에 먼저 연락하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>
                <svg
                  className="guide-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
                회원가입 및 로그인
              </h3>
              <ol>
                <li>우측 상단 사용자 아이콘 클릭</li>
                <li>이메일 또는 소셜 로그인 선택</li>
                <li>필요 정보 입력 후 가입 완료</li>
                <li>맞춤형 건강 정보 이용</li>
              </ol>
              <p className="guide-note">※ 카카오, 네이버 간편 로그인을 지원합니다.</p>
            </div>
          </div>
        </section>

        <section className="cs-section">
          <h2>연락처 및 운영시간</h2>
          <div className="cs-contact-grid">
            <div className="cs-contact-card">
              <div className="cs-contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>전화 상담</h3>
              <p className="cs-contact-value">1588-0000</p>
              <p className="cs-contact-desc">
                평일 09:00 - 18:00
                <br />
                점심시간 12:00 - 13:00
              </p>
            </div>

            <div className="cs-contact-card">
              <div className="cs-contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>이메일 문의</h3>
              <p className="cs-contact-value">healbot.official@gmail.com</p>
              <p className="cs-contact-desc">
                24시간 접수 가능
                <br />
                평일 기준 24시간 내 답변
              </p>
            </div>

            <div className="cs-contact-card">
              <div className="cs-contact-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>채팅 상담</h3>
              <p className="cs-contact-value">준비 중</p>
              <p className="cs-contact-desc">
                실시간 채팅 상담 서비스
                <br />곧 오픈 예정입니다
              </p>
            </div>
          </div>
        </section>

        <section className="cs-section">
          <h2>문의 유형별 안내</h2>
          <div className="cs-type-list">
            <div className="cs-type-item">
              <strong>서비스 이용 문의</strong>
              <p>기능 사용 방법, 서비스 안내 등</p>
              <span className="cs-type-tag">FAQ 추천</span>
            </div>
            <div className="cs-type-item">
              <strong>회원정보 변경/탈퇴</strong>
              <p>개인정보 수정, 비밀번호 변경, 회원 탈퇴 등</p>
              <span className="cs-type-tag">1:1 문의 추천</span>
            </div>
            <div className="cs-type-item">
              <strong>오류 및 버그 신고</strong>
              <p>서비스 이용 중 발생한 오류 제보</p>
              <span className="cs-type-tag">1:1 문의 추천</span>
            </div>
            <div className="cs-type-item">
              <strong>제휴 및 광고 문의</strong>
              <p>제휴 제안, 광고 문의 등</p>
              <span className="cs-type-tag">제휴 문의 추천</span>
            </div>
            <div className="cs-type-item">
              <strong>서비스 개선 제안</strong>
              <p>새로운 기능 제안, 개선 의견 등</p>
              <span className="cs-type-tag">1:1 문의 추천</span>
            </div>
          </div>
        </section>

        <div className="cs-notice-box">
          <h3>고객센터 이용 안내</h3>
          <ul>
            <li>주말 및 공휴일은 휴무이며, 다음 영업일에 순차적으로 답변드립니다.</li>
            <li>문의 내용에 따라 답변 시간이 지연될 수 있습니다.</li>
            <li>의료 진단이나 처방에 관한 문의는 답변이 어렵습니다.</li>
            <li>욕설, 비방 등 부적절한 문의는 답변이 제한될 수 있습니다.</li>
          </ul>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default CustomerService;
