import React from "react";
import "./MainPage.css";
import Header from "../components/layout/Header";
import HamburgerMenu from "../components/layout/HamburgerMenu";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import MainSlider from "../components/sections/MainSlider";
import SymptomSearchNew from "../components/sections/SymptomSearchNew";
import Departments from "../components/sections/Departments";
import InfoSection from "../components/sections/InfoSection";
import { useScrollNavigation } from "../hooks/useScrollNavigation";
import { useHamburgerMenu } from "../hooks/useHamburgerMenu";

function MainPage() {
  useScrollNavigation();
  useHamburgerMenu();

  return (
    <>
      <Header />
      <HamburgerMenu />
      <ScrollToTop />
      <MainSlider />
      <SymptomSearchNew />
      <Departments />
      <InfoSection />
      <Footer />
    </>
  );
}

export default MainPage;
