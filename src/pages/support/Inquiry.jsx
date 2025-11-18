import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import './Inquiry.css';

function Inquiry() {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    email: '',
    content: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('문의가 성공적으로 접수되었습니다.\n평일 기준 24시간 내에 답변 드리겠습니다.');
    // 실제로는 API 호출
    setFormData({
      category: '',
      title: '',
      email: '',
      content: '',
      file: null
    });
  };

  return (
    <div className="inquiry-page-wrapper">
      <Header />
      <div className="page">
        <h1>1:1 문의</h1>
        <p className="inquiry-subtitle">궁금한 사항을 문의해 주시면 성심껏 답변 드리겠습니다.</p>

        <div className="inquiry-container">
          <div className="inquiry-info-box">
            <h3>💡 문의 전 확인해 주세요</h3>
            <ul>
              <li><a href="/faq">자주 묻는 질문</a>에서 먼저 확인해 보세요</li>
              <li>평일 기준 24시간 내에 이메일로 답변 드립니다</li>
              <li>주말/공휴일 문의는 다음 영업일에 처리됩니다</li>
              <li>첨부파일은 최대 10MB까지 가능합니다</li>
            </ul>
          </div>

          <form className="inquiry-form" onSubmit={handleSubmit}>
            <div className="inquiry-form-group">
              <label>문의 유형 <span className="required">*</span></label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">선택해주세요</option>
                <option value="service">서비스 이용 문의</option>
                <option value="account">회원정보 문의</option>
                <option value="error">오류 신고</option>
                <option value="suggest">서비스 개선 제안</option>
                <option value="etc">기타 문의</option>
              </select>
            </div>

            <div className="inquiry-form-group">
              <label>제목 <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>

            <div className="inquiry-form-group">
              <label>답변 받으실 이메일 <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="inquiry-form-group">
              <label>문의 내용 <span className="required">*</span></label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="문의하실 내용을 자세히 작성해 주세요.&#10;&#10;오류 문의 시 다음 정보를 함께 입력해주시면 빠른 해결에 도움이 됩니다:&#10;- 발생 일시&#10;- 사용 브라우저&#10;- 오류 발생 화면 캡처&#10;- 상세한 재현 방법"
                rows="10"
                required
              ></textarea>
            </div>

            <div className="inquiry-form-group">
              <label>파일 첨부 (선택)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <span className="file-icon">📎</span>
                  {formData.file ? formData.file.name : '파일 선택'}
                </label>
                <p className="file-upload-desc">이미지, PDF, Word 문서 (최대 10MB)</p>
              </div>
            </div>

            <div className="inquiry-privacy-check">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>개인정보 수집 및 이용에 동의합니다</span>
              </label>
              <button type="button" className="privacy-detail-btn">상세보기</button>
            </div>

            <button type="submit" className="inquiry-submit-btn">
              문의하기
            </button>
          </form>

          <div className="inquiry-history-section">
            <h3>나의 문의 내역</h3>
            <div className="inquiry-history-notice">
              <p>로그인 후 문의 내역을 확인할 수 있습니다.</p>
              <button className="login-btn" onClick={() => window.location.href = '/login'}>
                로그인하기
              </button>
            </div>
            {/* 로그인 후에는 문의 내역 표시 */}
          </div>

          <div className="inquiry-contact-alternative">
            <h3>다른 문의 방법</h3>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <div>
                  <strong>전화 문의</strong>
                  <p>1588-0000 (평일 09:00 - 18:00)</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <div>
                  <strong>이메일 문의</strong>
                  <p>support@healbot.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default Inquiry;
