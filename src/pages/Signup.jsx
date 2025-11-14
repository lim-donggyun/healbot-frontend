import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Step1 from "../components/sections/SignupPage/Step1";
import Step3 from "../components/sections/SignupPage/Step3";
import Step4 from "../components/sections/SignupPage/Step4";
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
          <Step3
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            socialId={socialId}
          />
        );
      case 3:
        return <Step4 formData={formData} />;
      default:
        return <Step1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
    }
  };

  return <div className="register-container">{renderStep()}</div>;
};

export default Signup;
