import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './Partners.css';

function Partners() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    type: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('제휴 문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
    // 실제로는 API 호출
    setFormData({
      company: '',
      name: '',
      email: '',
      phone: '',
      type: '',
      content: ''
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
                <div className="partners-card-icon">🏥</div>
                <h3>의료기관 제휴</h3>
                <p>병원, 의원, 한의원 등 의료기관과의 정보 연동 및 홍보 제휴</p>
              </div>
              <div className="partners-card">
                <div className="partners-card-icon">💊</div>
                <h3>제약/헬스케어 제휴</h3>
                <p>제약회사, 헬스케어 기업과의 제품 정보 제공 및 마케팅 협력</p>
              </div>
              <div className="partners-card">
                <div className="partners-card-icon">🤝</div>
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
                  <label>회사명 <span className="required">*</span></label>
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
                  <label>담당자명 <span className="required">*</span></label>
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
                  <label>이메일 <span className="required">*</span></label>
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
                  <label>연락처 <span className="required">*</span></label>
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
                <label>제휴 유형 <span className="required">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">선택해주세요</option>
                  <option value="medical">의료기관 제휴</option>
                  <option value="pharma">제약/헬스케어 제휴</option>
                  <option value="tech">기술/서비스 제휴</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div className="form-group">
                <label>문의 내용 <span className="required">*</span></label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="제휴에 대한 상세한 내용을 입력해주세요"
                  rows="8"
                  required
                ></textarea>
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
                <div className="contact-icon">📧</div>
                <div className="contact-info">
                  <strong>이메일</strong>
                  <p>partners@healbot.com</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <div className="contact-info">
                  <strong>전화</strong>
                  <p>1588-0000 (내선 2번)</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">⏰</div>
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
