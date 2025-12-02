import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import "./Partners.css";

function Partners() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    type: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("제휴 문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.");
    // 실제로는 API 호출
    setFormData({
      company: "",
      name: "",
      email: "",
      phone: "",
      type: "",
      content: "",
    });
  };

  return (
    <div className="partners-page-wrapper">
      <Header />
      <div className="page">
        <h1>제휴 문의</h1>
        <p className="partners-subtitle">HealBot과 함께 더 나은 의료 서비스를 만들어가실 파트너를 찾습니다.</p>

        <div className="partners-content">
          <section className="partners-info-section">
            <h2>제휴 안내</h2>
            <div className="partners-cards">
              <div className="partners-card">
                <div className="partners-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  </svg>
                </div>
                <h3>의료기관 제휴</h3>
                <p>병원, 의원, 한의원 등 의료기관과의 정보 연동 및 홍보 제휴</p>
              </div>
              <div className="partners-card">
                <div className="partners-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>제약/헬스케어 제휴</h3>
                <p>제약회사, 헬스케어 기업과의 제품 정보 제공 및 마케팅 협력</p>
              </div>
              <div className="partners-card">
                <div className="partners-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>기술/서비스 제휴</h3>
                <p>IT 기술, 서비스 기업과의 기술 협력 및 공동 서비스 개발</p>
              </div>
            </div>
          </section>

          <section className="partners-form-section">
            <h2>제휴 문의 양식</h2>
            <form className="partners-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    회사명 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="회사명을 입력해주세요"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    담당자명 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해주세요"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    이메일 <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    연락처 <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  제휴 유형 <span className="required">*</span>
                </label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">선택해주세요</option>
                  <option value="medical">의료기관 제휴</option>
                  <option value="pharma">제약/헬스케어 제휴</option>
                  <option value="tech">기술/서비스 제휴</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  문의 내용 <span className="required">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="제휴에 대한 상세한 내용을 입력해주세요"
                  rows="8"
                  required></textarea>
              </div>

              <button type="submit" className="partners-submit-btn">
                제휴 문의 보내기
              </button>
            </form>
          </section>

          <section className="partners-contact-section">
            <h2>직접 문의</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-info">
                  <strong>이메일</strong>
                  <p>healbot.official@gmail.com</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-info">
                  <strong>전화</strong>
                  <p>1588-0000 (내선 2번)</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="contact-info">
                  <strong>상담 시간</strong>
                  <p>평일 09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Partners;
