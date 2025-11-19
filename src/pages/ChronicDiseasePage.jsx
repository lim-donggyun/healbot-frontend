import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChronicDiseasePage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";

// 만성질환 하드코딩 데이터
const chronicDiseases = [
  {
    id: 1,
    name: "고혈압(Essential (primary) hypertension)",
    category: "심혈관계",
    department: "가정의학과, 내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EA%B3%A0%ED%98%88%EC%95%95Essential_primary_hypertension_c25cf501.do",
    description:
      "고혈압은 뚜렷한 증상이 없어 신체검사나 진찰 중에 우연히 발견되는 경우가 적지 않습니다. 고혈압은 '소리 없는 죽음의 악마'라고 할 정도로 증상이 없는 경우가 대부분입니다. 간혹 증상이 있어서 병원을 찾는 경우는 두통이나 어지러움, 심계항진, 피로감 등의 혈압 상승에 의한 증상을 호소합니다. 코피나 혈뇨, 시력 저하, 뇌혈관 장애 증상, 협심증 등 고혈압성 혈관 질환에 의한 증상을 호소하기도 합니다. 이차성 고혈압의 경우 종종 원인 질환의 증상을 호소합니다.두통이 있는 경우에도 혈압이 올라갈 수 있습니다. 그런데 대부분의 경우 혈압 때문에 두통이 생기지 않고 두통 때문에 혈압이 올라갑니다. 따라서 두통이 있으면 혈압보다 두통을 먼저 조절해야 합니다. 흔히 목덜미가 뻣뻣하면 혈압이 높다고 생각하는 경우가 많습니다. 그러나 과도한 스트레스로 인해 목이 뻣뻣해지고 그로 인해 혈압이 올라갈 수 있습니다. 따라서 목이 뻣뻣할 때는 다른 이유를 먼저 고려해야 합니다.",
    symptoms: ["가슴 두근거림", "두통", "어지러움", "피부 긴장도 저하"],
  },
  {
    id: 2,
    name: "당뇨병(Diabetes mellitus)",
    category: "내분비계",
    department: "가정의학과, 내과, 외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%8B%B9%EB%87%A8%EB%B3%91Diabetes_mellitus_32e07368.do",
    description:
      "당뇨병에 걸리면 소변으로 포도당이 빠져나가는데, 이때 수분을 같이 끌고 나가기 때문에 소변량이 늘어납니다. 그 결과 몸 안에 수분이 부족하여 심한 갈증을 느끼게 됩니다. 또한 영양분이 몸에서 이용되지 않고 빠져나가므로 피로감을 잘 느낍니다. 또한 잘 먹는데도 불구하고 체중이 감소합니다. 당뇨병의 가장 대표적인 증상을 ‘삼다(三多)’라고 부릅니다. 즉, 다음(多飮, 물을 많이 마심), 다뇨(多尿, 소변을 많이 봄), 다식(多食, 많이 먹음)을 말합니다. 그 외 당뇨병의 증상으로는 눈 침침함, 손발 저림, 여성의 경우 질 소양증 등이 나타날 수 있습니다. 하지만 혈당이 많이 높지 않은 경우에는 대부분 특별한 증상을 느끼지 못합니다.",
    symptoms: ["고혈당", "다뇨", "다식", "다음", "소양감", "시야장애", "저림", "체중감소", "피로감"],
  },
  {
    id: 3,
    name: "협심증(Angina pectoris)",
    category: "심혈관계",
    department: "내과, 심장혈관흉부외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%ED%98%91%EC%8B%AC%EC%A6%9DAngina_pectoris_c4162190.do",
    description:
      "협심증의 가장 흔한 통증은 가슴 통증입니다. 환자에 따라 조금씩 다를 수 있지만 대개 '가슴을 짓누르는 듯 하다', '뻐개지는 것 같다', '고춧가루를 뿌려 놓은 것 같다', '벌어지는 것 같다', '숨이 차다' 등으로 통증이 표현되는 경우가 많습니다. 협심증의 가슴 통증은 몇 가지 특징을 가지고 있습니다. 가장 중요한 특징은 안정 시에는 통증이 없다가 심장 근육에 많은 산소가 필요한 상황, 즉 운동을 하거나 무거운 물건을 드는 경우, 차가운 날씨에 노출되는 경우, 흥분한 경우에 통증이 발생합니다. 지속 시간은 심근경색증과 달리 대개 5~10분 미만이며, 안정을 취하면 없어집니다. 그러나 병이 심해지면 안정 시에도 통증이 발생하고, 통증의 지속 시간도 길어질 수 있습니다. 이는 심근경색증으로 진행될 확률이 높은 매우 위급한 상황이므로, 즉시 병원을 찾아야 합니다. 당뇨병을 가지고 있는 환자는 비전형적인 양상의 가슴 통증을 호소하는 경우가 있으므로, 가슴 통증이 지속된다면 협심증을 의심해보아야 합니다.",
    symptoms: ["가슴 쓰림", "방사통", "호흡곤란", "흉통"],
  },
  {
    id: 4,
    name: "만성 전립선염(Chronic prostatitis)",
    category: "비뇨기계",
    department: "비뇨의학과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A7%8C%EC%84%B1_%EC%A0%84%EB%A6%BD%EC%84%A0%EC%97%BCChronic_prostatitis_e07d79ac.do",
    description:
      "가장 흔히 호소하는 증상은 회음부의 불쾌감으로 가벼운 불쾌감에서 심한 작열감 및 압박감, 통증까지 다양하게 나타납니다.전신무력감, 피로, 빈뇨, 배뇨곤란, 긴박뇨, 잔뇨감, 야간뇨, 요도구 끝의 통증이나 불쾌감, 사정 시의 통증이나 이상 분비물, 발기부전이나 조루 등이 나타날 수 있습니다. 또 소변이 탁하고 간혹 우윳빛이나 혈성 분비물이 보이기도 합니다. 과음, 과로, 스트레스, 과격한 성생활, 장거리 운전, 장시간 앉아서 일을 한 후에는 증상이 악화될 수 있습니다. 기타 증상으로는 팔다리저림, 허리 통증 등의 이상을 보이기도 합니다.",
    symptoms: ["골반 통증", "긴박뇨", "배뇨곤란", "생식기 통증", "잔뇨감"],
  },
  {
    id: 5,
    name: "만성 기관지염(Chronic bronchitis)",
    category: "호흡기계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A7%8C%EC%84%B1_%EA%B8%B0%EA%B4%80%EC%A7%80%EC%97%BCChronic_bronchitis_497c9950.do",
    description:
      "만성 기관지염이 있는 흡연자는 아침에 기상할 때나 첫 담배를 피울 때 기침을 많이 하며, 온도 차가 심한 곳에서는 가래가 섞인 기침을 많이 할 수 있습니다. 호흡할 때 쌕쌕거리는 소리가 나고, 조금만 운동해도 숨이 차며, 때로 피가 가래에 섞여 나오기도 합니다. 객혈은 폐렴, 결핵 등의 증상으로서 나타날 수도 있으므로, 정확한 진단을 위해 전문의와 상의할 필요가 있습니다.",
    symptoms: ["가래", "객혈", "기침", "운동 시 호흡곤란"],
  },
  {
    id: 6,
    name: "골다공증(Osteoporosis)",
    category: "근골격계",
    department: "가정의학과, 내과, 정형외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EA%B3%A8%EB%8B%A4%EA%B3%B5%EC%A6%9DOsteoporosis_bb04b4ed.do",
    description:
      "뼈의 특성상 초기에는 특별한 증상이 나타나지 않습니다. 초기 증상 중 하나는 척추뼈가 약해져서 척추가 후만 변형되거나 압박되어 신장이 줄어드는 것입니다. 심한 경우 척추가 체중을 지탱하지 못해서 외상이 없더라도 척추의 앞부분이 일그러지게 됩니다. 또한 골절의 위험이 높아집니다. 심할 경우 허리를 구부리거나 기침을 하는 등 일상생활 중에도 뼈가 쉽게 부러질 수 있습니다. 50~70세 여성의 골절은 주로 손목에서 먼저 발생하는 경우가 많습니다. 70대 환자들의 경우 고관절 및 척추의 골절이 흔하게 발생합니다.",
    symptoms: ["골절", "관절통", "신장 감소", "척추 후만"],
  },
  {
    id: 7,
    name: "류마티스 관절염(Rheumatoid arthritis)",
    category: "근골격계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A5%98%EB%A7%88%ED%8B%B0%EC%8A%A4_%EA%B4%80%EC%A0%88%EC%97%BCRheumatoid_arthritis_2c009a28.do",
    description:
      "류마티스 관절염의 초기 증세는 주로 손마디가 뻣뻣해지는 것입니다. 특히 아침에 자고 일어난 직후에 이 증상이 심하게 나타납니다. 1시간 이상 관절을 움직여야만 뻣뻣한 증세가 풀립니다. 이러한 증상은 심하면 하루 종일 지속되기도 합니다. 이와 동시에 환자들은 손마디가 붓고 통증이 느껴져 손을 쓸 수 없다고 호소합니다. 관절염이 무릎이나 팔꿈치, 발목, 어깨, 발까지 침범하는 경우도 흔합니다. 통증이 있는 마디를 만지면 따뜻한 열감을 느낄 수 있습니다. 관절 마디가 붓는 이유는 활막이 붓고, 그 주위에 관절 삼출액이라는 물이 차기 때문입니다. 이러한 증상이 수개월에서 수년 동안 지속되면 관절의 연골이나 주위 조직이 손상되면서 관절 마디가 휘어지거나 굳어져 마음대로 쓸 수 없게 되는 장애가 생깁니다. 이러한 손상을 예방하기 위해서는 초기부터 꾸준하고 적절한 치료를 하는 것이 매우 중요합니다. 또 다른 초기 증세로는 전신의 피로감이 있습니다. 환자들은 관절이 아파서 행동에 불편함을 느끼지만, 이와 동시에 전신의 무력감으로 고생합니다. 눈에는 보이지 않지만 조금만 활동해도 쉽게 피곤해지는 증상은 많은 류마티스 관절염 환자들의 고통을 유발합니다.",
    symptoms: ["관절의 경직", "관절통", "다발성 관절염", "손마디가 뻣뻣해짐", "열감"],
  },
  {
    id: 8,
    name: "위식도 역류성 질환(Gastro-esophagus reflux disease)",
    category: "소화기계",
    department: "가정의학과, 내과, 소아청소년과, 외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EC%9C%84%EC%8B%9D%EB%8F%84_%EC%97%AD%EB%A5%98%EC%84%B1_%EC%A7%88%ED%99%98Gastro_esophagus_reflux_disease_056f0e0e.do",
    description: "간에 지속적인 손상이 누적되어 간 기능이 저하되는 질환으로, 간경화나 간암으로 진행될 수 있습니다.",
    symptoms: ["가슴 쓰림", "기침", "목소리 변화", "방사통", "삼키기 곤란", "오심", "흉통"],
  },
  {
    id: 9,
    name: "갑상선기능저하증(Hypothyroidism)",
    category: "내분비계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EA%B0%91%EC%83%81%EC%84%A0%EA%B8%B0%EB%8A%A5%EC%A0%80%ED%95%98%EC%A6%9DHypothyroidism_ac4a72e1.do",
    description:
      "갑상선호르몬은 열과 에너지를 생성하는 데 필수적입니다. 따라서 갑상선호르몬이 부족하면 온몸의 대사 기능이 저하됩니다. 추위를 잘 타고, 땀이 잘 나지 않고, 피부는 건조하고 창백하며 누렇게 됩니다. 쉽게 피로하고 의욕이 없으며 집중이 잘 되지 않고 기억력이 감퇴합니다. 또한 얼굴과 손발이 붓고, 식욕이 없어 잘 먹지 않는데도 몸이 붓고 체중이 증가합니다. 목소리가 쉬고 말이 느려집니다. 위장관 운동이 저하되어 먹은 것이 잘 내려가지 않으며, 심하면 변비가 생깁니다. 팔다리가 저리고 쑤시며 근육이 단단해지고 근육통이 생깁니다. 여성의 경우 흔히 월경량이 증가합니다. 갑상선기능저하증으로 나타나는 부종은 손가락으로 눌러도 들어가는 자리가 생기지 않는다는 특징이 있습니다. 이처럼 갑상선기능저하증의 증상은 매우 다양하며, 다른 질환에서 나타나는 증상과 유사한 경우가 많습니다. 또한 갑상선기능저하증은 대부분 오랜 시간에 걸쳐 매우 서서히 진행하기 때문에 어느 정도는 적응됩니다. 이에 자각 증상을 뚜렷이 느끼지 못하는 경우가 많습니다. 초기에는 자각 증상이 거의 없어서 단지 검사 결과로만 알 수 있는 경우도 있습니다.",
    symptoms: [
      "근육통",
      "목소리 변화",
      "식욕부진",
      "월경과다",
      "전신 부종",
      "창백",
      "체중증가",
      "추위를 못견딤",
      "피로감",
      "피부 건조",
    ],
  },
  {
    id: 10,
    name: "천식(Asthma)",
    category: "호흡기계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EC%B2%9C%EC%8B%9DAsthma_e7b3a1a5.do",
    description:
      "기관지 천식은 유전적 요인과 환경적인 요인이 함께 상호작용하여 나타납니다. 기관지 천식의 특징적인 증상-  천명 : 숨을 들이쉬고 내쉴 때 나는 휘파람과 비슷한 소리(색색거리는 소리)-  기침 : 발작적이고 밤에 더 심합니다.-  흉부 압박 : 가슴을 조이는 듯한 답답한 느낌-  호흡 곤란 : 마치 빨대를 입에 물고 숨을 쉬는 것처럼 숨이 찹니다.-  가래 : 끈끈하고 덩어리가 진 가래 1. 천식 증상은 복합적이며 자주 변합니다.환자에 따라 기침만 하거나, 호흡 곤란만 느낄 수도 있습니다. 하지만 환자는 대부분 이런 증상들이 함께 나타납니다. 천식의 증상은 오래 지속되기도 하고 반복되기도 하는 등 자주 변화합니다. 2. 환자에 따라 같은 양상의 발작이 반복됩니다.어떤 사람은 감기 증상이 있다가 서서히 악화되어 심한 천식 발작을 일으키기도 하지만, 어떤 사람은 전혀 증상이 없다가 갑자기 심한 천식 발작을 일으키기도 합니다. 증상의 발현과 악화 정도, 회복 기간 등이 환자마다 특징적 양상으로 반복되는 경우가 많습니다.",
    symptoms: ["가래", "가슴 답답", "기침", "천명음", "호흡곤란"],
  },
  {
    id: 11,
    name: "궤양성 대장염(Ulcerative colitis)",
    category: "소화기계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EA%B6%A4%EC%96%91%EC%84%B1_%EB%8C%80%EC%9E%A5%EC%97%BCUlcerative_colitis_21ee1be5.do",
    description:
      "궤양성 대장염의 증상으로는 혈액과 점액을 함유한 묽은 변 또는 설사, 심한 복통, 탈수, 빈혈, 열, 체중 감소 등이 있습니다. 대장에서 흡수하지 못하면 설사가 발생하며, 궤양성 대장염이 대장을 많이 침범하면 심하게 설사합니다. 하루에 10회 이상 설사를 하기도 하며 변실금이 나타날 수 있습니다. 이 경우 피와 점액이 섞인 무른 변이나 피고름 같은 변이 나옵니다. 그러나 직장에만 염증이 있는 경우 변이 약간 무르며 때로는 변비가 오기도 합니다. 만성 출혈로 인해 빈혈이 나타날 수 있습니다. 궤양성 대장염에서 병적인 변화는 항문에 인접한 직장에서 시작하여 점차 안쪽으로 진행합니다. 병적인 변화가 여기저기 흩어져 있지 않고 모두 연결되는 특징이 있습니다. 거의 모든 궤양성 대장염 환자는 직장에 염증이 있습니다. 절반 정도의 환자는 직장부터 S상 결장까지, 1/4 정도의 환자는 직장부터 S상 결장과 왼쪽 대장까지, 나머지 1/4 정도의 환자는 직장부터 횡행 결장 또는 오른쪽 대장까지 대장 전체에 걸쳐 염증이 있습니다. 그러나 항문 주위의 질환은 거의 동반되지 않습니다. 궤양성 대장염의 내시경 소견에서는 수많은 가성 용종이 확인됩니다. 대장 증상 외에 말초 부위 관절염, 강직성 척추염 등이 나타날 수 있습니다. 궤양성 대장염을 겪은 환자는 대부분 발병 1년 안에 재발을 겪습니다. 그 정도로 재발할 가능성이 큰 질환입니다.",
    symptoms: ["변비", "복부 통증", "빈혈", "설사", "열", "점액변", "체중감소", "탈수", "혈변"],
  },
  {
    id: 12,
    name: "만성 위염(Chronic gastritis)",
    category: "소화기계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A7%8C%EC%84%B1_%EC%9C%84%EC%97%BCChronic_gastritis_c9184894.do",
    description:
      "① 표층성 위염은 상복부에 통증을 유발합니다. 이 증상은 식사 직후에 나타날 수 있습니다. 상복부가 무겁게 눌리는 것 같은 기분이 느껴지고, 메스껍고 가슴이 답답하여 소화성 궤양과 비슷한 증상이 나타나기도 합니다. ② 위축성 위염은 위점막이 위축되어 위산 분비가 감소하는 질환입니다. 위 속이 저산증이 되면서 세균 증식이 일어납니다. 명확하게 나타나는 증상은 없고, 소화 불량 증상이 나타납니다. 기름기가 많거나 조미료(짜거나 매운 것)를 많이 넣은 식사를 한 후에 소화가 잘 안되는 것 같은 느낌이 드는 경우가 많습니다. 입맛이 떨어지고 메스꺼움, 구토, 전신 권태감, 설사 등의 증상이 나타날 수 있습니다.",
    symptoms: ["가슴 답답", "권태감", "복부 압박 증상", "복부 통증", "복부팽만감", "설사", "소화불량", "오심", "토혈"],
  },
  {
    id: 13,
    name: "통풍(Gout)",
    category: "근골격계",
    department: "내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%ED%86%B5%ED%92%8DGout_3e319aef.do",
    description:
      "통풍을 치료하지 않으면 발작성 관절염의 빈도가 점점 잦아지고, 침범하는 관절 수도 많아지며, 회복하는 시간도 점점 길어집니다. 관절염이 반복적으로 발생하면서 관절이 점차 상합니다. 관절염이 만성으로 발전합니다. 또한 통풍성 결절이라 불리는 덩어리가 관절 주위나 피하 조직에 나타나기도 합니다. 이러한 통풍성 결절은 요산 결정체의 덩어리로 신체의 어느 부분에서든 생길 수 있습니다. 주로 팔꿈치, 귀, 손가락, 발가락, 발목 등에 생깁니다. 요로 결석을 형성하기도 합니다. 통풍 환자들은 고혈압을 동시에 가지고 있으면서도 모르는 경우가 많아 요로 결석이 생기는 것과 함께 콩팥도 상합니다. 드물게는 관절염보다 선행하여 요로결석증이 나타나는 환자도 있습니다. 통풍의 증상은 다음과 같습니다. ① 엄지발가락, 발목, 무릎 등 한 군데 관절이 갑자기 빨갛게 부어오릅니다. 손을 댈 수 없을 정도로 통증이 심합니다.② 통풍이 심하면 발열과 오한이 동반됩니다.③ 관절염이 처음 생겼을 때는 대개 수일 지나면 저절로 소실되어 완전히 회복된 것처럼 보입니다. 그 후 상당 기간 발병하지 않다가 결국 비슷한 관절염이 다시 발생합니다.④ 엄지발가락 관절에 염증이 잘 발생하는 것이 특징입니다. 무릎, 발, 발목, 손목, 팔꿈치 등에 관절염이 발생하기도 합니다.⑤ 얇은 이불이 스치기만 해도 아파서, 대개 양말을 신지 못하고 걸음을 제대로 걷지 못합니다.⑥ 특히 밤에 통증이 심해져 잠을 이루지 못합니다.",
    symptoms: ["무릎 부위 통증", "발의 통증", "열", "오한", "환부 부종"],
  },
  {
    id: 14,
    name: "뇌전증(Epilepsy)",
    category: "신경계",
    department: "신경과, 신경외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%87%8C%EC%A0%84%EC%A6%9DEpilepsy_2cf578ee.do",
    description:
      "뇌전증의 가장 흔한 증상은 운동성 경련 발작입니다. 하지만 증상은 다양한 양상으로 나타납니다. 뇌의 영역과 위치에 따라 고유 기능이 모두 다르기 때문입니다. 팔의 움직임을 조절하는 뇌 영역에서 발작 증상이 나타나면, 단지 한쪽 팔만 떠는 정도의 증상만이 발생할 수 있습니다. 측두엽 부분에서 뇌전증 증세가 나타나면, 멍해지면서 일시적으로 의식을 상실하고 입맛을 다시는 증상이 나타날 수 있습니다. 양쪽 뇌에 전체적으로 퍼지면, 거품을 물고 온몸이 뻣뻣해지며 대발작이 발생할 수도 있습니다. 이처럼 뇌전증에 의한 발작은 영향을 받은 뇌의 부위와 그 강도에 따라 눈꺼풀을 가볍게 깜빡이는 것부터 몸 전체가 격심하게 떨리는 것까지 다양한 양상으로 나타납니다.",
    symptoms: ["경련", "뇌전증 발작", "눈꺼풀의 떨림", "손떨림", "온몸이 떨림", "의식 저하"],
  },
  {
    id: 15,
    name: "강직성 척추염(Ankylosing spondylitis)",
    category: "근골격계",
    department: "내과, 재활의학과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EA%B0%95%EC%A7%81%EC%84%B1_%EC%B2%99%EC%B6%94%EC%97%BCAnkylosing_spondylitis_8abc296f.do",
    description:
      "개인에 따라 증상에 많은 차이가 있습니다.가장 흔한 초기 증상은 허리 통증으로, 거의 모든 환자에게 나타납니다. 오랜 기간 조금씩 아프기 시작합니다. 주로 잠을 자고 일어난 후에 허리가 뻣뻣하면서 통증이 느껴지고, 활동하다 보면 허리의 통증이 약해지거나 사라지는 특징을 보입니다. 또한 엉덩이 관절, 어깨 관절 등이 붓거나 아프고, 발뒤꿈치, 갈비뼈 등에 통증이 발생하며 이 부위를 누르면 더 심해집니다. 눈의 염증이 나타날 수 있고, 드물게는 심장, 신장(콩팥), 대장 등에 관련 증상이 나타날 수 있습니다.",
    symptoms: ["골반 통증", "관절의 경직", "관절통", "말초 통증", "어깨의 통증", "엉덩이 통증", "요통"],
  },
  {
    id: 16,
    name: "파킨슨병(Parkinson's disease)",
    category: "신경계",
    department: "신경과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%ED%8C%8C%ED%82%A8%EC%8A%A8%EB%B3%91Parkinsons_disease_0c87df09.do",
    description:
      "파킨슨병에 걸리면 운동 증상과 비운동 증상이 모두 나타날 수 있습니다. 다양한 증상이 나타납니다. 1. 운동 증상1) 떨림(진전)몸이 떨리는 증상은 가장 눈에 잘 띄는 증상입니다. 떨림은 주로 편한 자세로 앉아 있거나 누워 있을 때 나타납니다. 손이나 다리를 움직이면 사라집니다. 이 때문에 파킨슨병 환자에게 나타나는 떨림을 '안정 시 진전'이라고 합니다. 2) 경직파킨슨병 초기에는 근육이 뻣뻣해지는 경직 증상이 나타납니다. 근육이나 관절의 문제로 오인되기도 합니다. 파킨슨병이 진행됨에 따라 근육이 조이거나 당기는 느낌, 근육 통증이 느껴지기도 합니다. 부위에 따라, 환자에 따라 허리 통증, 두통, 다리 통증, 다리 저림 증상을 호소하는 경우도 있습니다. 3) 서동행동이 느려집니다. 단추를 끼우거나 글씨를 쓰는 작업과 같이 미세한 움직임이 점점 둔해집니다. 눈 깜박임, 얼굴 표정, 걸을 때 팔 움직임, 자세 변경 등의 동작 횟수와 크기가 감소합니다. 많은 경우에 환자 본인은 잘 알지 못합니다. 주위 사람에게 지적을 받아야 비로소 알게 되는 경우도 있습니다. 4) 자세 불안정몸의 자세를 유지하지 못하고 넘어집니다. 파킨슨병의 초기에는 드물지만, 병이 진행되면 많은 환자들에게 나타납니다. 5) 구부정한 자세목, 허리, 팔꿈치, 무릎 관절이 구부정하게 구부러진 자세가 됩니다. 6) 보행 동결걷기 시작할 때, 걷는 도중, 걷다가 돌 때 발이 땅에서 떨어지지 않아서 발걸음을 옮기지 못합니다. 많은 환자들이 무척 괴로워합니다. 파킨승병이 많이 진행된 환자에게 관찰됩니다. 2. 비운동 증상1) 신경 정신 증상우울, 불안, 무감동, 충동 조절 장애, 환시, 정신증 등의 신경 정신 증상이 나타날 수 있습니다. 50% 정도의 파킨슨병 환자가 우울증을 겪습니다. 이로 인해 약에 대한 순응도나 치료 의욕이 떨어져 삶의 질이 악화될 수 있습니다. 2) 인지 기능 저하전체 환자의 40% 정도에서 인지 기능 저하가 동반됩니다. 파킨슨병 환자가 겪는 치매 증상은 알츠하이머병에서 나타나는 치매와 양상이 다릅니다. 환시를 겪기도 하고, 인지 기능 증상의 기복이 심할 수 있습니다. 약에 대해 과민 반응을 보이는 경우도 있습니다. 현실적으로 인지 기능을 완치할 수 있는 치료는 없습니다. 그러나 적절한 약물 요법으로 도움을 받을 수 있습니다. 3) 자율신경계 이상기립성 저혈압, 변비, 소변 장애, 성 기능 장애, 후각 이상, 장운동 이상 등의 자율신경계 이상이 발생할 수 있습니다. 4) 수면 장애많은 파킨슨병 환자가 불면증을 호소합니다. 이 외에도 기면, 주간 과다 졸림증, 하지 불안 증후군, 렘수면 행동 장애, 주기성 사지 운동 장애 등의 수면 장애가 동반될 수 있습니다. 렘수면 행동 장애는 수면 중에 심한 잠꼬대를 하거나 헛손질과 헛발질을 하는 것입니다. 파킨슨병 운동 증상 발생 이전부터 관찰되기도 합니다. 5) 배뇨 장애소변을 자주 보는 빈뇨가 흔하게 나타납니다. 야간에 빈뇨가 나타나면 수면을 방해합니다. 6) 기타통증, 무감각, 피로, 후각 저하 등의 감각 이상이 동반됩니다.",
    symptoms: ["경직", "떨림(진전)", "보행이상", "서동", "손떨림", "수면장애", "자세 불안정", "자세이상"],
  },
  {
    id: 17,
    name: "알츠하이머병(Alzheimer's disease)",
    category: "신경계",
    department: "신경과, 정신건강의학과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EC%95%8C%EC%B8%A0%ED%95%98%EC%9D%B4%EB%A8%B8%EB%B3%91Alzheimers_disease_a3ad2754.do",
    description:
      "1. 기억 장애알츠하이머병 환자가 처음에 호소하는 증상이자, 가장 흔하게 나타나는 증상입니다. 병의 초기에는 새로운 정보의 등록, 저장, 재생(단기 기억)이 어려워집니다. 병이 진행하면 오래전에 습득한 장기 기억도 잊어버립니다. 기억 장애가 오면 다음과 같은 증상이 나타납니다. 1) 지갑이나 열쇠 등 중요한 소지품을 잘 잃어버립니다.2) 전화번호나 사람 이름을 잘 잊어버립니다.3) 가스 불에 음식을 올려놓은 것을 잊어버려, 음식을 자주 태웁니다.4) 방금 한 말을 반복하거나, 같은 질문을 반복합니다.5) 병이 진행하면 자신의 이름도 잊어버리고, 자신의 얼굴이나 가족의 얼굴도 알아보지 못합니다.6) 기억 장애 때문에 일상생활에 영향을 받습니다. 환자 자신은 있었던 일 자체를 기억하지 못할 수도 있습니다. 2. 언어 장애(실어증)물건의 이름이 금방 떠오르지 않습니다. 환자들은 모호하게 돌려 말합니다. ‘그런 것’ 같은 표현을 자주 사용합니다. 말이나 글을 이해하는 능력도 점차 잃게 됩니다. 들은 말을 메아리처럼 반복하고, 같은 소리를 계속 되풀이합니다. 그러나 병이 진행하면 이런 능력도 잃어버리고 아무 말도 못 하게 됩니다. 3. 실행증근력(힘)이나 명령을 이해하는 데는 이상이 없어도, 일상적인 생활 동작, 요리하기, 세수하기, 옷 갈아입기 등에서 장애를 보입니다. 4. 실인증시력은 정상이나 사물을 구별하지 못합니다. 심한 경우는 가족이나 거울에 비치는 자신의 모습을 인식하지 못할 수 있습니다. 5. 시공간 능력 장애방향 감각이 떨어져 길을 잃고 헤맬 수 있습니다. 잘 알고 다니던 길에서도 길을 잃습니다. 오랫동안 살아온 집을 찾지 못해서 헤매는 경우가 발생할 수 있습니다. 운전하던 환자는 접촉사고를 자주 내거나, 익숙한 길에서도 방향을 헤매서 더 이상 운전을 하기 어려워집니다. 6. 판단력 장애연속극 내용을 잘 이해하지 못하여 흥미를 잃을 수 있습니다. 또한 판단력이 저하되어 시시콜콜한 이야기를 옆집 친구에게 다 이야기하여 곤란한 상황이 생기기도 합니다. 계산력이 떨어져 물건을 사고 돈 계산을 틀리게 합니다. 7. 행동 증상, 정신증적 증상행동 증상은 환자의 가족들을 곤란하게 만드는 증상입니다. 주로 도둑 망상과 부정 망상이 흔하게 나타납니다. 텔레비전에서 나오는 인물과 대화하려고 하거나, 거울에 비친 자신을 인식하지 못하고 대화하려는 증상이 생길 수 있습니다. 주로 알츠하이머병이 악화된 중기 이후에 보입니다. 주위의 물건과 사람들을 잘못 인식합니다. 초조, 불안, 공격성 증가 등으로 보호자나 간병인의 부담이 심해져서, 환자를 의료 시설에 입원시켜야 할 수 있습니다. 8. 우울 증상병의 초기부터 나타납니다. 전체 치매 환자 중 40~80%에서 우울 증상이 나타납니다. 9. 감정 변화감정 상태가 불안정하여 사소한 일에도 화를 자주 냅니다. 쉽게 울거나 웃습니다. 10. 야간 착란밤이 되면 안절부절못하고, 이리저리 배회하며, 난폭해집니다. 흥분하여 공격적인 행동을 하거나 가출하여 배회하는 경우도 있습니다.",
    symptoms: [
      "감정 변화",
      "기억장애",
      "방향감각 상실",
      "섬망",
      "시력 감소",
      "실인증",
      "실행증",
      "언어장애",
      "우울",
      "조급증",
      "판단력장애",
    ],
  },
  {
    id: 18,
    name: "만성 피로 증후군(Chronic fatigue syndrome)",
    category: "내분비계",
    department: "가정의학과, 내과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A7%8C%EC%84%B1_%ED%94%BC%EB%A1%9C_%EC%A6%9D%ED%9B%84%EA%B5%B0Chronic_Fatigue_Syndrome_fd1a2d0e.do",
    description:
      "만성 피로 증후군의 증상은 개인마다 다양하게 나타날 수 있습니다. 만성 피로 증후군의 가장 일반적인 증상은 다음과 같습니다. ① 별다른 원인 없이 심한 피로를 느끼며, 이러한 피로가 6개월 이상 지속됩니다.② 집중력 저하, 기억력 장애, 수면 장애, 위장 장애 등의 증상이 나타납니다.③ 이외에 복통, 흉통, 식욕 부진, 오심, 호흡 곤란, 체중 감소, 우울, 불안 등 다양한 증상을 호소할 수 있습니다.정확한 진단 및 만성 피로를 유발하는 다른 질환을 배제하기 위해서는 전문의의 진료가 필요합니다.",
    symptoms: ["권태감", "기억장애", "수면장애", "식욕부진", "전신 통증", "피로감"],
  },
  {
    id: 19,
    name: "만성 췌장염(Chronic pancreatitis)",
    category: "소화기계",
    department: "내과, 외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%EB%A7%8C%EC%84%B1_%EC%B7%8C%EC%9E%A5%EC%97%BCChronic_pancreatitis_6b5c26e9.do",
    description:
      "만성 췌장염은 특별한 증상 없이 우연히 발견되는 경우가 많습니다. 만성 췌장염의 가장 흔한 증상 중 하나는 심한 상복부 통증입니다. 췌장의 염증으로 인해 췌장의 부종과 섬유화가 발생하여 신경 말단이 자극되고, 췌관 내 압력이 증가하고 췌장 실질의 혈류가 감소하여 허혈성 통증이 발생합니다. 이는 요통, 복부 통증 및 압통을 일으킵니다. 복통은 종종 식후 15~30분 정도에 발생하여 수일간 지속되며 대개 수개월 간격으로 반복되는 특징이 있습니다. 통증은 명치나, 몸의 왼쪽에서 주로 나타납니다. 때로는 통증이 등, 가슴, 옆구리 등으로 방사됩니다. 특히 췌장은 등 쪽에 있는 장기이므로 누운 자세에서는 통증이 심해지고, 다리를 모으고 구부린 자세에서는 통증이 완화됩니다. 췌장의 외분비 기능이 감소하면 이로 인해 각종 영양분의 소화 흡수에 장애가 발생합니다. 주로 지방 흡수 장애가 나타나며 단백질 흡수 장애가 나타나기도 합니다. 지방이 들어 있는 음식을 섭취한 후 대변의 양이 많고 냄새가 심합니다. 대변이 물에 뜨거나 물에 기름방울이 뜨는 지방변이 생깁니다. 지용성 흡수 장애와 체중 감소가 나타나기도 합니다. 췌장의 내분비 기능의 장애는 췌장이 심하게 파괴된 말기에 주로 나타납니다. 이때 인슐린이 부족해지면서 당뇨병이 발생합니다.",
    symptoms: ["당뇨", "방사통", "복부 통증", "지방변", "체중감소"],
  },
  {
    id: 20,
    name: "크론병(Crohn's disease)",
    category: "소화기계",
    department: "내과, 소아청소년과, 외과",
    image:
      "https://pub-f8fd744877724e40a29110baaa7d9f66.r2.dev/__healbot__/disease/img/%ED%81%AC%EB%A1%A0%EB%B3%91Crohns_disease_00edd691.do",
    description:
      "크론병의 증상은 환자에 따라 종류와 정도가 다양하게 나타납니다. 가장 특징적인 증상은 증상기(복통과 설사 등의 증상이 나타나는 시기)와 무증상기(특별한 처치 없이 증상이 회복되어 아무런 증상도 나타나지 않는 시기)가 반복된다는 것입니다. 복통은 간헐적으로 나타나는 산통과 유사합니다. 주로 하복부에 나타납니다. 설사는 약 85%의 비율로 나타납니다. 설사 증상은 일반 설사와 같으며, 설사에 고름이나 혈액, 점액이 섞이는 경우는 거의 없습니다. 전체 환자의 1/3에서 체중 감소가 나타납니다. 오심, 구토, 발열, 밤에 땀을 흘리는 증상, 식욕 감퇴, 전신적인 허약감, 근육량 감소, 직장 출혈 등이 나타납니다. 입안의 점막과 식도, 위막에 염증이 생기기도 합니다. 급성으로 발현되면 체온이 상승하고, 백혈구의 수치가 증가하며, 오른쪽 복부 아래쪽에 심각한 통증이 나타납니다. 소장과 대장에 모두 염증이 침범하는 경우가 55% 정도, 소장에만 염증이 침범한 경우가 30% 정도, 대장에만 염증이 침범한 경우가 15% 정도를 차지합니다. 병변 부위는 정상 부위 – 병변 부위 – 정상 부위가 반복되는 듯 건너뛰어 있는 양상을 보입니다. 장이 복벽에 위치할 수 있도록 지지해주는 장간막도 두꺼워져 있습니다. 비대해진 림프절을 관찰할 수 있습니다. 크론병 환자의 90% 이상은 항문 질환이 있습니다. 항문 직장(Anorectal area) 주위에 농양이 생기는 경우가 있고, 이로 인해 치루가 생기기도 합니다. 만성적인 장의 염증으로 인해 누공이 생길 수 있고, 상처와 장폐색이 나타날 수 있습니다. 누공과 농양이 장의 벽을 관통하는 큰 구멍을 만들기도 합니다. 이외에 장의 기능 이상과 관련 없이 관절통, 관절염이 나타나기도 합니다. 피부, 눈, 간, 신장에 이상이 생기기도 합니다. 골밀도가 감소하여 골다공증이 생기는 경우도 있습니다.",
    symptoms: [
      "골다공증",
      "관절염",
      "관절통",
      "구토",
      "발한",
      "복부 통증",
      "설사",
      "식욕부진",
      "열",
      "오심",
      "체중감소",
      "피로감",
      "혈변",
    ],
  },
];

function ChronicDiseasePage() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const navigate = useNavigate();

  // 카테고리별 필터링
  const categories = ["전체", "심혈관계", "내분비계", "비뇨기계", "호흡기계", "근골격계", "소화기계", "신경계"];

  const filteredDiseases =
    selectedCategory === "전체"
      ? chronicDiseases
      : chronicDiseases.filter((disease) => disease.category === selectedCategory);

  return (
    <div className="chronic-disease-page-wrapper">
      <Header />
      <ScrollToTop />

      <div className="chronic-disease-page-container">
        {/* 페이지 헤더 */}
        <div className="chronic-page-header">
          <div className="header-content">
            <h1>만성질환 정보</h1>
            <p className="header-subtitle">주요 만성질환에 대한 정보를 확인하세요</p>
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

        {/* 질환 그리드 */}
        <div className="chronic-disease-content">
          <div className="chronic-disease-grid">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="chronic-disease-card"
                onClick={() => {
                  setSelectedDisease(disease);
                  setShowDetailModal(true);
                }}>
                {disease.image && (
                  <div className="chronic-disease-image-container">
                    <img src={disease.image} alt={disease.name} className="chronic-disease-image" />
                  </div>
                )}

                <div className="chronic-disease-content-area">
                  <div className="chronic-disease-category-badge">{disease.category}</div>
                  <h3 className="chronic-disease-name">{disease.name}</h3>
                  <div className="chronic-disease-symptoms">
                    {disease.symptoms.slice(0, 4).map((symptom, idx) => (
                      <span key={idx} className="symptom-tag">
                        {symptom}
                      </span>
                    ))}
                    {disease.symptoms.length > 4 && (
                      <span className="symptom-tag more">+{disease.symptoms.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 질병 상세 정보 모달 */}
      {showDetailModal && selectedDisease && (
        <div className="detail-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn-top" onClick={() => setShowDetailModal(false)}>
              ✕
            </button>
            <div className="detail-modal-body">
              <div className="detail-content-grid">
                {/* 왼쪽: 이미지 */}
                <div className="detail-left">
                  {selectedDisease.image && (
                    <div className="detail-image-container">
                      <img src={selectedDisease.image} alt={selectedDisease.name} className="detail-image" />
                    </div>
                  )}
                  <button className="find-department-btn">진료과 찾기</button>
                </div>

                {/* 오른쪽: 정보 */}
                <div className="detail-right">
                  <div className="detail-section">
                    <h3 className="detail-section-title">질환명</h3>
                    <p className="detail-text">{selectedDisease.name}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">진료과</h3>
                    <p className="detail-text">{selectedDisease.department}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">설명</h3>
                    <p className="detail-text">{selectedDisease.description}</p>
                  </div>

                  <div className="detail-section">
                    <h3 className="detail-section-title">증상</h3>
                    <div className="detail-symptoms-list">
                      {selectedDisease.symptoms.map((symptom, idx) => (
                        <span key={idx} className="detail-symptom-badge">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ChronicDiseasePage;
