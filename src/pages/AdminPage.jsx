import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Dashboard from '../components/sections/AdminPage/Dashboard';
import MemberManagement from '../components/sections/AdminPage/MemberManagement';
import Notice from '../components/sections/AdminPage/Notice';
import './AdminPage.css';

const AdminPage = () => {
  const location = useLocation();

  // 현재 경로에 따라 컴포넌트 결정
  const renderContent = () => {
    if (location.pathname === '/admin/members') {
      return <MemberManagement />;
    }
    if (location.pathname === '/admin/notice') {
      return <Notice />;
    }
    return <Dashboard />;
  };

  return (
    <div data-admin-page>
      <Header />
      {renderContent()}
    </div>
  );
};

export default AdminPage;
