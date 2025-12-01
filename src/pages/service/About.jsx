import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './About.css';

function About() {
  return (
    <div className="about-page-wrapper">
      <Header />
      <div className="page">
        <h1>서비스 소개</h1>
        <p className="about-subtitle">HealBot은 당신의 건강한 삶을 위한 스마트 의료 정보 플랫폼입니다.</p>

        <section className="about-section hero-section">
          <div className="hero-content">
            <h2>HealBot이란?</h2>
            <p>
              HealBot은 AI 기반 증상 분석과 의료 정보 제공을 통해 사용자들이 더 빠르고 정확하게
              자신의 건강 상태를 파악하고 적절한 의료 서비스를 받을 수 있도록 돕는 플랫폼입니다.
            </p>
            <p>
              복잡한 의료 정보를 쉽게 이해할 수 있도록 하고, 가까운 병원과 응급실 정보를 실시간으로
              제공하여 응급 상황에서도 신속하게 대처할 수 있도록 지원합니다.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>주요 기능</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3>AI 증상 검색</h3>
              <p>증상을 입력하면 AI가 분석하여 가능성 있는 질병과 대처 방법을 안내합니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </svg>
              </div>
              <h3>병원 찾기</h3>
              <p>진료과목별, 지역별로 병원을 검색하고 진료시간, 위치 정보를 확인할 수 있습니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3>응급실 정보</h3>
              <p>실시간 응급실 가용 병상 정보와 위치를 제공하여 응급 상황에 빠르게 대응합니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3>질병 백과</h3>
              <p>다양한 질병에 대한 상세 정보, 증상, 예방법, 치료법을 제공합니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>약물 정보</h3>
              <p>의약품 검색, 복용법, 부작용, 상호작용 정보를 확인할 수 있습니다.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>커뮤니티</h3>
              <p>건강 관련 정보를 공유하고 다른 사용자들과 소통할 수 있습니다.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>왜 HealBot인가?</h2>
          <div className="why-list">
            <div className="why-item">
              <div className="why-number">01</div>
              <div className="why-content">
                <h3>정확한 정보</h3>
                <p>의료 전문가들이 검증한 신뢰할 수 있는 건강 정보를 제공합니다.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">02</div>
              <div className="why-content">
                <h3>빠른 접근성</h3>
                <p>언제 어디서나 쉽고 빠르게 필요한 의료 정보에 접근할 수 있습니다.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">03</div>
              <div className="why-content">
                <h3>개인 맞춤형</h3>
                <p>사용자의 건강 상태와 관심사에 맞춘 맞춤형 정보를 제공합니다.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-number">04</div>
              <div className="why-content">
                <h3>지속적인 업데이트</h3>
                <p>최신 의료 정보와 건강 트렌드를 반영하여 지속적으로 업데이트합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>우리의 비전</h2>
          <div className="vision-content">
            <p>
              HealBot은 모든 사람이 건강 정보에 쉽게 접근하고, 자신의 건강을 스스로 관리할 수 있는
              세상을 만들고자 합니다. 기술과 의료의 융합을 통해 더 건강한 사회를 만드는 것이 우리의 목표입니다.
            </p>
            <div className="vision-box">
              <h3>"모두가 건강한 삶을 누릴 수 있는 세상"</h3>
              <p>HealBot과 함께 더 건강한 내일을 만들어가세요.</p>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>문의하기</h2>
          <p>서비스에 대한 문의사항이나 제안이 있으시면 언제든지 연락 주세요.</p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>이메일</strong>
              <p>support@healbot.com</p>
            </div>
            <div className="contact-item">
              <strong>전화</strong>
              <p>1588-0000</p>
            </div>
            <div className="contact-item">
              <strong>운영시간</strong>
              <p>평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default About;
