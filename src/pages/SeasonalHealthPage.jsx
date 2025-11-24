import React, { useState } from "react";
import "./SeasonalHealthPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 계절별 건강 정보 목록
const seasonalHealthList = [
  {
    id: 1,
    name: "황사/미세먼지 대처",
    category: "봄",
    image: "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/201503/01/htm_2015030111143670107011.jpg",
    description: "황사와 미세먼지로부터 호흡기를 보호하세요.",
    details:
      "외출 시 마스크를 착용하고, 실내에서는 공기청정기를 사용하세요. 외출 후에는 손과 얼굴을 깨끗이 씻고, 물을 충분히 마셔 체내 노폐물을 배출하세요.",
    tips: ["KF94 마스크 착용", "공기청정기 가동", "물 자주 마시기", "외출 후 세안"],
  },
  {
    id: 2,
    name: "꽃가루 알레르기",
    category: "봄",
    image: "https://src.hidoc.co.kr/image/lib/2022/4/8/1649407308610_0.jpg",
    description: "봄철 꽃가루 알레르기를 예방하고 관리하세요.",
    details:
      "꽃가루가 많이 날리는 오전 시간대 외출을 자제하고, 창문을 닫아두세요. 외출 시 선글라스와 마스크를 착용하고, 귀가 후 샤워로 꽃가루를 제거하세요.",
    tips: ["오전 외출 자제", "창문 닫기", "선글라스 착용", "귀가 후 샤워"],
  },
  {
    id: 3,
    name: "춘곤증 극복",
    category: "봄",
    image:
      "http://hqcenter.snu.ac.kr/hp/wp-content/uploads/%EC%B5%9C%EC%A2%85-%EB%B4%84-12.-%EC%B6%98%EA%B3%A4%EC%A6%9D%EA%B3%BC-%ED%98%BC%EB%8F%99%ED%95%98%EA%B8%B0-%EC%89%AC%EC%9A%B4-%EA%B1%B4%EA%B0%95%EB%AC%B8%EC%A0%9C_%EB%84%A4%EC%9D%B4%EB%B2%84-609x450.png",
    description: "봄철 나른함과 피로를 이겨내세요.",
    details:
      "충분한 수면과 규칙적인 생활리듬을 유지하세요. 가벼운 스트레칭과 산책으로 신진대사를 활발하게 하고, 제철 채소와 과일로 비타민을 보충하세요.",
    tips: ["규칙적인 수면", "가벼운 운동", "비타민 섭취", "스트레칭"],
  },
  {
    id: 4,
    name: "봄철 피부관리",
    category: "봄",
    image: "https://image.dongascience.com/Photo/2025/02/6a152f91599c3d6e0f0b0c99df1b5534.jpg",
    description: "건조하고 민감해진 봄철 피부를 관리하세요.",
    details:
      "자외선 차단제를 꼼꼼히 바르고, 보습제로 수분을 공급하세요. 미세먼지로 인한 피부 트러블을 방지하기 위해 외출 후 깨끗이 세안하세요.",
    tips: ["자외선 차단", "충분한 보습", "깨끗한 세안", "수분 섭취"],
  },
  {
    id: 5,
    name: "냉방병 예방",
    category: "여름",
    image: "https://www.healtip.co.kr/news/photo/202205/3540_9056_4255.jpg",
    description: "과도한 냉방으로 인한 냉방병을 예방하세요.",
    details:
      "실내외 온도차를 5도 이내로 유지하고, 에어컨 바람을 직접 쐬지 마세요. 긴 옷을 준비하고, 1시간마다 환기하며, 충분한 수분을 섭취하세요.",
    tips: ["온도차 5도 이내", "긴 옷 준비", "정기적 환기", "수분 섭취"],
  },
  {
    id: 6,
    name: "식중독 예방",
    category: "여름",
    image: "https://www.korea.kr/newsWeb/resources/temp/images/000242/560.jpg",
    description: "여름철 식중독을 예방하는 방법을 익히세요.",
    details:
      "음식은 충분히 익혀 먹고, 조리 전후 손을 깨끗이 씻으세요. 음식 보관 시 냉장고 온도를 5도 이하로 유지하고, 2시간 이상 실온에 둔 음식은 섭취를 피하세요.",
    tips: ["음식 충분히 익히기", "손 씻기", "냉장 보관", "익힌 음식 먹기"],
  },
  {
    id: 7,
    name: "열사병/일사병 대처",
    category: "여름",
    image: "https://cdn.news.hidoc.co.kr/news/photo/202006/22310_53127_0140.jpg",
    description: "무더운 여름, 열사병과 일사병을 예방하세요.",
    details:
      "한낮 야외활동을 피하고, 충분한 수분을 섭취하세요. 가벼운 옷을 입고 모자를 착용하며, 어지럼증이나 두통이 있으면 즉시 그늘에서 쉬세요.",
    tips: ["한낮 외출 자제", "수분 충분히", "모자 착용", "그늘에서 휴식"],
  },
  {
    id: 8,
    name: "여름철 수면 관리",
    category: "여름",
    image: "https://cdn.lecturernews.com/news/photo/202507/181955_442821_3026.png",
    description: "더운 여름밤, 숙면을 취하는 방법을 알아보세요.",
    details:
      "취침 2시간 전 미지근한 물로 샤워하고, 실내 온도는 26도 정도로 유지하세요. 가볍고 통풍이 잘 되는 침구를 사용하고, 취침 전 수분을 적당히 섭취하세요.",
    tips: ["미지근한 샤워", "적정 실내온도", "통풍 침구", "수분 섭취"],
  },
  {
    id: 9,
    name: "환절기 감기 예방",
    category: "가을",
    image: "https://investpension.miraeasset.com/common/namoeditor/binary/images/000236/1726127169598.jpg",
    description: "일교차가 큰 가을, 감기를 예방하세요.",
    details:
      "외출 시 겉옷을 챙기고, 손을 자주 씻으세요. 충분한 수면과 균형잡힌 식사로 면역력을 높이고, 실내 습도를 적정하게 유지하세요.",
    tips: ["겉옷 준비", "손 씻기", "충분한 수면", "실내 습도 유지"],
  },
  {
    id: 10,
    name: "독감 예방접종",
    category: "가을",
    image: "https://cdn.jhealthmedia.joins.com/news/photo/202502/29696_31254_3236.jpg",
    description: "독감 유행 전 예방접종을 받으세요.",
    details:
      "매년 9~11월 독감 예방접종을 받으세요. 특히 65세 이상 노인, 만성질환자, 임신부는 필수 접종 대상입니다. 접종 후 2주 정도 지나면 항체가 형성됩니다.",
    tips: ["9~11월 접종", "고위험군 필수", "매년 접종", "접종 후 휴식"],
  },
  {
    id: 11,
    name: "가을 건조함 관리",
    category: "가을",
    image: "https://cdn.thinkdoctor.co.kr/news/photo/202011/6774_12010_162.jpg",
    description: "건조한 가을 날씨에 피부와 호흡기를 보호하세요.",
    details:
      "하루 1.5~2L 물을 마시고, 보습제를 자주 바르세요. 실내 습도를 40~60%로 유지하고, 가습기를 사용하되 청결하게 관리하세요.",
    tips: ["충분한 수분", "보습제 사용", "적정 습도", "가습기 관리"],
  },
  {
    id: 13,
    name: "동상 예방",
    category: "겨울",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Frostbitten_hands.jpg",
    description: "추운 겨울, 동상을 예방하고 대처하세요.",
    details:
      "장갑, 목도리, 모자로 노출 부위를 최소화하세요. 젖은 옷은 즉시 갈아입고, 꽉 끼는 옷이나 신발은 피하세요. 동상 증상 시 따뜻한 물(40도)에 담그세요.",
    tips: ["보온 장구 착용", "젖은 옷 교체", "여유있는 옷", "따뜻한 물 처치"],
  },
  {
    id: 14,
    name: "저체온증 예방",
    category: "겨울",
    image: "https://d2m9duoqjhyhsq.cloudfront.net/marketingContents/article/article693-01.jpg",
    description: "추위로 인한 저체온증을 예방하세요.",
    details:
      "외출 시 여러 겹 옷을 입고, 따뜻한 음료를 자주 마시세요. 장시간 추운 곳에 있지 말고, 체온이 떨어지면 즉시 따뜻한 곳으로 이동하세요.",
    tips: ["여러 겹 옷", "따뜻한 음료", "장시간 노출 피하기", "체온 유지"],
  },
  {
    id: 15,
    name: "겨울철 낙상 주의",
    category: "겨울",
    image: "https://www.gwhospital.co.kr/_upfiles/board/column/thumb/20240111_96246464b11ca8bf0fc9041503f96e.jpg",
    description: "빙판길 낙상 사고를 예방하세요.",
    details:
      "미끄럼 방지 신발을 착용하고, 보폭을 좁게 천천히 걸으세요. 주머니에 손을 넣지 말고, 낙상 시 옆으로 구르듯 넘어지세요. 노약자는 지팡이를 사용하세요.",
    tips: ["미끄럼방지 신발", "짧은 보폭", "손 밖으로", "지팡이 사용"],
  },
  {
    id: 16,
    name: "노로바이러스 예방",
    category: "겨울",
    image: "https://www.korea.kr/newsWeb/resources/temp/images/000228/560.jpg",
    description: "겨울철 유행하는 노로바이러스를 예방하세요.",
    details:
      "손을 자주 씻고, 음식은 충분히 익혀 먹으세요. 특히 굴 등 해산물은 85도 이상에서 1분 이상 가열하세요. 환자와 접촉을 피하고, 공용 물품 사용에 주의하세요.",
    tips: ["손 씻기 철저", "음식 익혀먹기", "해산물 가열", "공용품 주의"],
  },
];

function SeasonalHealthPage() {
  const [selectedCategory, setSelectedCategory] = useState("봄");

  // 카테고리별 필터링
  const categories = ["봄", "여름", "가을", "겨울"];

  const filteredHealth = seasonalHealthList.filter((item) => item.category === selectedCategory);

  return (
    <div className="seasonal-health-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="seasonal-health-page-container">
        {/* 페이지 헤더 */}
        <div className="seasonal-page-header">
          <div className="header-content">
            <h1>계절 건강</h1>
            <p className="header-subtitle">계절별 건강 관리 방법을 확인하세요</p>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="category-filter-section">
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 계절 건강 그리드 */}
        <div className="seasonal-health-content">
          <div className="seasonal-health-grid">
            {filteredHealth.map((item) => (
              <div key={item.id} className="seasonal-health-card">
                <div className="seasonal-health-image-container">
                  <img src={item.image} alt={item.name} className="seasonal-health-image" />
                </div>

                <div className="seasonal-health-content-area">
                  <h3 className="seasonal-health-name">{item.name}</h3>
                  <p className="seasonal-health-description">{item.description}</p>
                  <p className="seasonal-health-details">{item.details}</p>

                  <div className="seasonal-health-tips">
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

export default SeasonalHealthPage;
