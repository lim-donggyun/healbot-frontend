import React, { useEffect } from "react";
import "./ExercisePage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 운동 정보 목록
const exerciseList = [
  {
    id: 1,
    name: "걷기",
    image: "https://m.health.chosun.com/site/data/img_dir/2018/09/03/2018090301669_0.jpg",
    description: "가장 간편하고 안전한 유산소 운동입니다.",
    details:
      "하루 30분 이상 빠르게 걷기를 권장합니다. 심혈관 건강, 체중 조절, 스트레스 해소에 효과적이며 특별한 장비 없이 누구나 쉽게 시작할 수 있습니다.",
    tips: ["바른 자세 유지", "편한 신발 착용", "팔 자연스럽게 흔들기", "규칙적으로 실시"],
  },
  {
    id: 2,
    name: "달리기",
    image: "https://cdn.ikunkang.com/news/photo/202204/35659_27226_5228.jpg",
    description: "강도 높은 유산소 운동으로 체력 향상에 효과적입니다.",
    details:
      "주 3~5회, 20~30분씩 실시합니다. 심폐 지구력 향상, 체지방 감소, 골밀도 증가에 도움이 됩니다. 준비운동과 정리운동을 반드시 실시하세요.",
    tips: ["준비운동 필수", "적절한 러닝화", "천천히 강도 증가", "무릎 보호"],
  },
  {
    id: 3,
    name: "수영",
    image: "https://www.ftimes.kr/news/photo/202108/12271_13474_4515.jpg",
    description: "전신 운동으로 관절에 부담이 적습니다.",
    details:
      "주 2~3회, 30분 이상 실시합니다. 모든 근육을 사용하는 전신 운동이며, 물의 부력으로 관절 부담이 적어 재활 운동으로도 좋습니다.",
    tips: ["적절한 수온 선택", "준비운동 충분히", "자신의 페이스 유지", "수영 후 스트레칭"],
  },
  {
    id: 4,
    name: "자전거 타기",
    image: "https://m.health.chosun.com/site/data/img_dir/2020/08/26/2020082603175_0.jpg",
    description: "하체 근력과 심폐 기능을 동시에 향상시킵니다.",
    details:
      "주 3~4회, 30~60분씩 실시합니다. 무릎에 부담이 적으면서도 효과적인 유산소 운동으로 체지방 감소와 하체 근력 강화에 좋습니다.",
    tips: ["안장 높이 조절", "안전 장비 착용", "평지에서 시작", "점진적 강도 증가"],
  },
  {
    id: 5,
    name: "근력 운동",
    image: "https://m.health.chosun.com/site/data/img_dir/2017/05/11/2017051102229_0.jpg",
    description: "근육량 증가와 기초대사량 향상에 필수적입니다.",
    details:
      "주 2~3회, 각 부위별로 실시합니다. 근육량 유지 및 증가, 골밀도 강화, 기초대사량 증가로 체중 관리에 도움이 됩니다.",
    tips: ["정확한 자세", "적절한 중량", "충분한 휴식", "부위별 분할"],
  },
  {
    id: 6,
    name: "요가",
    image: "https://www.k-health.com/news/photo/202310/67605_73997_4155.jpg",
    description: "유연성과 정신 건강을 동시에 향상시킵니다.",
    details:
      "주 2~3회, 30~60분씩 실시합니다. 유연성 향상, 근력 강화, 스트레스 해소, 자세 교정에 효과적이며 명상을 통한 정신 건강에도 도움이 됩니다.",
    tips: ["무리하지 않기", "호흡에 집중", "매트 사용", "전문가 지도"],
  },
  {
    id: 7,
    name: "필라테스",
    image: "https://www.k-health.com/news/photo/202407/73498_80893_2543.jpg",
    description: "코어 근육 강화와 자세 교정에 효과적입니다.",
    details:
      "주 2~3회, 40~60분씩 실시합니다. 코어 근육 강화, 자세 교정, 유연성 향상에 탁월하며 재활 운동으로도 활용됩니다.",
    tips: ["코어에 집중", "호흡 조절", "정확한 동작", "전문가 수업"],
  },
  {
    id: 8,
    name: "등산",
    image:
      "https://i.namu.wiki/i/E7jFXJu3AdALa7JUE3vIoy4TmDG-9NDCeZ7FYCuMm4yHoWkBx0IP1IqlYnQRq4lFaj4u5uhwWI1_Dg1W551XWNfRayZs06YOHSHU21NdT2ZK1eFGnb_FWNG2wvKLA9GUd1vhTJWQY_a4y6MwJEezhw.webp",
    description: "자연 속에서 즐기는 전신 운동입니다.",
    details:
      "주 1~2회, 2~4시간 실시합니다. 유산소 운동과 하체 근력 운동을 동시에 할 수 있으며, 자연 속에서 스트레스 해소와 정신 건강에도 좋습니다.",
    tips: ["등산화 착용", "스틱 활용", "충분한 수분", "무리하지 않기"],
  },
  {
    id: 9,
    name: "스트레칭",
    image: "https://m.health.chosun.com/site/data/img_dir/2021/03/16/2021031602429_0.jpg",
    description: "유연성 향상과 부상 예방에 필수적입니다.",
    details:
      "매일 10~15분씩 실시합니다. 운동 전후로 실시하여 부상을 예방하고, 근육의 유연성을 높여 일상 생활의 움직임을 개선합니다.",
    tips: ["천천히 진행", "반동 주지 않기", "통증 시 중단", "규칙적 실시"],
  },
  {
    id: 10,
    name: "수중 에어로빅",
    image:
      "https://pushasrx.com/wp-content/uploads/2024/06/trainer-holding-barbells-while-exercising-with-gro-2023-11-27-04-51-13-utc_02.jpg",
    description: "관절 부담 없이 전신 운동 효과를 얻을 수 있습니다.",
    details:
      "주 2~3회, 40~60분씩 실시합니다. 물의 저항을 이용한 운동으로 관절에 부담이 적고 칼로리 소모가 높아 비만, 관절염 환자에게 좋습니다.",
    tips: ["수온 확인", "수영복 착용", "수심 적당히", "무리하지 않기"],
  },
  {
    id: 11,
    name: "줄넘기",
    image: "https://cdn.newssun.kr/news/photo/202409/76165_46013_850.jpg",
    description: "짧은 시간에 높은 칼로리 소모가 가능합니다.",
    details:
      "주 3~4회, 10~20분씩 실시합니다. 심폐 지구력 향상, 체지방 감소, 전신 협응력 향상에 효과적이며 장소와 시간에 구애받지 않습니다.",
    tips: ["적절한 줄 길이", "충격 흡수 신발", "평평한 바닥", "점진적 증가"],
  },
  {
    id: 12,
    name: "계단 오르기",
    image: "https://img.freepik.com/free-photo/full-shot-woman-stairs_23-2149148418.jpg?semt=ais_hybrid&w=740&q=80",
    description: "일상에서 쉽게 할 수 있는 효과적인 운동입니다.",
    details:
      "매일 10~20분씩 실시합니다. 하체 근력 강화, 심폐 기능 향상, 체지방 감소에 효과적이며 엘리베이터 대신 계단을 이용하는 것만으로도 건강 증진 효과가 있습니다.",
    tips: ["바른 자세", "천천히 시작", "손잡이 활용", "무릎 보호"],
  },
];

function ExercisePage() {
  useEffect(() => {
    // 드래그 방지
    document.body.style.setProperty('user-select', 'none', 'important');
    document.body.style.setProperty('-webkit-user-select', 'none', 'important');
  }, []);

  return (
    <div className="exercise-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="exercise-page-container">
        {/* 페이지 헤더 */}
        <div className="exercise-page-header">
          <div className="header-content">
            <h1>운동 정보</h1>
            <p className="header-subtitle">건강한 신체를 위한 다양한 운동 방법을 확인하세요</p>
          </div>
        </div>

        {/* 운동 정보 그리드 */}
        <div className="exercise-content">
          <div className="exercise-grid">
            {exerciseList.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-image-container">
                  <img src={exercise.image} alt={exercise.name} className="exercise-image" />
                </div>

                <div className="exercise-content-area">
                  <h3 className="exercise-name">{exercise.name}</h3>
                  <p className="exercise-description">{exercise.description}</p>
                  <p className="exercise-details">{exercise.details}</p>

                  <div className="exercise-tips">
                    <div className="tips-title">운동 팁</div>
                    <div className="tips-list">
                      {exercise.tips.map((tip, idx) => (
                        <span key={idx} className="tip-badge">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ExercisePage;
