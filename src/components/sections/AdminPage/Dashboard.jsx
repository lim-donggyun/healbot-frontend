import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllMembers } from '../../../utils/adminApi';
import { getAllHospitals } from '../../../utils/hospitalApi';
import { getAllNotices } from '../../../utils/noticeApi';
import { getDailyLoginCount } from '../../../utils/accessLogApi';
import '../../../pages/MainPage.css';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // 통계 데이터 상태
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalHospitals: 0,
    totalNotices: 0,
    newToday: 0,
  });
  const [loading, setLoading] = useState(true);

  // 일별 로그인 횟수 데이터 (최근 7일)
  const [loginTrendData, setLoginTrendData] = useState([]);

  // 조회수 상위 3개 공지사항
  const [topNotices, setTopNotices] = useState([]);

  // 컴포넌트 마운트 시 통계 데이터 가져오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 병렬로 API 호출
        const [members, hospitals, notices, loginData] = await Promise.all([
          getAllMembers(),
          getAllHospitals(),
          getAllNotices(),
          getDailyLoginCount()
        ]);

        // 관리자 제외한 일반 회원만 필터링
        const regularMembers = members.filter(member => member.adminYn !== 'Y');

        // 오늘 가입한 회원 수 계산 (관리자 제외)
        const today = new Date().toISOString().split('T')[0];
        const newToday = regularMembers.filter(member =>
          member.createdAt && member.createdAt.startsWith(today)
        ).length;

        setStats({
          totalMembers: regularMembers.length,
          totalHospitals: hospitals.length,
          totalNotices: notices.length,
          newToday: newToday
        });

        // 로그인 추이 데이터 설정
        setLoginTrendData(loginData || []);

        // 조회수 높은 순으로 정렬하여 상위 3개 추출
        const sortedNotices = [...notices].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        setTopNotices(sortedNotices.slice(0, 3));
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="admin-page">
      <Sidebar />

      <section className="admin-main">
        {/* 수정됨: 빈 헤더 카드 삭제함 */}

        {/* 통계 카드 */}
        <section className="admin-stats">
          <article className="stat-card">
            <div className="stat-label">전체 회원 수</div>
            <div className="stat-main">
              <div className="stat-value">{loading ? '-' : stats.totalMembers}</div>
              <span className="stat-chip">+{loading ? '-' : stats.newToday} 오늘 가입</span>
              <div className="stat-icon">👥</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">총 병원 수</div>
            <div className="stat-main">
              <div className="stat-value">{loading ? '-' : stats.totalHospitals}</div>
              <span className="stat-chip">등록된 병원</span>
              <div className="stat-icon">🏥</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">총 공지사항 수</div>
            <div className="stat-main">
              <div className="stat-value">{loading ? '-' : stats.totalNotices}</div>
              <span className="stat-chip">게시된 공지</span>
              <div className="stat-icon">📢</div>
            </div>
          </article>
        </section>

        {/* 일별 로그인 횟수 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">일별 회원 로그인 횟수</div>
            </div>
          </div>
          <div style={{ marginTop: '24px', width: '100%', height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height={300} minHeight={300}>
              <LineChart data={loginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#888"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '14px' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3284b1"
                  strokeWidth={3}
                  name="로그인 횟수"
                  dot={{ fill: '#3284b1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 조회수 높은 공지사항 TOP 3 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">공지사항 조회수 TOP 3</div>
            </div>
          </div>
          <div className="top-notices-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                로딩 중...
              </div>
            ) : topNotices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                등록된 공지사항이 없습니다.
              </div>
            ) : (
              topNotices.map((notice, index) => (
                <div key={notice.noticeId} className="top-notice-item">
                  <div className="top-notice-rank">{index + 1}</div>
                  <div className="top-notice-content">
                    <div className="top-notice-title">{notice.noticeSubject}</div>
                    <div className="top-notice-meta">
                      <span className="top-notice-category">
                        {notice.category === 'IMPORTANT' ? '중요' :
                         notice.category === 'UPDATE' ? '업데이트' :
                         notice.category === 'EVENT' ? '이벤트' : '공지'}
                      </span>
                      <span className="top-notice-date">
                        {notice.createdAt ? notice.createdAt.split('T')[0].replace(/-/g, '.') : ''}
                      </span>
                    </div>
                  </div>
                  <div className="top-notice-views">
                    <div className="top-notice-views-icon">👁️</div>
                    <div className="top-notice-views-count">
                      {(notice.viewCount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;