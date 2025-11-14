import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import Step1 from "../components/sections/SignupPage/Step1";
import Step2 from "../components/sections/SignupPage/Step2";
import Step3 from "../components/sections/SignupPage/Step3";
import "./Signup.css";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [socialId, setSocialId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 socialId 추출
    const params = new URLSearchParams(location.search);
    const socialIdParam = params.get("socialId");
    if (socialIdParam) {
      setSocialId(socialIdParam);
    }
  }, [location]);

  useEffect(() => {
    // 단계가 변경될 때마다 맨 위로 스크롤
    window.scrollTo(0, 0);
  }, [currentStep]);

  const [formData, setFormData] = useState({
    // Step1 - 약관동의
    terms1: false,
    terms2: false,
    terms3: false,
    // Step2 - 회원정보 입력 + 휴대폰 인증
    name: "",
    phone: "",
    verificationCode: "",
    userId: "",
    email: "",
    password: "",
    passwordConfirm: "",
    birthdate: "",
    age: "",
    gender: "",
    address: "",
  });

  const updateFormData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 2:
        return (
          <Step2
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            socialId={socialId}
          />
        );
      case 3:
        return <Step3 formData={formData} />;
      default:
        return <Step1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  return (
    <div className="signup-page-wrapper">
      <Header />
      {renderStep()}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Signup;
