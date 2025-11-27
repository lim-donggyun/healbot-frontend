import React, { useState } from "react";
import "./MainPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import Section1 from "../components/sections/MainPage/Section1";
import Section2 from "../components/sections/MainPage/Section2";
import Section3 from "../components/sections/MainPage/Section3";
import Section4 from "../components/sections/MainPage/Section4";
import { useScrollNavigation } from "../hooks/useScrollNavigation";
import NoticeDetailModal from "../components/common/NoticeDetailModal";

function MainPage() {
  useScrollNavigation();

  const [selectedHealthInfo, setSelectedHealthInfo] = useState(null);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const handleOpenHealthModal = (healthInfo) => {
    setSelectedHealthInfo(healthInfo);
    setIsHealthModalOpen(true);
  };

  const handleCloseHealthModal = () => {
    setIsHealthModalOpen(false);
    setSelectedHealthInfo(null);
  };

  return (
    <div className="main-page">
      <Header />
      <ScrollToTop />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 onHealthInfoClick={handleOpenHealthModal} />
      <Footer />

      {selectedHealthInfo && (
        <NoticeDetailModal
          isOpen={isHealthModalOpen}
          onClose={handleCloseHealthModal}
          notice={{
            title: selectedHealthInfo.name,
            content: selectedHealthInfo.details,
            category: selectedHealthInfo.category,
            createdAt: null, // No date field available for health info
          }}
        />
      )}
    </div>
  );
}

export default MainPage;

