import React from 'react';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './Dashboard.css';

const Dashboard = () => {
  // 통계 데이터 (임시)
  const stats = {
    totalMembers: 150,
    activeMembers: 142,
    newToday: 5,
    totalDoctors: 25,
    totalNurses: 48,
  };

  return (
      <main className="admin-page">
        <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 대시보드 헤더 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">관리자 대시보드</div>
              <div className="admin-card-sub">
                병원 서비스의 주요 지표와 현황을 한눈에 확인할 수 있습니다.
              </div>
            </div>
          </div>
        </section>

        {/* 통계 카드 */}
        <section className="admin-stats">
          <article className="stat-card">
            <div className="stat-label">전체 회원 수</div>
            <div className="stat-main">
              <div className="stat-value">{stats.totalMembers}</div>
              <span className="stat-chip">+{stats.newToday} 오늘 가입</span>
              <div className="stat-icon">👥</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">정상 · 이용 중</div>
            <div className="stat-main">
              <div className="stat-value">{stats.activeMembers}</div>
              <span className="stat-chip">서비스 이용 중</span>
              <div className="stat-icon">✅</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">휴면 · 탈퇴 계정</div>
            <div className="stat-main">
              <div className="stat-value">{stats.totalMembers - stats.activeMembers}</div>
              <span className="stat-chip warning">재활성 검토 필요</span>
              <div className="stat-icon">⚠️</div>
            </div>
          </article>
        </section>

        {/* 의료진 통계 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">의료진 현황</div>
              <div className="admin-card-sub">
                등록된 의료진 정보를 확인할 수 있습니다.
              </div>
            </div>
          </div>
          <div className="admin-stats" style={{ marginTop: '16px' }}>
            <article className="stat-card">
              <div className="stat-label">의사</div>
              <div className="stat-main">
                <div className="stat-value">{stats.totalDoctors}</div>
                <span className="stat-chip">명</span>
                <div className="stat-icon">🩺</div>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-label">간호사</div>
              <div className="stat-main">
                <div className="stat-value">{stats.totalNurses}</div>
                <span className="stat-chip">명</span>
                <div className="stat-icon">💉</div>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-label">전체 의료진</div>
              <div className="stat-main">
                <div className="stat-value">{stats.totalDoctors + stats.totalNurses}</div>
                <span className="stat-chip">명</span>
                <div className="stat-icon">👨‍⚕️</div>
              </div>
            </article>
          </div>
        </section>

        {/* 빠른 메뉴 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">빠른 메뉴</div>
              <div className="admin-card-sub">
                자주 사용하는 관리 기능에 빠르게 접근할 수 있습니다.
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
            <button
              className="quick-menu-btn"
              onClick={() => navigate('/admin/members')}
            >
              <span className="quick-menu-icon">👥</span>
              <div className="quick-menu-text">
                <div className="quick-menu-title">회원 관리</div>
                <div className="quick-menu-desc">회원 정보 조회 및 관리</div>
              </div>
            </button>
            <button className="quick-menu-btn">
              <span className="quick-menu-icon">🩺</span>
              <div className="quick-menu-text">
                <div className="quick-menu-title">의료진 관리</div>
                <div className="quick-menu-desc">의료진 계정 관리</div>
              </div>
            </button>
            <button className="quick-menu-btn">
              <span className="quick-menu-icon">📊</span>
              <div className="quick-menu-text">
                <div className="quick-menu-title">통계 보기</div>
                <div className="quick-menu-desc">상세 통계 및 리포트</div>
              </div>
            </button>
            <button className="quick-menu-btn">
              <span className="quick-menu-icon">⚙️</span>
              <div className="quick-menu-text">
                <div className="quick-menu-title">시스템 설정</div>
                <div className="quick-menu-desc">권한 및 환경설정</div>
              </div>
            </button>
          </div>
        </section>
      </section>
      </main>
  );
};

export default Dashboard;
