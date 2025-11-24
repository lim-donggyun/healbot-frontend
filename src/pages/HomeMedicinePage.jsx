import React from "react";
import "./HomeMedicinePage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 가정 상비약 목록
const homeMedicineList = [
  {
    id: 1,
    name: "해열진통제",
    image: "https://news.kbs.co.kr/data/news/2021/06/23/20210623_tj8Izz.jpg",
    description: "발열과 통증을 완화하는 필수 상비약입니다.",
    details:
      "아세트아미노펜, 이부프로펜 등이 대표적입니다. 두통, 치통, 생리통, 발열 시 복용합니다. 4~6시간 간격으로 복용하며, 과다 복용 시 간 손상 위험이 있으니 1일 최대 용량을 지켜야 합니다.",
    tips: ["두통·발열", "4~6시간 간격", "과다 복용 주의", "공복 피하기"],
  },
  {
    id: 2,
    name: "소화제",
    image: "https://cdn.jhealthmedia.joins.com/news/photo/201710/18791_13100_1725.jpg",
    description: "소화불량, 복부팽만감을 완화합니다.",
    details:
      "과식, 소화불량, 더부룩함, 속쓰림 시 복용합니다. 식후에 복용하는 것이 효과적이며, 증상이 지속되거나 심해지면 병원을 방문해야 합니다. 유산균 제제도 함께 구비하면 좋습니다.",
    tips: ["식후 복용", "소화불량", "복부팽만", "유산균 병용"],
  },
  {
    id: 3,
    name: "지사제",
    image: "https://img.khan.co.kr/news/2014/10/30/khan_k447Aw.webp",
    description: "설사 증상을 빠르게 완화합니다.",
    details:
      "급성 설사 시 복용하며, 탈수를 방지하기 위해 충분한 수분 섭취가 필요합니다. 고열이나 혈변이 동반되면 즉시 병원을 방문해야 합니다. 이온음료나 경구수액도 함께 준비하면 좋습니다.",
    tips: ["급성 설사", "충분한 수분", "혈변 시 병원", "이온음료 준비"],
  },
  {
    id: 4,
    name: "변비약",
    image: "https://www.mdon.co.kr/data/photos/20141148/art_1416971224.jpg",
    description: "변비 증상을 완화하고 배변을 돕습니다.",
    details:
      "경미한 변비 시 복용하며, 충분한 물과 함께 복용합니다. 장기 복용은 피하고, 식이섬유 섭취와 운동을 병행해야 합니다. 복통이나 구토가 동반되면 복용을 중단하고 병원을 방문합니다.",
    tips: ["충분한 수분", "단기 사용", "식이섬유", "운동 병행"],
  },
  {
    id: 5,
    name: "감기약",
    image:
      "https://i.namu.wiki/i/RHNDGlhmPq5-hiEJDssyRKuRos7GEqxCqO-c-vpcoUnPJt-GNoFPKVYchUM2_GxIzjVV9GD7Ilw3TdqsASL8yA.webp",
    description: "감기 증상(콧물, 기침, 인후통)을 완화합니다.",
    details:
      "종합감기약은 여러 증상을 동시에 완화합니다. 졸음을 유발할 수 있어 운전이나 기계 조작 전 주의가 필요합니다. 3~4일 복용 후에도 증상이 지속되면 병원을 방문해야 합니다.",
    tips: ["증상별 선택", "졸음 주의", "3~4일 후 병원", "수분 섭취"],
  },
  {
    id: 6,
    name: "진해거담제",
    image: "https://cdn.medipana.com/news/photo/202311/319623_1_60.jpg",
    description: "기침을 멈추고 가래를 배출하는 데 도움을 줍니다.",
    details:
      "마른 기침에는 진해제, 가래가 있는 기침에는 거담제를 사용합니다. 충분한 수분 섭취가 중요하며, 기침이 2주 이상 지속되거나 혈담이 나오면 즉시 병원을 방문해야 합니다.",
    tips: ["증상 구분", "수분 섭취", "2주 이상 시 병원", "혈담 주의"],
  },
  {
    id: 7,
    name: "항히스타민제 (알레르기약)",
    image: "https://www.clarityne.co.kr/sites/g/files/vrxlpx49521/files/2020-12/Image_03%402x_0.png",
    description: "알레르기 증상(두드러기, 가려움, 콧물)을 완화합니다.",
    details:
      "꽃가루, 먼지, 음식 알레르기 등으로 인한 증상에 사용합니다. 졸음을 유발할 수 있어 운전 시 주의가 필요합니다. 최근에는 졸리지 않는 2세대 항히스타민제도 있습니다.",
    tips: ["알레르기 증상", "졸음 주의", "2세대 약물", "예방 복용 가능"],
  },
  {
    id: 8,
    name: "제산제",
    image: "https://www.medigatenews.com/file/news/156715",
    description: "속쓰림, 위산과다를 빠르게 완화합니다.",
    details:
      "위산 분비를 억제하거나 중화시킵니다. 식사 후 속쓰림이 있을 때 복용하며, 제산제와 다른 약물 복용 사이에는 1~2시간 간격을 두어야 합니다. 증상이 계속되면 위염이나 위궤양 가능성이 있으니 검사가 필요합니다.",
    tips: ["속쓰림", "위산과다", "약물 간격", "지속 시 검사"],
  },
  {
    id: 9,
    name: "연고류 (항생제·스테로이드)",
    image: "https://m.health.chosun.com/site/data/img_dir/2016/10/04/2016100402089_0.jpg",
    description: "상처, 화상, 피부염을 치료합니다.",
    details:
      "항생제 연고는 상처 감염 예방에, 스테로이드 연고는 염증성 피부질환에 사용합니다. 깨끗이 세척 후 얇게 바르며, 스테로이드는 장기간 사용을 피해야 합니다. 얼굴에는 약한 강도의 연고를 사용합니다.",
    tips: ["상처 세척 후", "얇게 도포", "장기 사용 금지", "강도 구분"],
  },
  {
    id: 10,
    name: "안약",
    image: "https://m.health.chosun.com/site/data/img_dir/2021/02/08/2021020802205_0.jpg",
    description: "눈의 피로, 건조함, 충혈을 완화합니다.",
    details:
      "인공눈물은 안구건조증에, 항히스타민 안약은 알레르기성 결막염에 사용합니다. 개봉 후 1개월 이내 사용하며, 2종 이상 사용 시 5분 간격을 두어야 합니다. 렌즈 착용 시 전용 제품을 사용합니다.",
    tips: ["개봉 후 1개월", "5분 간격", "렌즈용 구분", "청결 유지"],
  },
  {
    id: 11,
    name: "밴드·거즈·소독약",
    image:
      "https://img1.kakaocdn.net/thumb/P750x750@1.5x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fshoppingstore%2Fproduct%2F20240411134018_5f3d9047fd38499a9ddadf03e0cc4dce.png",
    description: "상처 치료와 감염 예방에 필수적입니다.",
    details:
      "크기별 밴드, 거즈, 붕대, 소독약(포비돈 요오드), 생리식염수를 구비합니다. 상처는 깨끗한 물이나 생리식염수로 씻은 후 소독약을 바르고 밴드나 거즈로 보호합니다. 습윤밴드는 빠른 회복에 도움이 됩니다.",
    tips: ["다양한 크기", "생리식염수", "소독 후 보호", "습윤밴드"],
  },
  {
    id: 12,
    name: "파스·근육이완제",
    image: "https://m.health.chosun.com/site/data/img_dir/2021/02/26/2021022602265_0.jpg",
    description: "근육통, 타박상, 염좌를 완화합니다.",
    details:
      "온찜질용 파스는 만성 통증에, 냉찜질용은 급성 염좌나 타박상에 사용합니다. 먹는 근육이완제는 경직된 근육을 풀어주며, 졸음을 유발할 수 있습니다. 피부가 약한 사람은 파스 사용 시 주의가 필요합니다.",
    tips: ["온·냉 구분", "급성·만성", "졸음 주의", "피부 자극"],
  },
  {
    id: 13,
    name: "체온계",
    image: "https://m.health.chosun.com/site/data/img_dir/2015/10/26/2015102602838_0.jpg",
    description: "발열 여부를 정확히 확인합니다.",
    details:
      "귀 체온계, 이마 체온계, 겨드랑이 체온계 등이 있습니다. 정상 체온은 36.5~37.5도이며, 37.5도 이상이면 미열, 38도 이상이면 고열입니다. 영유아의 경우 체온 측정이 매우 중요합니다.",
    tips: ["정상 36.5~37.5도", "38도 이상 고열", "영유아 필수", "정기 교체"],
  },
];

function HomeMedicinePage() {
  return (
    <div className="home-medicine-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="home-medicine-page-container">
        {/* 페이지 헤더 */}
        <div className="home-medicine-page-header">
          <div className="header-content">
            <h1>가정 상비약</h1>
            <p className="header-subtitle">가정에 꼭 필요한 의약품과 의료기기를 확인하세요</p>
          </div>
        </div>

        {/* 가정 상비약 그리드 */}
        <div className="home-medicine-content">
          <div className="home-medicine-grid">
            {homeMedicineList.map((item) => (
              <div key={item.id} className="home-medicine-card">
                <div className="home-medicine-image-container">
                  <img src={item.image} alt={item.name} className="home-medicine-image" />
                </div>

                <div className="home-medicine-content-area">
                  <h3 className="home-medicine-name">{item.name}</h3>
                  <p className="home-medicine-description">{item.description}</p>
                  <p className="home-medicine-details">{item.details}</p>

                  <div className="home-medicine-tips">
                    <div className="tips-title">사용 포인트</div>
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

export default HomeMedicinePage;
