import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import { socialLogin, normalLogin, checkSession } from '../utils/memberApi';
import KakaoIcon from '../assets/icons/KakaoIcon';
import NaverIcon from '../assets/icons/NaverIcon';
import './MainPage.css';
import './LoginPage.css';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [socialType, setSocialType] = useState('');
    const [oauthPopup, setOauthPopup] = useState(null);
    const [showSignupChoice, setShowSignupChoice] = useState(false);
    const [socialId, setSocialId] = useState('');
    const isProcessingRef = useRef(false);
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
    const REDIRECT_URI = `${import.meta.env.VITE_FRONTEND_URL}${import.meta.env.VITE_OAUTH_REDIRECT_PATH}`;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // 에러 메시지 초기화

        // 입력 검증
        const isIdEmpty = !memberId.trim();
        const isPasswordEmpty = !password.trim();

        if (isIdEmpty && isPasswordEmpty) {
            setErrorMessage('아이디 비밀번호를 입력해주세요.');
            return;
        } else if (isIdEmpty) {
            setErrorMessage('아이디를 입력해주세요.');
            return;
        } else if (isPasswordEmpty) {
            setErrorMessage('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const data = await normalLogin(memberId, password);

            if (data.success === 1) {
                // 로그인 성공 - alert 없이 바로 이동
                // 세션 확인하여 관리자 여부 체크
                const sessionData = await checkSession();
                if (sessionData.loggedIn && sessionData.admin_YN === 'Y') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            } else {
                // 로그인 실패 - 화면에 에러 메시지 표시
                setErrorMessage('아이디 또는 비밀번호가 틀렸습니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            setErrorMessage('아이디 또는 비밀번호가 틀렸습니다.');
        }
    };

    useEffect(() => {
        // OAuth 콜백 메시지 수신 리스너
        const handleMessage = (event) => {
            // 보안: origin 확인
            if (event.origin !== window.location.origin) return;

            const { type, code } = event.data;

            if (type && code && !isProcessingRef.current) {
                isProcessingRef.current = true;

                // 팝업 닫기
                if (oauthPopup && !oauthPopup.closed) {
                    oauthPopup.close();
                }

                // 백엔드 API 호출
                setModalMessage('로그인 처리 중입니다...');
                callBackendAPI(type, code);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [oauthPopup]);

    const callBackendAPI = async (type, code) => {
        try {
            const data = await socialLogin(type, code);
            console.log('백엔드 응답:', data);

            if (data.success === 1) {
                // 로그인 성공
                setModalMessage('로그인 성공!');

                // 세션 확인하여 관리자 여부 체크
                setTimeout(async () => {
                    const sessionData = await checkSession();
                    setShowModal(false);
                    isProcessingRef.current = false;

                    if (sessionData.loggedIn && sessionData.admin_YN === 'Y') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            } else {
                // 회원가입 필요
                setModalMessage('');
                setShowSignupChoice(true);
                setSocialId(data.socialId);
            }
        } catch (error) {
            console.error('에러:', error);
            setModalMessage('로그인 처리 중 오류가 발생했습니다.');

            // 3초 후 모달 닫기
            setTimeout(() => {
                setShowModal(false);
                isProcessingRef.current = false;
            }, 3000);
        }
    };

    const loginKakao = () => {
        // 디버깅: 사용하는 정보 출력
        console.log('=== 카카오 로그인 정보 ===');
        console.log('Client ID:', KAKAO_CLIENT_ID);
        console.log('Redirect URI:', REDIRECT_URI);

        // 모달 표시
        setShowModal(true);
        setModalMessage('카카오 로그인 창을 열고 있습니다...');
        setSocialType('kakao');

        // 팝업 창 설정
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        console.log('카카오 인증 URL:', kakaoAuthUrl);

        const popup = window.open(
            kakaoAuthUrl,
            'kakao_login',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        setOauthPopup(popup);

        // 팝업이 닫히면 모달도 닫기
        const checkPopup = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(checkPopup);
                setShowModal(false);
                setModalMessage('');
            }
        }, 500);
    };

    const loginNaver = () => {
        // 모달 표시
        setShowModal(true);
        setModalMessage('네이버 로그인 창을 열고 있습니다...');
        setSocialType('naver');

        // 팝업 창 설정
        const width = 500;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const state = Math.random().toString(36).substring(2, 15);
        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${state}`;

        const popup = window.open(
            naverAuthUrl,
            'naver_login',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        setOauthPopup(popup);

        // 팝업이 닫히면 모달도 닫기
        const checkPopup = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(checkPopup);
                setShowModal(false);
                setModalMessage('');
            }
        }, 500);
    };


    return (
        <div className="login-page-wrapper">
            <Header />

            {/* 로그인 페이지 컨텐츠 */}
            <div className="page">
                <h1 className="login-title">로그인</h1>
                <p className="login-subtitle">HealBot 로그인 페이지 입니다.</p>

                <div className="login-wrapper">
                    {/* 좌측 로그인 폼 */}
                    <div className="login-left">
                        {errorMessage && (
                            <div className="login-error-message">
                                {errorMessage}
                            </div>
                        )}

                        <form className="login-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="아이디를 입력해주세요."
                                value={memberId}
                                onChange={(e) => {
                                    setMemberId(e.target.value);
                                    setErrorMessage('');
                                }}
                            />

                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="login-input"
                                    placeholder="비밀번호를 입력해주세요."
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage('');
                                    }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                >
                                    👁
                                </button>
                            </div>

                            <button type="submit" className="login-submit">로그인</button>

                            <div className="social-login">
                                <button type="button" className="social-btn kakao-btn" onClick={loginKakao}>
                                    <KakaoIcon size={20} /> 카카오
                                </button>
                                <button type="button" className="social-btn naver-btn" onClick={loginNaver}>
                                    <NaverIcon size={20} /> 네이버
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 우측 도움말 */}
                    <div className="login-right">
                        <div className="help-section">
                            <h3 className="help-title">아이디 또는 비밀번호를 잊어버리셨나요?</h3>
                            <div className="help-buttons">
                                <button className="help-btn" onClick={() => navigate('/find-account')}>계정 찾기</button>
                            </div>
                        </div>

                        <div className="help-section">
                            <h3 className="help-title">아직 회원가입을 하지 않으셨나요?</h3>
                            <p className="help-text">회원가입을 통해 홈페이지에서 제공하는 온라인 서비스를 이용해보세요.</p>
                            <button className="signup-btn" onClick={() => navigate('/signup')}>회원가입</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollToTop />

            {/* 로그인 처리 모달 */}
            {showModal && (
                <div className="oauth-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="oauth-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="oauth-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        <div className="oauth-modal-content">
                            <div className="oauth-spinner"></div>
                            <div className="oauth-message">{modalMessage}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* 회원가입 선택 모달 */}
            {showSignupChoice && (
                <div className="oauth-modal-overlay" onClick={() => {
                    setShowSignupChoice(false);
                    setShowModal(false);
                    isProcessingRef.current = false;
                }}>
                    <div className="oauth-modal signup-choice-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="oauth-modal-close" onClick={() => {
                            setShowSignupChoice(false);
                            setShowModal(false);
                            isProcessingRef.current = false;
                        }}>✕</button>
                        <div className="oauth-modal-content">
                            <h2 className="signup-choice-title">가입되지 않은 계정입니다</h2>
                            <p className="signup-choice-text">
                                해당 소셜 계정으로 회원가입을 진행하시겠습니까?
                            </p>
                            <div className="signup-choice-buttons">
                                <button
                                    className="signup-choice-btn signup-yes-btn"
                                    onClick={() => {
                                        setShowSignupChoice(false);
                                        setShowModal(false);
                                        isProcessingRef.current = false;
                                        navigate(`/signup?socialId=${encodeURIComponent(socialId)}`);
                                    }}
                                >
                                    회원가입하기
                                </button>
                                <button
                                    className="signup-choice-btn signup-no-btn"
                                    onClick={() => {
                                        setShowSignupChoice(false);
                                        setShowModal(false);
                                        isProcessingRef.current = false;
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;