import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './CustomerService.css';

function CustomerService() {
  return (
    <div className="cs-page-wrapper">
      <Header />
      <div className="page">
        <h1>고객센터</h1>
        <p className="cs-subtitle">무엇을 도와드릴까요?</p>

        <div className="cs-quick-menu">
          <a href="/faq" className="cs-quick-card">
            <div className="cs-quick-icon">❓</div>
            <h3>자주 묻는 질문</h3>
            <p>가장 많이 묻는 질문과 답변을 확인하세요</p>
          </a>
          <a href="/inquiry" className="cs-quick-card">
            <div className="cs-quick-icon">💬</div>
            <h3>1:1 문의</h3>
            <p>개인 문의사항을 남겨주세요</p>
          </a>
          <a href="/notice" className="cs-quick-card">
            <div className="cs-quick-icon">📢</div>
            <h3>공지사항</h3>
            <p>최신 소식과 업데이트를 확인하세요</p>
          </a>
        </div>

        <section className="cs-section">
          <h2>서비스 이용 안내</h2>
          <div className="cs-guide-grid">
            <div className="cs-guide-card">
              <h3>🔍 증상 검색 이용 방법</h3>
              <ol>
                <li>메인 페이지에서 증상 검색 섹션으로 이동</li>
                <li>현재 겪고 있는 증상을 자세히 입력</li>
                <li>AI 분석 결과 확인</li>
                <li>추천 병원 및 대처 방법 확인</li>
              </ol>
              <p className="guide-note">※ AI 분석 결과는 참고용이며, 정확한 진단은 의료 전문가와 상담하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>🏥 병원 찾기 이용 방법</h3>
              <ol>
                <li>헤더의 "병원 검색하기" 메뉴 클릭</li>
                <li>진료과목 또는 지역 선택</li>
                <li>검색 결과에서 원하는 병원 선택</li>
                <li>병원 정보 및 진료시간 확인</li>
              </ol>
              <p className="guide-note">※ 야간 진료, 주말 진료 필터를 활용하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>🚑 응급실 찾기 이용 방법</h3>
              <ol>
                <li>"응급실 찾기" 메뉴 선택</li>
                <li>현재 위치 또는 지역 입력</li>
                <li>실시간 가용 병상 정보 확인</li>
                <li>가까운 응급실로 이동</li>
              </ol>
              <p className="guide-note">※ 응급 상황 시 119에 먼저 연락하세요.</p>
            </div>

            <div className="cs-guide-card">
              <h3>👤 회원가입 및 로그인</h3>
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
              <div className="cs-contact-icon">📞</div>
              <h3>전화 상담</h3>
              <p className="cs-contact-value">1588-0000</p>
              <p className="cs-contact-desc">평일 09:00 - 18:00<br />점심시간 12:00 - 13:00</p>
            </div>

            <div className="cs-contact-card">
              <div className="cs-contact-icon">📧</div>
              <h3>이메일 문의</h3>
              <p className="cs-contact-value">support@healbot.com</p>
              <p className="cs-contact-desc">24시간 접수 가능<br />평일 기준 24시간 내 답변</p>
            </div>

            <div className="cs-contact-card">
              <div className="cs-contact-icon">💬</div>
              <h3>채팅 상담</h3>
              <p className="cs-contact-value">준비 중</p>
              <p className="cs-contact-desc">실시간 채팅 상담 서비스<br />곧 오픈 예정입니다</p>
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
          <h3>⚠️ 고객센터 이용 안내</h3>
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
