import React from "react";
import "./MainPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import Section1 from "../components/sections/MainPage/Section1";
import Section2 from "../components/sections/MainPage/Section2";
import Section3 from "../components/sections/MainPage/Section3";
import Section4 from "../components/sections/MainPage/Section4";
import { useScrollNavigation } from "../hooks/useScrollNavigation";

function MainPage() {
  useScrollNavigation();

  return (
    <>
      <Header />
      <ScrollToTop />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
    </>
  );
}

export default MainPage;
