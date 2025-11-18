import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from '../components/layout/AdminHeader';
import Footer from '../components/layout/Footer';
import Dashboard from '../components/sections/AdminPage/Dashboard';
import MemberManagement from '../components/sections/AdminPage/MemberManagement';

const AdminPage = () => {
  const location = useLocation();

  // 현재 경로에 따라 컴포넌트 결정
  const renderContent = () => {
    if (location.pathname === '/admin/members') {
      return <MemberManagement />;
    }
    return <Dashboard />;
  };

  return (
    <>
      <AdminHeader />
      {renderContent()}
      <Footer />
    </>
  );
};

export default AdminPage;
