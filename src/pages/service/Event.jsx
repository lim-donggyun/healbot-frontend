import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './Event.css';

function Event() {
  const events = [
    {
      id: 1,
      title: '신규 회원 가입 이벤트',
      period: '2025.01.01 ~ 2025.01.31',
      status: '진행중',
      icon: 'gift',
      description: '신규 회원 가입 시 다양한 혜택을 드립니다!',
      details: [
        '웰컴 쿠폰 즉시 지급',
        '첫 증상 검색 건강 가이드북 제공',
        '친구 초대 시 추가 혜택'
      ]
    },
    {
      id: 2,
      title: '출석 체크 이벤트',
      period: '2025.01.01 ~ 2025.12.31',
      status: '진행중',
      icon: 'calendar',
      description: '매일 출석하고 포인트를 받아가세요!',
      details: [
        '일일 출석 시 10포인트 지급',
        '7일 연속 출석 시 보너스 100포인트',
        '한 달 개근 시 스페셜 리워드'
      ]
    },
    {
      id: 3,
      title: '건강 정보 공유 이벤트',
      period: '2025.01.15 ~ 2025.02.15',
      status: '진행중',
      icon: 'message',
      description: '건강 팁을 공유하고 포인트를 받으세요!',
      details: [
        '커뮤니티에 건강 정보 게시 시 포인트 지급',
        '추천수 높은 게시글 추가 보상',
        '매주 베스트 게시글 선정'
      ]
    },
    {
      id: 4,
      title: '설 명절 특별 이벤트',
      period: '2025.01.25 ~ 2025.02.05',
      status: '예정',
      icon: 'star',
      description: '설 명절을 맞이하여 특별한 이벤트를 준비했습니다!',
      details: [
        '럭키드로우 이벤트',
        '건강 관련 퀴즈 이벤트',
        '푸짐한 경품 증정'
      ]
    }
  ];

  const renderIcon = (iconType) => {
    const icons = {
      gift: <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 12 20 22 4 22 4 12"></polyline>
        <rect x="2" y="7" width="20" height="5"></rect>
        <line x1="12" y1="22" x2="12" y2="7"></line>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
      </svg>,
      calendar: <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>,
      message: <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>,
      star: <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    };
    return icons[iconType];
  };

  return (
    <div className="event-page-wrapper">
      <Header />
      <div className="page">
        <h1>이벤트</h1>
        <p className="event-subtitle">HealBot의 다양한 이벤트에 참여하세요!</p>

        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-status-badge" data-status={event.status}>
                {event.status}
              </div>
              <div className="event-image">{renderIcon(event.icon)}</div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-period">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '6px'}}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {event.period}
                </p>
                <p className="event-description">{event.description}</p>
                <ul className="event-details">
                  {event.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                <button className="event-participate-btn">
                  {event.status === '진행중' ? '참여하기' : '자세히 보기'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="event-notice-box">
          <h3>이벤트 참여 안내</h3>
          <ul>
            <li>이벤트는 HealBot 회원만 참여 가능합니다.</li>
            <li>이벤트 내용 및 기간은 사전 공지 없이 변경될 수 있습니다.</li>
            <li>부정한 방법으로 참여 시 이벤트 혜택이 제한될 수 있습니다.</li>
            <li>당첨자 발표는 이벤트 종료 후 7일 이내에 개별 안내됩니다.</li>
          </ul>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Event;
