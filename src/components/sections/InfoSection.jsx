import React from "react";
import NoticeList from "./NoticeList";
import HealthInfo from "./HealthInfo";

function InfoSection() {
  return (
    <section id="info" className="section section-info">
      <div className="info-container">
        <NoticeList />
        <HealthInfo />
      </div>
    </section>
  );
}

export default InfoSection;
