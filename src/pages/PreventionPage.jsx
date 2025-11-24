import React from "react";
import "./PreventionPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 예방법 목록
const preventionList = [
  {
    id: 1,
    name: "손 씻기",
    image: "https://www.korea.kr/newsWeb/resources/temp/images/000115/%EC%86%901.jpg",
    description: "손 씻기는 감염병 예방의 가장 기본적이고 효과적인 방법입니다.",
    details:
      "비누를 이용해 흐르는 물에 30초 이상 손을 씻어야 합니다. 특히 식사 전, 화장실 사용 후, 외출 후에는 반드시 손을 씻어야 합니다.",
    tips: ["비누 사용하기", "30초 이상 씻기", "손가락 사이도 꼼꼼히", "흐르는 물에 헹구기"],
  },
  {
    id: 2,
    name: "규칙적인 운동",
    image: "https://cdnweb01.wikitree.co.kr/webdata/editor/202506/02/img_20250602153535_45fc8ce3.webp",
    description: "규칙적인 운동은 면역력을 높이고 만성질환을 예방합니다.",
    details:
      "주 3회 이상, 하루 30분 이상의 유산소 운동을 권장합니다. 걷기, 조깅, 수영 등 자신에게 맞는 운동을 선택하세요.",
    tips: ["주 3회 이상 운동", "30분 이상 지속", "준비운동 필수", "무리하지 않기"],
  },
  {
    id: 3,
    name: "균형잡힌 식사",
    image:
      "https://st4.depositphotos.com/19351868/38533/v/1600/depositphotos_385331920-stock-illustration-healthy-eating-tips-infographic-chart.jpg",
    description: "균형잡힌 식사는 건강한 신체를 유지하는 기본입니다.",
    details:
      "탄수화물, 단백질, 지방, 비타민, 무기질을 골고루 섭취해야 합니다. 채소와 과일을 충분히 먹고, 가공식품과 과도한 염분 섭취는 피하세요.",
    tips: ["채소 과일 충분히", "규칙적인 식사", "과식 피하기", "수분 섭취"],
  },
  {
    id: 4,
    name: "충분한 수면",
    image: "https://cdn.news.hidoc.co.kr/news/photo/201506/8670_18352_0714.jpg",
    description: "충분한 수면은 면역력 강화와 스트레스 해소에 필수적입니다.",
    details:
      "성인 기준 하루 7-8시간의 수면을 권장합니다. 규칙적인 수면 시간을 유지하고, 잠들기 전 카페인 섭취를 피하세요.",
    tips: ["7-8시간 수면", "규칙적인 취침", "수면 환경 조성", "카페인 자제"],
  },
  {
    id: 5,
    name: "예방접종",
    image: "https://cdn.jhealthmedia.joins.com/news/photo/202004/21705_18893_1358.jpg",
    description: "예방접종은 감염병으로부터 몸을 보호하는 효과적인 방법입니다.",
    details:
      "독감, 폐렴구균, 대상포진 등 연령과 건강상태에 맞는 예방접종을 받으세요. 정기적인 접종 일정을 확인하고 놓치지 않는 것이 중요합니다.",
    tips: ["접종 일정 확인", "연령별 접종", "건강상태 고려", "정기적 접종"],
  },
  {
    id: 6,
    name: "정기 건강검진",
    image: "https://d2m9duoqjhyhsq.cloudfront.net/marketingContents/article/article9-01.jpg",
    description: "정기 건강검진으로 질병을 조기에 발견하고 예방할 수 있습니다.",
    details: "연령과 성별에 따라 권장되는 검진 항목이 다릅니다. 국가건강검진을 활용하고, 필요시 추가 검진을 받으세요.",
    tips: ["정기검진 실시", "검진결과 확인", "이상 시 진료", "연령별 검진"],
  },
  {
    id: 7,
    name: "금연",
    image: "https://news.amc.seoul.kr/news/imageDown/news/20231127?fileName=CK_cb046020120.jpg",
    description: "금연은 폐암, 심혈관질환 등 다양한 질병을 예방합니다.",
    details:
      "흡연은 폐뿐만 아니라 전신 건강에 악영향을 미칩니다. 금연을 결심했다면 금연클리닉이나 금연보조제를 활용하세요.",
    tips: ["금연 결심", "금연클리닉 이용", "스트레스 관리", "주변 도움 받기"],
  },
  {
    id: 8,
    name: "절주",
    image: "https://www.wknews.net/news/photo/201704/12661_7338_1848.JPG",
    description: "과도한 음주는 간질환, 암 등 여러 질병의 원인이 됩니다.",
    details: "성인 남성 기준 하루 2잔 이하, 여성은 1잔 이하로 제한하는 것이 좋습니다. 주 2회 이상은 금주하세요.",
    tips: ["적정량 음주", "주 2회 금주", "빈속 음주 피하기", "천천히 마시기"],
  },
  {
    id: 9,
    name: "스트레스 관리",
    image: "https://cdn.aitimes.com/news/photo/202202/142945_147651_2717.png",
    description: "스트레스 관리는 신체적, 정신적 건강을 위해 중요합니다.",
    details: "명상, 요가, 취미활동 등 자신만의 스트레스 해소법을 찾으세요. 필요시 전문가의 도움을 받는 것도 좋습니다.",
    tips: ["이완 기법 활용", "취미활동", "충분한 휴식", "전문가 상담"],
  },
  {
    id: 10,
    name: "구강 위생",
    image: "https://news.amc.seoul.kr/news/imageDown/news/20231127?fileName=CK_tip034d14120039.jpg",
    description: "구강 건강은 전신 건강과 밀접한 관련이 있습니다.",
    details: "하루 3회 식후 양치질을 하고, 치실과 구강청결제를 활용하세요. 정기적으로 치과 검진을 받는 것이 좋습니다.",
    tips: ["하루 3회 양치", "치실 사용", "정기 치과검진", "칫솔 주기적 교체"],
  },
  {
    id: 11,
    name: "체중 관리",
    image: "https://cdn.news.hidoc.co.kr/news/photo/202103/23834_56892_0832.jpg",
    description: "적정 체중 유지는 만성질환 예방에 핵심입니다.",
    details: "BMI 18.5-23 범위를 유지하는 것이 건강에 좋습니다. 급격한 체중 변화보다는 서서히 조절하세요.",
    tips: ["적정 체중 유지", "규칙적 운동", "균형잡힌 식사", "서서히 조절"],
  },
  {
    id: 12,
    name: "자외선 차단",
    image: "https://m.health.chosun.com/site/data/img_dir/2022/05/06/2022050601365_0.jpg",
    description: "자외선 차단은 피부암과 피부노화를 예방합니다.",
    details:
      "외출 시 자외선 차단제를 바르고, 모자나 양산을 활용하세요. 오전 10시~오후 2시 사이의 강한 햇빛은 피하는 것이 좋습니다.",
    tips: ["자외선 차단제", "모자 착용", "강한 햇빛 피하기", "정기적 재도포"],
  },
  {
    id: 13,
    name: "실내 환기",
    image: "https://cdn.jhealthmedia.joins.com/news/photo/202502/29747_31307_385.jpg",
    description: "실내 환기는 공기질 개선과 감염병 예방에 도움이 됩니다.",
    details: "하루 2-3회, 10분 이상 창문을 열어 환기하세요. 미세먼지가 심한 날은 공기청정기를 활용하세요.",
    tips: ["하루 2-3회 환기", "10분 이상", "공기청정기 활용", "습도 조절"],
  },
  {
    id: 14,
    name: "올바른 자세",
    image: "https://exbody.kr/wp-content/uploads/2023/07/%EC%98%AC%EB%B0%94%EB%A5%B8%EC%9E%90%EC%84%B81.jpg",
    description: "올바른 자세는 근골격계 질환을 예방합니다.",
    details:
      "장시간 앉아있을 때는 허리를 곧게 펴고, 1시간마다 스트레칭을 하세요. 높이 조절이 가능한 의자와 책상을 사용하세요.",
    tips: ["허리 곧게", "주기적 스트레칭", "적정 높이 유지", "장시간 자세 피하기"],
  },
  {
    id: 15,
    name: "수분 섭취",
    image: "https://cdn.100ssd.co.kr/news/photo/202204/86095_66243_375.jpg",
    description: "충분한 수분 섭취는 신진대사와 건강 유지에 필수입니다.",
    details: "하루 1.5-2L의 물을 마시는 것이 좋습니다. 목이 마르기 전에 조금씩 자주 마시세요.",
    tips: ["하루 1.5-2L", "조금씩 자주", "목마름 전 섭취", "카페인 음료 자제"],
  },
];

function PreventionPage() {
  return (
    <div className="prevention-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="prevention-page-container">
        {/* 페이지 헤더 */}
        <div className="prevention-page-header">
          <div className="header-content">
            <h1>질병 예방법</h1>
            <p className="header-subtitle">건강한 생활을 위한 질병 예방 수칙을 확인하세요</p>
          </div>
        </div>

        {/* 예방법 그리드 */}
        <div className="prevention-content">
          <div className="prevention-grid">
            {preventionList.map((prevention) => (
              <div key={prevention.id} className="prevention-card">
                <div className="prevention-image-container">
                  <img src={prevention.image} alt={prevention.name} className="prevention-image" />
                </div>

                <div className="prevention-content-area">
                  <h3 className="prevention-name">{prevention.name}</h3>
                  <p className="prevention-description">{prevention.description}</p>
                  <p className="prevention-details">{prevention.details}</p>

                  <div className="prevention-tips">
                    <div className="tips-title">실천 방법</div>
                    <div className="tips-list">
                      {prevention.tips.map((tip, idx) => (
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

export default PreventionPage;
