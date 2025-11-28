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
import DiseaseResultModal from "../components/common/DiseaseResultModal";

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

      <DiseaseResultModal
        isOpen={isHealthModalOpen}
        onClose={handleCloseHealthModal}
        disease={selectedHealthInfo}
      />
    </div>
  );
}

export default MainPage;

