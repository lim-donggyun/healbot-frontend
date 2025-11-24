import React from "react";
import "./HealthCheckupPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 건강 검진 가이드 목록
const healthCheckupList = [
  {
    id: 1,
    name: "국가건강검진 (일반)",
    image: "http://www.nursenews.co.kr/pds_update/img_20250826140620.jpg",
    description: "만 20세 이상 지역가입자 및 피부양자가 받는 기본 건강검진입니다.",
    details:
      "2년마다 실시하며 문진표, 신체계측, 혈압측정, 시력·청력검사, 흉부방사선, 혈액검사, 요검사를 포함합니다. 고혈압, 당뇨병, 신장질환 등의 조기 발견을 목표로 합니다.",
    tips: ["2년 주기", "무료 검진", "만 20세 이상", "조기 발견"],
  },
  {
    id: 2,
    name: "암 검진",
    image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/3CDC/production/_103208551_gettyimages-888730408.jpg.webp",
    description: "6대 암(위암, 대장암, 간암, 유방암, 자궁경부암, 폐암)을 조기 발견합니다.",
    details:
      "연령과 성별에 따라 검진 항목이 다릅니다. 위암(만 40세 이상, 2년), 대장암(만 50세 이상, 1년), 간암(만 40세 이상 고위험군, 6개월), 유방암(만 40세 이상 여성, 2년), 자궁경부암(만 20세 이상 여성, 2년), 폐암(만 54~74세 고위험군, 2년)입니다.",
    tips: ["연령별 검진", "조기 발견 중요", "정기 검사", "무료 또는 저비용"],
  },
  {
    id: 3,
    name: "종합건강검진",
    image: "https://www.dcmc.co.kr/data/board/board_32/%EC%A2%85%EA%B2%80.png",
    description: "보다 정밀한 검사를 통해 전반적인 건강 상태를 확인합니다.",
    details:
      "일반 건강검진보다 더 많은 항목을 검사합니다. CT, MRI, 초음파, 내시경, 심장검사, 골밀도검사 등을 포함하며, 개인의 가족력과 생활습관에 따라 맞춤형으로 구성할 수 있습니다.",
    tips: ["정밀 검사", "맞춤형 구성", "연 1회 권장", "가족력 고려"],
  },
  {
    id: 4,
    name: "위내시경 검사",
    image: "https://cdn.news.hidoc.co.kr/news/photo/202507/50043_83598_4617.jpg",
    description: "위암과 위장 질환을 조기에 발견하는 필수 검사입니다.",
    details:
      "만 40세 이상은 2년마다 받는 것이 좋습니다. 검사 전 8시간 이상 금식이 필요하며, 수면내시경 선택 시 검사 후 운전을 피해야 합니다. 위암, 위염, 위궤양 등을 진단할 수 있습니다.",
    tips: ["만 40세 이상", "2년 주기", "8시간 금식", "수면 옵션"],
  },
  {
    id: 5,
    name: "대장내시경 검사",
    image: "https://www.snuh.org/upload/health/nMedInfo/986.jpg",
    description: "대장암과 대장 질환을 조기에 발견합니다.",
    details:
      "만 50세 이상은 5~10년마다 권장됩니다. 검사 전날 식이 조절과 장 정결제 복용이 필요합니다. 대장암, 대장용종, 염증성 장질환 등을 진단하며, 용종 발견 시 즉시 제거할 수 있습니다.",
    tips: ["만 50세 이상", "5~10년 주기", "전날 장 정결", "용종 제거"],
  },
  {
    id: 6,
    name: "심장 검진",
    image: "https://www.kyuh.ac.kr/images/main/sub01/sub0702_img01.png",
    description: "심혈관 질환의 위험을 평가하고 조기 발견합니다.",
    details:
      "심전도, 심장초음파, 운동부하검사, 관상동맥 CT 등을 포함합니다. 고혈압, 당뇨, 고지혈증이 있거나 가족력이 있는 경우 정기적으로 받는 것이 좋습니다.",
    tips: ["심전도 검사", "초음파", "가족력 고려", "정기 검진"],
  },
  {
    id: 7,
    name: "뇌 검진 (뇌MRI/MRA)",
    image: "https://cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/ZNK3SI5CI5EWXIN2DCSRLLRTV4.jpg",
    description: "뇌졸중, 뇌종양 등 뇌 질환을 조기에 발견합니다.",
    details:
      "두통, 어지럼증이 잦거나 가족력이 있는 경우 권장됩니다. 뇌MRI로 뇌 구조 이상을, 뇌MRA로 뇌혈관 이상을 확인합니다. 40세 이후 5~10년마다 권장됩니다.",
    tips: ["뇌MRI/MRA", "40세 이후", "가족력 중요", "5~10년 주기"],
  },
  {
    id: 8,
    name: "폐 검진 (폐CT)",
    image: "https://www.snubh.org/upload/ce3/namoimage/images/000077/202203_03_img_02.png",
    description: "폐암과 폐질환을 조기에 발견합니다.",
    details:
      "만 54~74세 고위험군(30갑년 이상 흡연력)은 2년마다 저선량 흉부CT를 권장합니다. 폐암, 폐기종, 간질성 폐질환 등을 진단할 수 있습니다.",
    tips: ["저선량 CT", "흡연자 필수", "만 54~74세", "2년 주기"],
  },
  {
    id: 9,
    name: "간 검진 (간초음파)",
    image: "https://cdn.news.hidoc.co.kr/news/photo/202301/29218_69963_0527.jpg",
    description: "간암, 간경화 등 간 질환을 조기에 발견합니다.",
    details:
      "B형·C형 간염 보유자, 간경화 환자는 6개월마다 간초음파와 혈액검사(AFP)를 받아야 합니다. 음주를 자주 하거나 지방간이 있는 경우에도 정기 검진이 필요합니다.",
    tips: ["간초음파", "AFP 검사", "고위험군 6개월", "음주자 주의"],
  },
  {
    id: 10,
    name: "유방암 검진",
    image:
      "https://www.chosun.com/resizer/v2/MSJEMQIOGZCHFDMV3W2VZA5JQY.jpg?auth=a43d27f381f752534ef09bb02ef39ee4e6f04d3bcda676d65592807a5812f6ce&width=616",
    description: "여성의 유방암을 조기에 발견합니다.",
    details:
      "만 40세 이상 여성은 2년마다 유방촬영(맘모그래피)을 받습니다. 가족력이 있거나 고위험군은 유방초음파나 MRI를 추가로 받을 수 있습니다. 자가검진도 매월 시행하는 것이 좋습니다.",
    tips: ["만 40세 이상", "2년 주기", "맘모그래피", "자가검진"],
  },
  {
    id: 11,
    name: "자궁경부암 검진",
    image: "https://cdn.imweb.me/upload/S202105138787718073f1b/a9464ff5d7797.png",
    description: "여성의 자궁경부암을 조기에 발견합니다.",
    details:
      "만 20세 이상 여성은 2년마다 자궁경부 세포검사(팹스미어)를 받습니다. HPV 백신 접종을 받았더라도 정기 검진은 필수입니다. 이상 소견 시 조직검사를 추가로 받습니다.",
    tips: ["만 20세 이상", "2년 주기", "팹스미어", "HPV 검사"],
  },
  {
    id: 12,
    name: "전립선암 검진",
    image: "https://snuh.org/upload/health/nMedInfo/20190221_2130_341.jpg",
    description: "남성의 전립선암을 조기에 발견합니다.",
    details:
      "만 50세 이상 남성은 PSA 혈액검사를 연 1회 받는 것이 좋습니다. 가족력이 있는 경우 만 40세부터 시작합니다. PSA 수치가 높으면 전립선 초음파나 조직검사를 추가로 받습니다.",
    tips: ["만 50세 이상", "PSA 검사", "연 1회", "가족력 40세"],
  },
  {
    id: 13,
    name: "골밀도 검사",
    image: "https://img.sbs.co.kr/newimg/news/20230706/201804382_1280.jpg",
    description: "골다공증을 조기에 발견하고 예방합니다.",
    details:
      "만 54세 이상 여성, 만 66세 이상 남성에게 권장됩니다. 폐경 여성, 저체중, 골절 경험이 있는 경우 더 일찍 검사합니다. DXA 검사로 골밀도를 측정하며, 2년마다 재검사합니다.",
    tips: ["폐경 여성", "만 54세 이상", "DXA 검사", "2년 주기"],
  },
  {
    id: 14,
    name: "갑상선 검진",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Cx7-3VDbrsDaHqeUKiJMb9ySidDCRAj_Gg&s",
    description: "갑상선 질환을 조기에 발견합니다.",
    details:
      "갑상선 기능 혈액검사(TSH, T3, T4)와 갑상선 초음파로 검사합니다. 가족력이 있거나 목 부위에 혹이 만져지는 경우 검진을 받아야 합니다. 갑상선 기능 항진증, 저하증, 결절, 암을 진단합니다.",
    tips: ["혈액검사", "초음파", "가족력", "결절 확인"],
  },
  {
    id: 15,
    name: "눈 검진 (안저검사)",
    image: "https://cdn.rehabnews.net/news/photo/202507/24028_18111_5649.jpg",
    description: "실명을 유발할 수 있는 안과 질환을 조기에 발견합니다.",
    details:
      "당뇨병, 고혈압 환자는 연 1회 안저검사를 받아야 합니다. 40세 이상은 2년마다 녹내장 검사를 권장하며, 시력저하나 눈의 불편함이 있으면 즉시 검사를 받습니다.",
    tips: ["당뇨·고혈압", "안저검사", "녹내장 검사", "40세 이상"],
  },
];

function HealthCheckupPage() {
  return (
    <div className="health-checkup-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="health-checkup-page-container">
        {/* 페이지 헤더 */}
        <div className="health-checkup-page-header">
          <div className="header-content">
            <h1>건강 검진 가이드</h1>
            <p className="header-subtitle">연령별, 성별에 맞는 건강검진 정보를 확인하세요</p>
          </div>
        </div>

        {/* 건강 검진 그리드 */}
        <div className="health-checkup-content">
          <div className="health-checkup-grid">
            {healthCheckupList.map((item) => (
              <div key={item.id} className="health-checkup-card">
                <div className="health-checkup-image-container">
                  <img src={item.image} alt={item.name} className="health-checkup-image" />
                </div>

                <div className="health-checkup-content-area">
                  <h3 className="health-checkup-name">{item.name}</h3>
                  <p className="health-checkup-description">{item.description}</p>
                  <p className="health-checkup-details">{item.details}</p>

                  <div className="health-checkup-tips">
                    <div className="tips-title">검진 포인트</div>
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

export default HealthCheckupPage;
