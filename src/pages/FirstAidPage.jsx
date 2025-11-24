import React from "react";
import "./FirstAidPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 응급 처치법 목록
const firstAidList = [
  {
    id: 1,
    name: "심폐소생술 (CPR)",
    image: "https://img.seoul.co.kr/img/upload/2022/11/01/SSI_20221101152502_O2.jpg",
    description: "심정지 환자를 살리는 가장 중요한 응급처치입니다.",
    details:
      "119에 신고 후 가슴 압박을 시작하세요. 양손을 깍지 끼고 가슴 중앙을 강하고 빠르게 압박합니다. 분당 100~120회 속도로 최소 5cm 깊이로 압박하며, 구조대가 올 때까지 계속합니다.",
    tips: ["119 신고", "가슴 중앙 압박", "분당 100~120회", "깊이 5cm 이상"],
  },
  {
    id: 2,
    name: "기도 폐쇄 (하임리히법)",
    image: "https://m.health.chosun.com/site/data/img_dir/2022/06/21/2022062101520_0.jpg",
    description: "음식물이나 이물질로 기도가 막혔을 때 시행합니다.",
    details:
      "환자 뒤에서 양팔로 감싸 안고, 주먹을 명치와 배꼽 사이에 대고 다른 손으로 감싼 후 강하게 위쪽으로 밀어 올립니다. 이물질이 나올 때까지 반복합니다.",
    tips: ["환자 뒤에서", "명치-배꼽 사이", "강하게 압박", "이물질 제거까지"],
  },
  {
    id: 3,
    name: "출혈 응급처치",
    image: "https://pros-blog.padi.com/wp-content/uploads/2020/02/DAN_Touniquet1-1024x890.jpg",
    description: "과다 출혈을 막고 쇼크를 예방합니다.",
    details:
      "깨끗한 천이나 거즈로 상처를 직접 압박합니다. 출혈이 멈추지 않으면 압박을 유지하며 상처 부위를 심장보다 높게 올립니다. 지혈대는 최후의 수단으로만 사용합니다.",
    tips: ["직접 압박", "심장보다 높이", "압박 유지", "119 신고"],
  },
  {
    id: 4,
    name: "화상 응급처치",
    image: "https://kormedi.com/wp-content/uploads/2022/03/ed9994ec8381-ecb0acebacbc-20ebb684-580x387.jpg",
    description: "화상 부위를 신속히 냉각하고 감염을 예방합니다.",
    details:
      "화상 부위를 흐르는 찬물에 10~20분간 식힙니다. 물집은 터트리지 말고, 깨끗한 천으로 덮습니다. 얼음을 직접 대지 말고, 심한 화상은 즉시 병원으로 이송합니다.",
    tips: ["찬물로 냉각", "물집 보호", "깨끗한 천", "심한 경우 병원"],
  },
  {
    id: 5,
    name: "골절 응급처치",
    image:
      "https://previews.123rf.com/images/hooyah808/hooyah8081906/hooyah808190600020/126262620-first-aid-training-fracture-left-arm-apply-by-cloth.jpg",
    description: "골절 부위를 고정하고 추가 손상을 방지합니다.",
    details:
      "골절 부위를 움직이지 말고, 부목이나 단단한 물건으로 고정합니다. 골절 부위 위아래 관절까지 함께 고정하고, 붓기를 줄이기 위해 심장보다 높게 올립니다.",
    tips: ["움직이지 않기", "부목 고정", "위아래 관절 포함", "높게 올리기"],
  },
  {
    id: 6,
    name: "쇼크 응급처치",
    image: "https://www.hadong.go.kr/_res/health/img/sub/08_12_07.gif",
    description: "쇼크 상태의 환자를 안정시킵니다.",
    details:
      "환자를 눕히고 다리를 20~30cm 높게 올립니다. 체온을 유지하기 위해 담요로 덮어주고, 의식이 있어도 음식이나 물을 주지 않습니다. 즉시 119에 신고합니다.",
    tips: ["환자 눕히기", "다리 높이기", "체온 유지", "음식물 금지"],
  },
  {
    id: 7,
    name: "열사병 응급처치",
    image: "https://www.shutterstock.com/image-vector/first-aid-heat-sun-stroke-260nw-2493185365.jpg",
    description: "고온으로 인한 체온 상승을 신속히 낮춥니다.",
    details:
      "즉시 시원한 곳으로 이동시키고 옷을 느슨하게 합니다. 젖은 수건으로 몸을 닦고, 부채질하여 체온을 낮춥니다. 의식이 있으면 시원한 물을 마시게 하고, 즉시 119에 신고합니다.",
    tips: ["시원한 곳 이동", "옷 느슨하게", "젖은 수건", "체온 낮추기"],
  },
  {
    id: 8,
    name: "저체온증 응급처치",
    image:
      "https://mblogthumb-phinf.pstatic.net/MjAxODEyMjFfMTk4/MDAxNTQ1MzIxNDkwMTE3.0KSjaMhH3BSaTUP5a8VP8el0zEr1os35qR-qwX9qoOsg.XMemtNsFkiJwctwhJ2NBj0QJS89M1qABMdHxJhmOsQog.PNG.nkblog2014/4.png?type=w800",
    description: "낮아진 체온을 서서히 올립니다.",
    details:
      "따뜻한 실내로 이동시키고 젖은 옷을 벗깁니다. 담요나 두꺼운 옷으로 몸을 감싸고, 따뜻한 음료를 마시게 합니다. 급격한 가온은 위험하므로 서서히 체온을 올립니다.",
    tips: ["실내 이동", "젖은 옷 제거", "담요로 보온", "서서히 가온"],
  },
  {
    id: 9,
    name: "뱀 물림 응급처치",
    image: "https://image.ytn.co.kr/general/jpg/2023/1018/202310181505025848_t.jpg",
    description: "독의 확산을 최소화하고 신속히 병원으로 이송합니다.",
    details:
      "환자를 안정시키고 물린 부위를 심장보다 낮게 유지합니다. 물린 부위를 씻고, 팔찌나 반지를 제거합니다. 독을 빨아내거나 칼로 째지 말고, 즉시 병원으로 이송합니다.",
    tips: ["환자 안정", "부위 낮게", "장신구 제거", "즉시 병원"],
  },
  {
    id: 10,
    name: "익수 응급처치",
    image: "https://www.busan.com/nas/data/content/image/2010/08/16/20100816000129_1.jpg",
    description: "물에 빠진 사람을 구조하고 호흡을 회복시킵니다.",
    details:
      "안전하게 물 밖으로 구조한 후 의식과 호흡을 확인합니다. 호흡이 없으면 즉시 심폐소생술을 시작하고, 119에 신고합니다. 물을 토해내려 하지 말고 심폐소생술에 집중합니다.",
    tips: ["안전 구조", "의식 확인", "심폐소생술", "119 신고"],
  },
  {
    id: 11,
    name: "경련 응급처치",
    image: "https://cdn.gnynews.co.kr/news/photo/200608/9193_3006_0000.jpg",
    description: "경련 중 환자의 안전을 확보하고 부상을 예방합니다.",
    details:
      "환자 주변의 위험한 물건을 치우고, 머리 밑에 부드러운 것을 받칩니다. 경련을 억제하려 하지 말고, 입에 아무것도 넣지 마세요. 경련이 끝난 후 옆으로 눕혀 기도를 확보합니다.",
    tips: ["주변 정리", "머리 보호", "억제 금지", "옆으로 눕히기"],
  },
  {
    id: 12,
    name: "알레르기 쇼크 (아나필락시스)",
    image: "https://cdn.kormedi.com/wp-content/uploads/2022/02/220203_02_02-580x387.jpg",
    description: "심각한 알레르기 반응에 신속히 대응합니다.",
    details:
      "즉시 119에 신고하고, 에피네프린 자가주사기가 있으면 사용합니다. 환자를 눕히고 다리를 높게 올립니다. 호흡곤란 시 앉힌 자세를 유지하고, 구토 시 옆으로 눕힙니다.",
    tips: ["즉시 119", "에피네프린", "다리 높이기", "기도 확보"],
  },
  {
    id: 13,
    name: "독극물 중독",
    image:
      "https://media.slidesgo.com/storage/39267853/responsive-images/0-poison-intoxication-case-report___media_library_original_548_308.jpg",
    description: "독극물 섭취 시 신속한 조치로 피해를 최소화합니다.",
    details:
      "중독물질을 확인하고 119 및 중독 정보센터(1339)에 신고합니다. 의식이 있으면 물을 마시게 하고, 억지로 토하게 하지 않습니다. 용기나 라벨을 가지고 병원으로 이동합니다.",
    tips: ["물질 확인", "1339 신고", "토하게 하지 않기", "용기 지참"],
  },
  {
    id: 14,
    name: "코피 응급처치",
    image: "https://d2m9duoqjhyhsq.cloudfront.net/marketingContents/article/article558-01.jpg",
    description: "코피를 효과적으로 멈추고 재발을 방지합니다.",
    details:
      "고개를 앞으로 숙이고 코를 엄지와 검지로 10~15분간 압박합니다. 입으로 호흡하며, 목 뒤를 치거나 누우면 안 됩니다. 얼음찜질로 코 주변을 식히면 도움이 됩니다.",
    tips: ["고개 앞으로", "코 압박 10분", "입으로 호흡", "얼음찜질"],
  },
  {
    id: 15,
    name: "벌레 물림 (벌침)",
    image:
      "https://mblogthumb-phinf.pstatic.net/MjAyNTA0MTVfNTYg/MDAxNzQ0NzEzOTUzMDky.Efl0SWWEJG-ctNMoOBZSK8PrsCLjTHjlzqTG360kkkEg.eYWt62rPaMhx_L3B9KvroXjIfDtYJJnWvn5sDHfLH90g.JPEG/image.JPEG?type=w800",
    description: "벌침을 제거하고 알레르기 반응을 관찰합니다.",
    details:
      "카드나 손톱으로 벌침을 긁어내듯 제거합니다. 핀셋으로 잡으면 독주머니가 터질 수 있습니다. 비누와 물로 씻고 얼음찜질합니다. 호흡곤란이나 두드러기 발생 시 즉시 119에 신고합니다.",
    tips: ["벌침 긁어내기", "비누로 세척", "얼음찜질", "알레르기 주의"],
  },
];

function FirstAidPage() {
  return (
    <div className="first-aid-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="first-aid-page-container">
        {/* 페이지 헤더 */}
        <div className="first-aid-page-header">
          <div className="header-content">
            <h1>응급 처치법</h1>
            <p className="header-subtitle">위급한 상황에서 생명을 구하는 응급처치 방법을 익히세요</p>
          </div>
        </div>

        {/* 응급 처치법 그리드 */}
        <div className="first-aid-content">
          <div className="first-aid-grid">
            {firstAidList.map((item) => (
              <div key={item.id} className="first-aid-card">
                <div className="first-aid-image-container">
                  <img src={item.image} alt={item.name} className="first-aid-image" />
                </div>

                <div className="first-aid-content-area">
                  <h3 className="first-aid-name">{item.name}</h3>
                  <p className="first-aid-description">{item.description}</p>
                  <p className="first-aid-details">{item.details}</p>

                  <div className="first-aid-tips">
                    <div className="tips-title">주요 단계</div>
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

export default FirstAidPage;
