import React from "react";
import "./MentalHealthPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 정신 건강 목록
const mentalHealthList = [
  {
    id: 1,
    name: "스트레스 관리",
    image: "https://cdn.aitimes.com/news/photo/202202/142945_147651_2717.png",
    description: "스트레스를 효과적으로 관리하는 방법을 익히세요.",
    details:
      "만성 스트레스는 신체와 정신 건강에 해롭습니다. 명상, 심호흡, 운동 등을 통해 스트레스를 해소하고, 필요시 전문가의 도움을 받으세요.",
    tips: ["규칙적인 운동", "충분한 수면", "취미 활동", "긍정적 사고"],
  },
  {
    id: 2,
    name: "명상",
    image:
      "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202312/27/bffd1936-20d8-414b-ab1a-5a2d0cf3abf1.jpg",
    description: "마음의 평화와 집중력 향상을 위한 명상을 실천하세요.",
    details:
      "하루 10~20분의 명상으로 스트레스 감소, 집중력 향상, 감정 조절 능력이 향상됩니다. 조용한 공간에서 호흡에 집중하며 시작하세요.",
    tips: ["조용한 환경", "편안한 자세", "호흡에 집중", "꾸준한 실천"],
  },
  {
    id: 3,
    name: "긍정적 사고",
    image: "https://gscaltexmediahub.com/wp-content/uploads/2024/06/img_2-2.png",
    description: "긍정적인 마음가짐으로 정신 건강을 향상시키세요.",
    details:
      "부정적 생각을 긍정적으로 전환하는 연습을 하세요. 감사 일기 쓰기, 긍정 확언, 자신의 강점 인식 등이 도움이 됩니다.",
    tips: ["감사 일기", "긍정 확언", "강점 인식", "부정 전환"],
  },
  {
    id: 4,
    name: "충분한 수면",
    image: "https://cdn.news.hidoc.co.kr/news/photo/201506/8670_18352_0714.jpg",
    description: "양질의 수면은 정신 건강의 기초입니다.",
    details:
      "성인 기준 7~8시간의 충분한 수면이 필요합니다. 규칙적인 수면 시간, 편안한 수면 환경, 카페인 자제 등으로 수면의 질을 높이세요.",
    tips: ["규칙적인 시간", "편안한 환경", "카페인 자제", "전자기기 제한"],
  },
  {
    id: 5,
    name: "사회적 관계",
    image: "https://m.health.chosun.com/site/data/img_dir/2016/09/19/2016091901174_0.jpg",
    description: "건강한 인간관계는 정신 건강에 필수적입니다.",
    details:
      "가족, 친구와의 긍정적인 관계를 유지하세요. 정기적인 만남, 진솔한 대화, 서로에 대한 이해와 존중이 중요합니다.",
    tips: ["정기적 만남", "진솔한 대화", "경청하기", "감정 공유"],
  },
  {
    id: 6,
    name: "마음챙김",
    image:
      "https://img.freepik.com/free-vector/emotions-intelligence-design_24877-81668.jpg?semt=ais_hybrid&w=740&q=80",
    description: "현재 순간에 집중하는 마음챙김을 실천하세요.",
    details:
      "과거나 미래에 대한 걱정보다 현재에 집중하는 연습을 하세요. 오감을 활용한 관찰, 호흡 명상, 마음챙김 걷기 등이 도움이 됩니다.",
    tips: ["현재에 집중", "오감 활용", "판단 없이 관찰", "규칙적 실천"],
  },
  {
    id: 7,
    name: "감정 표현",
    image: "https://m.health.chosun.com/site/data/img_dir/2017/04/05/2017040503007_0.jpg",
    description: "감정을 건강하게 표현하고 조절하는 법을 배우세요.",
    details:
      "감정을 억압하지 말고 적절히 표현하세요. 일기 쓰기, 예술 활동, 신뢰하는 사람과의 대화 등으로 감정을 해소할 수 있습니다.",
    tips: ["일기 쓰기", "예술 활동", "대화하기", "감정 인정"],
  },
  {
    id: 8,
    name: "자기 돌봄",
    image: "http://www.insweek.co.kr/imgdata/insweek_co_kr/202308/2023081159169812.gif",
    description: "자신을 소중히 여기고 돌보는 시간을 가지세요.",
    details:
      "자신에게 투자하는 시간을 만드세요. 좋아하는 활동, 휴식, 자기 계발 등 자신을 위한 시간이 정신 건강에 중요합니다.",
    tips: ["휴식 시간", "취미 활동", "자기 계발", "건강한 습관"],
  },
  {
    id: 9,
    name: "운동",
    image:
      "https://i.namu.wiki/i/cpGZmlb6JnFLwEizT9ztr27Tj0wfCOJEyDsc6Hc7R33-kI8wgDrgViJ1BTTjMJ-yI1RRUv19TMCn1S27aS3botMSHCBwf0LVIj6sQvPZmrybJXllq5dYaFgfg69mrMNQl5JFHaRTBqiocLvyBniIDw.webp",
    description: "규칙적인 운동으로 정신 건강을 증진하세요.",
    details:
      "운동은 엔도르핀을 분비시켜 우울감을 감소시키고 기분을 좋게 합니다. 주 3~5회, 30분 이상의 운동을 권장합니다.",
    tips: ["규칙적 실시", "즐거운 운동", "적절한 강도", "야외 활동"],
  },
  {
    id: 10,
    name: "전문가 상담",
    image: "https://www.dailypop.kr/news/photo/202009/46841_92370_645.jpg",
    description: "필요시 전문가의 도움을 받는 것을 주저하지 마세요.",
    details:
      "정신 건강 문제는 전문가의 도움으로 개선될 수 있습니다. 우울, 불안, 트라우마 등으로 일상생활이 어려울 때는 전문가 상담을 받으세요.",
    tips: ["조기 상담", "정기적 방문", "솔직한 대화", "치료 계획 준수"],
  },
  {
    id: 11,
    name: "디지털 디톡스",
    image: "https://www.tweeteraser.com/ko/resources/wp-content/uploads/2024/04/8398816_3893552.jpg",
    description: "스마트폰과 SNS로부터 벗어나는 시간을 가지세요.",
    details:
      "과도한 디지털 기기 사용은 스트레스, 불안, 수면 장애를 유발합니다. 정해진 시간에만 사용하고, 취침 전에는 사용을 자제하세요.",
    tips: ["사용 시간 제한", "취침 전 금지", "알림 끄기", "오프라인 활동"],
  },
  {
    id: 12,
    name: "자연과의 교감",
    image: "https://img.freepik.com/premium-photo/communion-with-nature_798657-3934.jpg",
    description: "자연 속에서 마음의 평화를 찾으세요.",
    details:
      "자연은 스트레스를 낮추고 기분을 좋게 합니다. 주말에 공원 산책, 등산, 캠핑 등 자연과 함께하는 시간을 가지세요.",
    tips: ["규칙적 산책", "녹지 공간", "햇빛 쬐기", "야외 활동"],
  },
  {
    id: 13,
    name: "음악 치료",
    image: "https://flexible.img.hani.co.kr/flexible/normal/700/494/imgdb/original/2023/0420/3416819789465869.webp",
    description: "음악을 통해 감정을 조절하고 스트레스를 해소하세요.",
    details:
      "좋아하는 음악을 듣거나 악기를 연주하며 마음의 평화를 찾으세요. 음악은 기분을 전환하고, 불안을 감소시키며, 긍정적인 감정을 불러일으킵니다.",
    tips: ["좋아하는 음악 듣기", "악기 연주", "노래 부르기", "음악에 집중"],
  },
  {
    id: 14,
    name: "아로마 테라피",
    image: "https://cdn.news.hidoc.co.kr/news/photo/202407/32736_78172_0219.png",
    description: "향기 요법으로 심리적 안정과 휴식을 취하세요.",
    details:
      "라벤더, 캐모마일, 페퍼민트 등의 에센셜 오일로 심신의 안정을 찾으세요. 향기는 뇌의 감정 중추를 자극해 스트레스를 완화하고 기분을 개선합니다.",
    tips: ["에센셜 오일 사용", "디퓨저 활용", "목욕 시 적용", "마사지와 함께"],
  },
  {
    id: 15,
    name: "웃음 치료",
    image:
      "https://www.korea.kr/newsWeb/resources/temp/images/000018/%EC%9B%83%EC%9D%8C%EC%B9%98%EB%A3%8C%EC%82%AC_%EB%B3%B8%EB%AC%B8.jpg",
    description: "웃음으로 스트레스를 해소하고 기분을 전환하세요.",
    details:
      "웃음은 엔도르핀을 분비시켜 스트레스 호르몬을 감소시킵니다. 코미디 영화, 유머, 웃음 요가 등으로 웃는 시간을 늘리세요.",
    tips: ["코미디 시청", "유머 공유", "웃음 요가", "긍정적 환경"],
  },
];

function MentalHealthPage() {
  return (
    <div className="mental-health-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="mental-health-page-container">
        {/* 페이지 헤더 */}
        <div className="mental-health-page-header">
          <div className="header-content">
            <h1>정신 건강</h1>
            <p className="header-subtitle">마음의 건강을 위한 다양한 방법을 확인하세요</p>
          </div>
        </div>

        {/* 정신 건강 그리드 */}
        <div className="mental-health-content">
          <div className="mental-health-grid">
            {mentalHealthList.map((item) => (
              <div key={item.id} className="mental-health-card">
                <div className="mental-health-image-container">
                  <img src={item.image} alt={item.name} className="mental-health-image" />
                </div>

                <div className="mental-health-content-area">
                  <h3 className="mental-health-name">{item.name}</h3>
                  <p className="mental-health-description">{item.description}</p>
                  <p className="mental-health-details">{item.details}</p>

                  <div className="mental-health-tips">
                    <div className="tips-title">실천 방법</div>
                    <div className="tips-list">
                      {item.tips.map((tip, idx) => (
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

export default MentalHealthPage;
