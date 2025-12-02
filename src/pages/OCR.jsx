// src/components/ocr/OCR.jsx
import React, { useState, useRef } from "react";
import "./OCR.css";

const OCR = ({ onVerified }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyMessage, setVerifyMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setExtractedText("");
    setError(null);
    setVerifyMessage("");
  };

  // OCR 호출 및 자동 인증
  const performOCR = async () => {
    if (!selectedImage) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVerifyMessage("");

    try {
      // Step 1: OCR 처리
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/ocr/receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR 처리 중 오류가 발생했습니다.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "OCR 처리 실패");
      }

      const data = result.data;
      let text = "";

      if (data.images && data.images[0] && data.images[0].fields) {
        text = data.images[0].fields
          .map((field) => field.inferText)
          .join("\n");
        setExtractedText(text);
      } else {
        throw new Error("텍스트를 추출할 수 없습니다.");
      }

      // Step 2: 자동으로 인증 진행
      const verifyRes = await fetch("/api/ocr/verifyReceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ocrText: text,
        }),
      });

      if (!verifyRes.ok) throw new Error("인증 요청 실패");

      const verifyData = await verifyRes.json();
      console.log("[OCR] verify result:", verifyData);

      if (!verifyData.verified) {
        setVerifyMessage(
          verifyData.message ||
            "영수증의 병원명/주소가 병원 정보와 일치하지 않습니다."
        );
        return;
      }

      setVerifyMessage("✅ 영수증 인증이 완료되었습니다.");
      if (onVerified) {
        onVerified({
          hospitalId: verifyData.hospitalId,
          hospitalName: verifyData.hospitalName,
          hospitalAddress: verifyData.hospitalAddress,
          image: selectedImage,
          text: text,
        });
      }
    } catch (err) {
      setError("인증 실패: " + err.message);
      console.error("OCR Error:", err);
      setExtractedText("");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setExtractedText("");
    setError(null);
    setVerifyMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="ocr-page">
      <div className="ocr-container">
        <div className="ocr-card">
          <h2 className="ocr-title">영수증 OCR 인증</h2>
          <p className="ocr-sub">
            병원 영수증을 업로드해 주세요. <br />
            인증 후에만 리뷰 작성이 가능합니다.
          </p>

          <div className="ocr-actions">
            <button
              className="ocr-btn ocr-btn-upload"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              영수증 이미지 선택
            </button>
            <button
              className="ocr-btn ocr-btn-reset"
              type="button"
              onClick={resetAll}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              초기화
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {previewUrl && (
            <div className="ocr-preview-section">
              <h3 className="ocr-section-title">선택된 이미지</h3>
              <div className="ocr-preview">
                <img src={previewUrl} alt="Selected" />
              </div>
              <button
                className="ocr-btn ocr-btn-process"
                type="button"
                onClick={performOCR}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ocr-spinner">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    인증 중...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    인증하기
                  </>
                )}
              </button>
            </div>
          )}

          {!previewUrl && (
            <div className="ocr-guide">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <p>병원 영수증 이미지를 업로드해주세요.</p>
              <p>지원 형식: JPG, PNG, JPEG</p>
            </div>
          )}

          {error && (
            <div className="ocr-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {verifyMessage && (
            <div className="ocr-verify-msg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {verifyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCR;
