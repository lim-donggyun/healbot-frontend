import { useState } from 'react';
import './ResetPassword.css';

function ResetPassword({ userId }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword.trim()) {
      alert('비밀번호 확인을 입력해주세요.');
      return;
    }

    // 비밀번호 길이 확인
    if (newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.\n다시 확인해주세요.');
      return;
    }

    // 비밀번호 강도 확인 (영문, 숫자, 특수문자 포함)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    alert(`비밀번호가 성공적으로 변경되었습니다!\n새로운 비밀번호로 로그인해주세요.`);
    // 실제로는 서버로 비밀번호 변경 요청을 보내야 함
  };

  const handleLoginClick = () => {
    alert('로그인 페이지로 이동 (데모)');
  };

  return (
    <div className="page">
      <div className="card">
        <div className="avatar">🔐</div>

        <h2 className="title">비밀번호 재설정</h2>
        <p className="subtitle">
          {userId ? `${userId}님의 ` : ''}새로운 비밀번호를 설정해주세요.
        </p>

        <div className="section-header">비밀번호 설정</div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">새 비밀번호</label>
          <div className="input-wrap">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="8자 이상 입력해주세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showNewPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="hint">영문, 숫자, 특수문자를 포함해야 합니다.</div>

          <label className="label">비밀번호 확인</label>
          <div className="input-wrap">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력해주세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {confirmPassword && (
            <div className={`match-status ${newPassword === confirmPassword ? 'match' : 'no-match'}`}>
              {newPassword === confirmPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
            </div>
          )}

          <button type="submit" className="submit">
            비밀번호 변경하기
          </button>

          <div className="links-row">
            <span>
              ← <a href="#" onClick={(e) => { e.preventDefault(); handleLoginClick(); }}>로그인으로 돌아가기</a>
            </span>
          </div>
        </form>

        <div className="security-info">
          <div className="info-icon">ℹ️</div>
          <div className="info-text">
            보안을 위해 주기적으로 비밀번호를 변경하시는 것을 권장합니다.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
