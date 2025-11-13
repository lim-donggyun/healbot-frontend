import React from "react";
import DropdownMenu from "./DropdownMenu";

const symptomSearchMenu = {
  columns: [
    {
      title: "증상 입력",
      items: [
        { label: "증상 직접 입력", href: "#search" },
        { label: "증상 체크리스트", href: "#search" },
      ],
    },
    {
      title: "신체 부위별",
      items: [
        { label: "머리/얼굴", href: "#search" },
        { label: "목/어깨", href: "#search" },
        { label: "가슴/배", href: "#search" },
        { label: "팔/다리", href: "#search" },
      ],
    },
    {
      title: "증상 카테고리",
      items: [
        { label: "발열/오한", href: "#search" },
        { label: "통증", href: "#search" },
        { label: "소화기 증상", href: "#search" },
        { label: "호흡기 증상", href: "#search" },
      ],
    },
  ],
};

const hospitalSearchMenu = {
  columns: [
    {
      title: "의료기관 찾기",
      items: [
        { label: "병원 찾기", href: "/hospitals" },
        { label: "응급실 찾기", href: "/emergency" },
        { label: "야간 진료", href: "/hospitals?open=night" },
        { label: "주말 진료", href: "/hospitals?open=weekend" },
      ],
    },
    {
      title: "내과 계열",
      items: [
        { label: "내과", href: "/hospitals?dept=internal" },
        { label: "소화기내과", href: "/hospitals?dept=gastro" },
        { label: "심장내과", href: "/hospitals?dept=cardio" },
        { label: "신경과", href: "/hospitals?dept=neuro" },
      ],
    },
    {
      title: "외과 계열",
      items: [
        { label: "외과", href: "/hospitals?dept=surgery" },
        { label: "정형외과", href: "/hospitals?dept=ortho" },
        { label: "신경외과", href: "/hospitals?dept=neuro-surg" },
        { label: "성형외과", href: "/hospitals?dept=plastic" },
      ],
    },
    {
      title: "기타 진료과",
      items: [
        { label: "소아청소년과", href: "/hospitals?dept=pediatrics" },
        { label: "산부인과", href: "/hospitals?dept=obgyn" },
        { label: "피부과", href: "/hospitals?dept=derma" },
        {
          label: "전체 진료과 보기",
          href: "/hospitals?dept=more",
          highlight: true,
        },
      ],
    },
  ],
};

const healthInfoMenu = {
  columns: [
    {
      title: "질병 정보",
      items: [
        { label: "질병 백과", href: "/health-info?cat=disease" },
        { label: "증상별 질병", href: "/health-info?cat=symptom" },
        { label: "만성질환", href: "/health-info?cat=chronic" },
        { label: "감염병", href: "/health-info?cat=infection" },
      ],
    },
    {
      title: "건강 관리",
      items: [
        { label: "예방법", href: "/health-info?cat=prevention" },
        { label: "영양 가이드", href: "/health-info?cat=nutrition" },
        { label: "운동 정보", href: "/health-info?cat=exercise" },
        { label: "정신 건강", href: "/health-info?cat=mental" },
      ],
    },
    {
      title: "약물 정보",
      items: [
        { label: "약물 검색", href: "/health-info?cat=medicine" },
        { label: "부작용 정보", href: "/health-info?cat=side-effect" },
        { label: "약물 상호작용", href: "/health-info?cat=interaction" },
      ],
    },
    {
      title: "미디어",
      items: [
        { label: "건강 영상", href: "/health-info?cat=video" },
        { label: "전문의 강의", href: "/health-info?cat=webinar" },
        { label: "인포그래픽", href: "/health-info?cat=infographic" },
      ],
    },
  ],
};

function Navigation() {
  return (
    <nav>
      <div className="nav-item">
        <span className="nav-link">증상검색</span>
        <DropdownMenu menuData={symptomSearchMenu} />
      </div>

      <div className="nav-item">
        <span className="nav-link">병원 검색하기</span>
        <DropdownMenu menuData={hospitalSearchMenu} />
      </div>

      <div className="nav-item">
        <span className="nav-link">건강정보</span>
        <DropdownMenu menuData={healthInfoMenu} />
      </div>

      <div className="nav-item">
        <a href="/community" className="nav-link">
          커뮤니티
        </a>
      </div>
    </nav>
  );
}

export default Navigation;
