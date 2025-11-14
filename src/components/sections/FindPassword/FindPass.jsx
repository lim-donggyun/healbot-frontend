import { useState } from 'react';
import './FindPass.css';

function FindPass({ onResetPassword }) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 아이디와 이메일이 매칭되는지 확인 (데모용)
    // 실제로는 서버에서 확인해야 함
    alert('아이디와 이메일이 확인되었습니다.\n비밀번호 재설정 페이지로 이동합니다.');

    // 비밀번호 재설정 페이지로 이동
    if (onResetPassword) {
      onResetPassword(userId);
    }
  };

  const handleLoginClick = () => {
    alert('로그인 페이지로 이동 (데모)');
  };

  const handleSignupClick = () => {
    alert('회원가입 페이지로 이동 (데모)');
  };

  const handleSupportClick = () => {
    alert('고객센터로 이동 (데모)');
  };

  return (
    <div className="page">
      <div className="card">
        <div className="avatar">🔑</div>

        <h2 className="title">비밀번호 찾기</h2>
        <p className="subtitle">등록된 이메일로 비밀번호를 찾을 수 있습니다.</p>

        <div className="section-header">이메일</div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">아이디</label>
          <div className="input-wrap">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <label className="label">이메일</label>
          <div className="input-wrap">
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit">
            비밀번호 찾기
          </button>

          <div className="links-row">
            <span>
              ← <a href="#" onClick={(e) => { e.preventDefault(); handleLoginClick(); }}>로그인으로 돌아가기</a>
            </span>
            <span>
              ◇ <a href="#" onClick={(e) => { e.preventDefault(); handleSignupClick(); }}>회원가입</a>
            </span>
          </div>
        </form>

        <p className="help">
          도움이 필요하시면 <a href="#" onClick={(e) => { e.preventDefault(); handleSupportClick(); }}>고객센터</a>로
          문의해주세요
        </p>
      </div>
    </div>
  );
}

export default FindPass;
