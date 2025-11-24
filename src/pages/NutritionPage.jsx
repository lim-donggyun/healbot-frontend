import React from "react";
import "./NutritionPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 영양 가이드 목록
const nutritionList = [
  {
    id: 1,
    name: "단백질",
    image: "https://cdn.esocialtimes.com/news/photo/202401/34403_25551_5830.jpg",
    description: "단백질은 신체 조직을 구성하고 복구하는 필수 영양소입니다.",
    details:
      "성인 기준 체중 1kg당 0.8~1.2g의 단백질 섭취를 권장합니다. 고기, 생선, 달걀, 콩류, 유제품 등에 풍부하게 포함되어 있습니다.",
    tips: ["체중당 적정량 섭취", "동물성·식물성 균형", "매 끼니마다 포함", "운동 후 보충"],
  },
  {
    id: 2,
    name: "탄수화물",
    image:
      "https://img.kr.news.samsung.com/kr/wp-content/uploads/2016/10/%EC%8B%9C%ED%81%AC%EB%A6%BF%EA%B0%80%EB%93%A08%ED%8E%B8_01.jpg",
    description: "탄수화물은 신체의 주요 에너지원입니다.",
    details:
      "전체 열량의 55~65%를 탄수화물로 섭취하는 것이 좋습니다. 현미, 통곡물, 채소 등 복합 탄수화물을 선택하세요.",
    tips: ["복합 탄수화물 선택", "정제 탄수화물 제한", "식이섬유 함께 섭취", "적정량 유지"],
  },
  {
    id: 3,
    name: "지방",
    image:
      "https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/1Q0R/image/E2u2pstFj1Br6iwsxz365H6u9ls.jpg",
    description: "지방은 에너지 공급과 비타민 흡수에 필수적입니다.",
    details: "전체 열량의 15~30%를 지방으로 섭취합니다. 불포화지방산이 풍부한 견과류, 생선, 올리브유를 선택하세요.",
    tips: ["불포화지방 선택", "포화지방 제한", "트랜스지방 피하기", "오메가3 섭취"],
  },
  {
    id: 4,
    name: "비타민 A",
    image: "https://image.dongascience.com/Photo/2017/08/15034560741687.jpg",
    description: "비타민 A는 시력과 면역력 유지에 중요합니다.",
    details: "당근, 고구마, 시금치 등 녹황색 채소에 풍부합니다. 성인 기준 하루 700~900μg 섭취를 권장합니다.",
    tips: ["녹황색 채소 섭취", "적정량 준수", "지용성 비타민", "과다 섭취 주의"],
  },
  {
    id: 5,
    name: "비타민 C",
    image: "https://cdn.kormedi.com/wp-content/uploads/2025/01/a3__20180321_shutterstock_530292781_540.jpg.webp",
    description: "비타민 C는 항산화 작용과 면역력 강화에 도움을 줍니다.",
    details: "감귤류, 키위, 딸기, 브로콜리 등에 풍부합니다. 성인 기준 하루 100mg 섭취를 권장합니다.",
    tips: ["신선한 과일·채소", "열에 약함 주의", "매일 섭취", "흡연자는 더 필요"],
  },
  {
    id: 6,
    name: "비타민 D",
    image: "https://pds.medicaltimes.com/NewsPhoto/202001/1131283_1.jpg",
    description: "비타민 D는 칼슘 흡수와 뼈 건강에 필수적입니다.",
    details: "햇빛 노출과 등푸른 생선, 우유 등으로 섭취합니다. 성인 기준 하루 10~20μg 섭취를 권장합니다.",
    tips: ["적절한 햇빛 노출", "등푸른 생선 섭취", "강화 식품 활용", "보충제 고려"],
  },
  {
    id: 7,
    name: "칼슘",
    image:
      "https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202209/26/8dc966a9-8169-4094-bb86-ab1ae3af0c1a.jpg",
    description: "칼슘은 뼈와 치아를 튼튼하게 유지합니다.",
    details: "우유, 치즈, 요구르트, 멸치, 두부 등에 풍부합니다. 성인 기준 하루 700~800mg 섭취를 권장합니다.",
    tips: ["유제품 섭취", "비타민D와 함께", "꾸준한 섭취", "카페인 과다 주의"],
  },
  {
    id: 8,
    name: "철분",
    image: "https://health.chosun.com/site/data/img_dir/2017/07/06/2017070601198_0.jpg",
    description: "철분은 혈액 생성과 산소 운반에 필수적입니다.",
    details: "붉은 고기, 시금치, 콩류에 풍부합니다. 성인 남성 10mg, 여성 14mg(임신부 24mg) 섭취를 권장합니다.",
    tips: ["비타민C와 함께", "헴철·비헴철 구분", "여성 충분 섭취", "차·커피 간격"],
  },
  {
    id: 9,
    name: "식이섬유",
    image: "https://t1.daumcdn.net/brunch/service/user/2xMI/image/55I6dzm35GTWjgaY5Sl-5CiqEnU.jpg",
    description: "식이섬유는 소화 건강과 혈당 조절에 도움을 줍니다.",
    details: "통곡물, 채소, 과일, 콩류에 풍부합니다. 성인 기준 하루 20~25g 섭취를 권장합니다.",
    tips: ["통곡물 선택", "채소 과일 충분히", "충분한 수분 섭취", "점진적 증량"],
  },
  {
    id: 10,
    name: "오메가3 지방산",
    image: "https://cdn.monews.co.kr/news/photo/201511/87318_19459_3512.JPG",
    description: "오메가3는 심혈관 건강과 뇌 기능 향상에 도움을 줍니다.",
    details: "등푸른 생선(고등어, 연어), 호두, 아마씨 등에 풍부합니다. 주 2~3회 생선 섭취를 권장합니다.",
    tips: ["등푸른 생선 섭취", "견과류 활용", "신선도 유지", "정기적 섭취"],
  },
  {
    id: 11,
    name: "마그네슘",
    image: "https://cdn.imweb.me/upload/S20220925738aaf87f17d0/333a274049008.jpg",
    description: "마그네슘은 근육과 신경 기능, 에너지 생성에 중요합니다.",
    details: "견과류, 씨앗류, 통곡물, 녹색 채소에 풍부합니다. 성인 기준 하루 280~370mg 섭취를 권장합니다.",
    tips: ["견과류 섭취", "통곡물 선택", "녹색 채소", "스트레스 관리"],
  },
  {
    id: 12,
    name: "아연",
    image: "https://www.koreazinc.co.kr/wp-content/uploads/2025/01/brand-story-img_zinc.png",
    description: "아연은 면역 기능과 상처 치유에 필수적입니다.",
    details: "굴, 붉은 고기, 콩류, 견과류에 풍부합니다. 성인 기준 하루 8~11mg 섭취를 권장합니다.",
    tips: ["단백질 식품과 함께", "면역력 강화", "적정량 섭취", "과다 섭취 주의"],
  },
  {
    id: 13,
    name: "칼륨",
    image:
      "https://st5.depositphotos.com/1439888/69416/i/380/depositphotos_694162730-stock-photo-products-containing-potassium-rendering-isolated.jpg",
    description: "칼륨은 혈압 조절과 심장 건강에 중요합니다.",
    details: "바나나, 감자, 토마토, 시금치 등에 풍부합니다. 성인 기준 하루 3,500mg 섭취를 권장합니다.",
    tips: ["채소 과일 섭취", "나트륨 균형", "혈압 관리", "가공식품 제한"],
  },
  {
    id: 14,
    name: "엽산",
    image: "https://cdn.ikunkang.com/news/photo/202102/33303_23668_830.jpg",
    description: "엽산은 세포 분열과 DNA 합성에 필수적입니다.",
    details: "녹색 잎채소, 콩류, 오렌지 등에 풍부합니다. 성인 기준 하루 400μg, 임신부는 600μg 섭취를 권장합니다.",
    tips: ["녹색 채소 섭취", "임신 전부터", "열에 약함 주의", "신선하게 섭취"],
  },
  {
    id: 15,
    name: "수분",
    image: "https://img.vogue.co.kr/vogue/2023/03/pexels-pixabay-416528-930x664.jpg",
    description: "수분은 체온 조절과 영양소 운반에 필수적입니다.",
    details: "하루 1.5~2L의 물 섭취를 권장합니다. 물, 차, 국물 등으로 보충하되 당분이 많은 음료는 피하세요.",
    tips: ["하루 1.5-2L", "조금씩 자주", "운동 시 충분히", "카페인 음료 제한"],
  },
];

function NutritionPage() {
  return (
    <div className="nutrition-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="nutrition-page-container">
        {/* 페이지 헤더 */}
        <div className="nutrition-page-header">
          <div className="header-content">
            <h1>영양 가이드</h1>
            <p className="header-subtitle">건강한 식생활을 위한 필수 영양소 정보를 확인하세요</p>
          </div>
        </div>

        {/* 영양 가이드 그리드 */}
        <div className="nutrition-content">
          <div className="nutrition-grid">
            {nutritionList.map((nutrition) => (
              <div key={nutrition.id} className="nutrition-card">
                <div className="nutrition-image-container">
                  <img src={nutrition.image} alt={nutrition.name} className="nutrition-image" />
                </div>

                <div className="nutrition-content-area">
                  <h3 className="nutrition-name">{nutrition.name}</h3>
                  <p className="nutrition-description">{nutrition.description}</p>
                  <p className="nutrition-details">{nutrition.details}</p>

                  <div className="nutrition-tips">
                    <div className="tips-title">섭취 방법</div>
                    <div className="tips-list">
                      {nutrition.tips.map((tip, idx) => (
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

export default NutritionPage;
