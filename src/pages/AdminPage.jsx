import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Dashboard from '../components/sections/AdminPage/Dashboard';
import MemberManagement from '../components/sections/AdminPage/MemberManagement';
import Notice from '../components/sections/AdminPage/Notice';
import HospitalManagement from '../components/sections/AdminPage/HospitalManagement';
import Community from '../components/sections/AdminPage/Community';
import Report from '../components/sections/AdminPage/Report';
import OCR from '../components/sections/AdminPage/OCR';
import FeaturedDiseases from '../components/sections/AdminPage/FeaturedDiseases';
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
    if (location.pathname === '/admin/hospitals') {
      return <HospitalManagement />;
    }
    if (location.pathname === '/admin/community') {
      return <Community />;
    }
    if (location.pathname === '/admin/reports') {
      return <Report />;
    }
    if (location.pathname === '/admin/ocr') {
      return <OCR />;
    }
    if (location.pathname === '/admin/featured-diseases') {
      return <FeaturedDiseases />;
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
