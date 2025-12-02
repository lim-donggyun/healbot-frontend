import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "./FAQ.css";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = [
    {
      category: "service",
      question: "HealBot 서비스는 무료인가요?",
      answer:
        "네, HealBot의 기본 서비스는 모두 무료로 이용하실 수 있습니다. 증상 검색, 병원 찾기, 건강 정보 조회 등 주요 기능을 제한 없이 사용하실 수 있습니다.",
    },
    {
      category: "service",
      question: "회원가입을 꼭 해야 하나요?",
      answer:
        "기본적인 정보 조회는 비회원도 가능하지만, 증상 검색 기록 저장, 관심 병원 저장, 커뮤니티 참여 등의 기능은 회원가입 후 이용 가능합니다.",
    },
    {
      category: "usage",
      question: "증상 검색은 어떻게 이용하나요?",
      answer:
        "메인 페이지의 증상 검색 섹션에서 현재 겪고 있는 증상을 입력하시면, AI가 분석하여 가능성 있는 질병과 대처 방법을 안내해드립니다. 단, 정확한 진단은 반드시 의료 전문가와 상담하셔야 합니다.",
    },
    {
      category: "usage",
      question: "응급실 실시간 정보는 정확한가요?",
      answer:
        "응급실 정보는 공공데이터를 기반으로 실시간으로 업데이트됩니다. 다만, 상황에 따라 지연이 있을 수 있으니 응급 상황 시 병원에 직접 연락하여 확인하시는 것을 권장드립니다.",
    },
    {
      category: "usage",
      question: "병원 정보가 잘못되어 있어요.",
      answer:
        "병원 정보 오류를 발견하신 경우 고객센터로 연락 주시면 확인 후 신속하게 수정하겠습니다. 정확한 정보 제공을 위해 노력하고 있습니다.",
    },
    {
      category: "account",
      question: "비밀번호를 잊어버렸어요.",
      answer:
        '로그인 페이지의 "계정 찾기" 메뉴에서 비밀번호 재설정을 진행하실 수 있습니다. 가입 시 등록한 이메일로 재설정 링크가 발송됩니다.',
    },
    {
      category: "account",
      question: "회원 탈퇴는 어떻게 하나요?",
      answer:
        "마이페이지의 설정 메뉴에서 회원 탈퇴를 진행하실 수 있습니다. 탈퇴 시 모든 개인정보와 이용 기록이 삭제되며, 복구가 불가능하니 신중하게 결정해 주세요.",
    },
    {
      category: "account",
      question: "개인정보는 안전하게 보호되나요?",
      answer:
        "회원님의 개인정보는 암호화되어 안전하게 보관되며, 개인정보처리방침에 따라 엄격하게 관리됩니다. 법적 요구가 있는 경우를 제외하고 제3자에게 제공되지 않습니다.",
    },
    {
      category: "technical",
      question: "모바일에서도 사용할 수 있나요?",
      answer:
        "네, HealBot은 반응형 웹으로 제작되어 PC, 태블릿, 스마트폰 등 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.",
    },
    {
      category: "technical",
      question: "어떤 브라우저를 사용해야 하나요?",
      answer:
        "Chrome, Edge, Safari, Firefox 등 최신 버전의 모든 주요 브라우저에서 원활하게 이용하실 수 있습니다. 최상의 경험을 위해 브라우저를 최신 버전으로 유지해 주세요.",
    },
    {
      category: "technical",
      question: "서비스 이용 중 오류가 발생해요.",
      answer:
        "오류가 지속적으로 발생하는 경우 브라우저 캐시를 삭제하거나 다른 브라우저를 이용해 보세요. 문제가 해결되지 않으면 고객센터(healbot.official@gmail.com)로 상세한 오류 내용을 보내주시면 확인 후 조치하겠습니다.",
    },
    {
      category: "etc",
      question: "건강 정보의 출처는 어디인가요?",
      answer:
        "모든 건강 정보는 신뢰할 수 있는 의료 기관, 보건복지부, 질병관리청 등의 공식 자료를 기반으로 하며, 의료 전문가의 검수를 거쳐 제공됩니다.",
    },
    {
      category: "etc",
      question: "서비스 제안이나 피드백은 어디로 보내나요?",
      answer:
        "서비스 개선을 위한 제안이나 피드백은 언제나 환영합니다. 고객센터 이메일(healbot.official@gmail.com) 또는 1:1 문의를 통해 의견을 보내주시면 검토 후 반영하도록 노력하겠습니다.",
    },
  ];

  const categories = [
    { id: "all", name: "전체" },
    { id: "service", name: "서비스 이용" },
    { id: "usage", name: "기능 사용" },
    { id: "account", name: "계정/회원" },
    { id: "technical", name: "기술 지원" },
    { id: "etc", name: "기타" },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFAQ = activeCategory === "all" ? faqData : faqData.filter((item) => item.category === activeCategory);

  return (
    <div className="faq-page-wrapper">
      <Header />
      <div className="page">
        <h1>자주 묻는 질문</h1>
        <p className="faq-subtitle">HealBot 이용 중 궁금한 점을 빠르게 해결하세요.</p>

        <div className="faq-category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}>
              {category.name}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filteredFAQ.map((item, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span className="faq-q-icon">Q</span>
                <span className="faq-q-text">{item.question}</span>
                <span className="faq-toggle-icon">{activeIndex === index ? "−" : "+"}</span>
              </div>
              <div className="faq-answer">
                <span className="faq-a-icon">A</span>
                <span className="faq-a-text">{item.answer}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact-box">
          <h3>찾으시는 답변이 없으신가요?</h3>
          <p>고객센터를 통해 문의해 주시면 친절하게 안내해 드리겠습니다.</p>
          <div className="faq-contact-buttons">
            <button className="faq-contact-btn" onClick={() => (window.location.href = "/inquiry")}>
              1:1 문의하기
            </button>
            <button className="faq-contact-btn secondary" onClick={() => (window.location.href = "/customer-service")}>
              고객센터
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default FAQ;
