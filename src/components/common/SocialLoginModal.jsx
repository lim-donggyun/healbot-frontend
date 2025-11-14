import React, { useEffect, useState } from 'react';
import './SocialLoginModal.css';

const SocialLoginModal = ({ isOpen, onClose, loginType }) => {
    const [message, setMessage] = useState('로그인 처리 중입니다...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        // 모달이 열리면 OAuth 인증 시작
        const KAKAO_CLIENT_ID = '37c07e1b78f9ff4e90220baba19dc6d8';
        const NAVER_CLIENT_ID = '7dDcfFju07pYCJGngC0y';
        const REDIRECT_URI = 'http://localhost:3000/login';

        if (loginType === 'kakao') {
            localStorage.setItem('loginType', 'kakao');
            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

            // 팝업 창 열기
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            const popup = window.open(
                kakaoAuthUrl,
                'kakao_login',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // 팝업 모니터링
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    onClose();
                }
            }, 500);

        } else if (loginType === 'naver') {
            localStorage.setItem('loginType', 'naver');
            const state = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('oauth_state', state);
            const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${state}`;

            // 팝업 창 열기
            const width = 500;
            const height = 600;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            const popup = window.open(
                naverAuthUrl,
                'naver_login',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // 팝업 모니터링
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    onClose();
                }
            }, 500);
        }
    }, [isOpen, loginType, onClose]);

    if (!isOpen) return null;

    return (
        <div className="social-login-modal-overlay" onClick={onClose}>
            <div className="social-login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                <div className="modal-content">
                    {isLoading && <div className="spinner"></div>}
                    <div className="modal-message">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default SocialLoginModal;
