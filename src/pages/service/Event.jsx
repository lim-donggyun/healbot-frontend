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
      image: '🎁',
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
      image: '📅',
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
      image: '💬',
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
      image: '🎊',
      description: '설 명절을 맞이하여 특별한 이벤트를 준비했습니다!',
      details: [
        '럭키드로우 이벤트',
        '건강 관련 퀴즈 이벤트',
        '푸짐한 경품 증정'
      ]
    }
  ];

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
              <div className="event-image">{event.image}</div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-period">📅 {event.period}</p>
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
