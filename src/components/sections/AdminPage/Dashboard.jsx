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

        // 오늘 가입한 회원 수 계산
        const today = new Date().toISOString().split('T')[0];
        const newToday = members.filter(member =>
          member.createdAt && member.createdAt.startsWith(today)
        ).length;

        setStats({
          totalMembers: members.length,
          totalHospitals: hospitals.length,
          totalNotices: notices.length,
          newToday: newToday
        });

        // 로그인 추이 데이터 설정
        setLoginTrendData(loginData || []);
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
              <div className="admin-card-title">일별 로그인 횟수</div>
              <div className="admin-card-sub">
                최근 7일간 사용자 로그인 활동 현황을 확인할 수 있습니다.
              </div>
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
      </section>
      </main>
  );
};

export default Dashboard;
