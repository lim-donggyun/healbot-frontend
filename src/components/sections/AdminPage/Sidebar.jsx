import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 활성 메뉴 결정
  const isActive = (path) => location.pathname === path;

  // 현재 페이지에 따라 제목과 설명 변경
  const getPageInfo = () => {
    if (location.pathname === '/admin-dashboard') {
      return {
        title: '시스템 관리자',
        role: '전체 회원 / 권한 관리',
        description: '병원 서비스 회원의 가입 정보와 상태를 한 화면에서 관리할 수 있습니다.'
      };
    } else if (location.pathname === '/admin/members') {
      return {
        title: '시스템 관리자',
        role: '회원 관리',
        description: '병원 서비스 회원의 가입 정보와 상태를 한 화면에서 관리할 수 있습니다.'
      };
    } else if (location.pathname === '/admin/hospitals') {
      return {
        title: '시스템 관리자',
        role: '병원 관리',
        description: '등록된 병원 정보를 조회하고 관리할 수 있습니다.'
      };
    } else if (location.pathname === '/admin/notice') {
      return {
        title: '시스템 관리자',
        role: '공지사항 관리',
        description: '사용자에게 공지할 내용을 작성하고 관리할 수 있습니다.'
      };
    } else if (location.pathname === '/admin/review') {
      return {
        title: '시스템 관리자',
        role: '리뷰 관리',
        description: '사용자 리뷰를 조회하고 관리할 수 있습니다.'
      };
    }
    return {
      title: '시스템 관리자',
      role: '관리',
      description: '시스템 관리 기능을 사용할 수 있습니다.'
    };
  };

  const pageInfo = getPageInfo();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-avatar">AD</div>
        <div>
          <div className="admin-info-name">{pageInfo.title}</div>
          <div className="admin-info-role">{pageInfo.role}</div>
        </div>
      </div>
      <div className="admin-sidebar-sub">
        {pageInfo.description}
      </div>
      <nav className="admin-nav">
        <div
          className={`admin-nav-item ${isActive('/admin-dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/admin-dashboard')}
        >
          <span className="icon">📊</span>
          <span>대시보드</span>
        </div>
        <div
          className={`admin-nav-item ${isActive('/admin/members') ? 'active' : ''}`}
          onClick={() => navigate('/admin/members')}
        >
          <span className="icon">👥</span>
          <span>회원 관리</span>
        </div>
        <div
          className={`admin-nav-item ${isActive('/admin/hospitals') ? 'active' : ''}`}
          onClick={() => navigate('/admin/hospitals')}
        >
          <span className="icon">🏥</span>
          <span>병원 관리</span>
        </div>
        <div
          className={`admin-nav-item ${isActive('/admin/notice') ? 'active' : ''}`}
          onClick={() => navigate('/admin/notice')}
        >
          <span className="icon">📢</span>
          <span>공지사항</span>
        </div>
        <div
          className={`admin-nav-item ${isActive('/admin/review') ? 'active' : ''}`}
          onClick={() => navigate('/admin/review')}
        >
          <span className="icon">⭐</span>
          <span>리뷰관리</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
