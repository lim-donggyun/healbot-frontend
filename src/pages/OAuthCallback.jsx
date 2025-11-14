import React, { useEffect, useState } from 'react';
import './OAuthCallback.css';

const OAuthCallback = () => {
    const [message, setMessage] = useState('로그인 정보를 전달하고 있습니다...');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code) {
            setMessage('인가 코드가 없습니다.');
            setTimeout(() => window.close(), 2000);
            return;
        }

        // 로그인 타입 결정 (state가 있으면 naver, 없으면 kakao)
        const type = state ? 'naver' : 'kakao';

        // 부모 창에 메시지 전달
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage(
                { type, code },
                window.location.origin
            );
            setMessage('로그인 정보를 전달했습니다. 잠시만 기다려주세요...');

            // 1초 후 창 닫기
            setTimeout(() => {
                window.close();
            }, 1000);
        } else {
            setMessage('부모 창을 찾을 수 없습니다.');
            setTimeout(() => window.close(), 2000);
        }
    }, []);

    return (
        <div className="oauth-callback-container">
            <div className="oauth-callback-box">
                <div className="spinner"></div>
                <div className="message">{message}</div>
            </div>
        </div>
    );
};

export default OAuthCallback;
