import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './Notice.css';

function Notice() {
  const [selectedNotice, setSelectedNotice] = useState(null);

  const notices = [
    {
      id: 1,
      type: '공지',
      title: 'HealBot 서비스 오픈 안내',
      date: '2025-01-15',
      views: 1250,
      content: `안녕하세요, HealBot 입니다.

드디어 HealBot 공식 서비스를 오픈하게 되었습니다.

HealBot은 AI 기반 증상 분석과 의료 정보 제공을 통해 여러분의 건강한 삶을 지원합니다.

주요 기능:
- AI 증상 검색
- 실시간 병원 및 응급실 정보
- 질병 백과 및 건강 정보
- 커뮤니티 서비스

앞으로 더 나은 서비스로 보답하겠습니다.
감사합니다.`
    },
    {
      id: 2,
      type: '업데이트',
      title: '증상 검색 AI 알고리즘 업데이트',
      date: '2025-01-10',
      views: 856,
      content: `HealBot의 증상 검색 AI 알고리즘이 업데이트되었습니다.

업데이트 내용:
- 증상 분석 정확도 15% 향상
- 새로운 질병 데이터 300건 추가
- 검색 속도 개선

더욱 정확하고 빠른 증상 검색 서비스를 경험해 보세요.`
    },
    {
      id: 3,
      type: '점검',
      title: '정기 시스템 점검 안내 (1월 20일)',
      date: '2025-01-08',
      views: 632,
      content: `서비스 품질 향상을 위한 정기 시스템 점검을 실시합니다.

점검 일시: 2025년 1월 20일 (월) 02:00 ~ 06:00 (4시간)
점검 내용: 서버 점검 및 데이터베이스 최적화

점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있습니다.
양해 부탁드립니다.`
    },
    {
      id: 4,
      type: '공지',
      title: '개인정보처리방침 개정 안내',
      date: '2025-01-05',
      views: 445,
      content: `개인정보처리방침이 개정되어 안내드립니다.

개정 시행일: 2025년 1월 15일
주요 개정 내용:
- 개인정보 보유 기간 명확화
- 제3자 정보 제공 절차 강화
- 이용자 권리 보호 조항 추가

자세한 내용은 개인정보처리방침 페이지에서 확인하실 수 있습니다.`
    },
    {
      id: 5,
      type: '이벤트',
      title: '신규 회원 가입 이벤트',
      date: '2025-01-01',
      views: 2103,
      content: `HealBot 신규 회원 가입 이벤트를 진행합니다!

이벤트 기간: 2025년 1월 1일 ~ 1월 31일
혜택:
- 신규 가입 회원 전원 웰컴 쿠폰 지급
- 첫 증상 검색 이용 시 건강 가이드북 제공
- 친구 초대 시 추가 혜택

많은 참여 부탁드립니다!`
    },
    {
      id: 6,
      type: '업데이트',
      title: '모바일 UI 개선 업데이트',
      date: '2024-12-28',
      views: 723,
      content: `모바일 사용자 경험 개선을 위한 UI 업데이트가 적용되었습니다.

개선 사항:
- 터치 인터페이스 최적화
- 화면 크기별 레이아웃 개선
- 페이지 로딩 속도 향상
- 메뉴 접근성 개선

더욱 편리한 모바일 환경을 경험해 보세요.`
    }
  ];

  const getTypeClass = (type) => {
    const typeMap = {
      '공지': 'notice',
      '업데이트': 'update',
      '점검': 'maintenance',
      '이벤트': 'event'
    };
    return typeMap[type] || 'notice';
  };

  return (
    <div className="notice-page-wrapper">
      <Header />
      <div className="page">
        <h1>공지사항</h1>
        <p className="notice-subtitle">HealBot의 새로운 소식과 업데이트를 확인하세요.</p>

        <div className="notice-container">
          {selectedNotice ? (
            <div className="notice-detail">
              <button className="back-button" onClick={() => setSelectedNotice(null)}>
                ← 목록으로
              </button>
              <div className="notice-detail-header">
                <span className={`notice-type-badge ${getTypeClass(selectedNotice.type)}`}>
                  {selectedNotice.type}
                </span>
                <h2>{selectedNotice.title}</h2>
                <div className="notice-detail-meta">
                  <span className="notice-date">📅 {selectedNotice.date}</span>
                  <span className="notice-views">👁 조회수 {selectedNotice.views.toLocaleString()}</span>
                </div>
              </div>
              <div className="notice-detail-content">
                {selectedNotice.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="notice-list">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="notice-item"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <span className={`notice-type-badge ${getTypeClass(notice.type)}`}>
                    {notice.type}
                  </span>
                  <div className="notice-item-content">
                    <h3 className="notice-item-title">{notice.title}</h3>
                    <div className="notice-item-meta">
                      <span className="notice-date">{notice.date}</span>
                      <span className="notice-views">조회 {notice.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="notice-arrow">→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Notice;
