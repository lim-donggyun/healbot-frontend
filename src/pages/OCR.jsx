// src/components/ocr/OCR.jsx
import React, { useState, useRef } from "react";
import "./OCR.css";

const OCR = ({ hospitalId, onVerified }) => {
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

  // OCR 호출 (이미지 → 텍스트)
  const performOCR = async () => {
    if (!selectedImage) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVerifyMessage("");

    try {
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

      if (data.images && data.images[0] && data.images[0].fields) {
        const text = data.images[0].fields
          .map((field) => field.inferText)
          .join("\n");
        setExtractedText(text);
      } else {
        setExtractedText("텍스트를 추출할 수 없습니다.");
      }
    } catch (err) {
      setError("OCR 처리 실패: " + err.message);
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

  // 영수증 텍스트로 병원 정보 인증
  const handleVerify = async () => {
    if (!extractedText || error) return;
    if (!hospitalId) {
      setError("병원 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setVerifyMessage("");

      const res = await fetch("/api/ocr/verifyReceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          ocrText: extractedText,
        }),
      });

      if (!res.ok) throw new Error("인증 요청 실패");

      const data = await res.json();

      if (!data.success || !data.verified) {
        setVerifyMessage(
          data.message || "영수증의 병원명/주소가 병원 정보와 일치하지 않습니다."
        );
        return;
      }

      setVerifyMessage("✅ 영수증 인증이 완료되었습니다.");
      if (onVerified) {
        onVerified({
          image: selectedImage,
          text: extractedText,
        });
      }
    } catch (e) {
      setError(e.message || "영수증 인증 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
              📁 영수증 이미지 선택
            </button>
            <button
              className="ocr-btn ocr-btn-reset"
              type="button"
              onClick={resetAll}
            >
              🔄 초기화
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
                {isLoading ? "⏳ 처리 중..." : "🔍 텍스트 추출"}
              </button>
            </div>
          )}

          {!previewUrl && (
            <div className="ocr-guide">
              <p>📄 병원 영수증 이미지를 업로드해주세요.</p>
              <p>지원 형식: JPG, PNG, JPEG</p>
            </div>
          )}

          {error && <div className="ocr-error">⚠️ {error}</div>}
          {verifyMessage && (
            <div className="ocr-verify-msg">{verifyMessage}</div>
          )}

          {extractedText && (
            <div className="ocr-result-section">
              <h3 className="ocr-section-title">추출된 텍스트</h3>
              <div className="ocr-result">
                {extractedText
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => (
                    <div key={idx} className="ocr-result-line">
                      {line}
                    </div>
                  ))}
              </div>

              <div className="ocr-result-actions">
                <button
                  className="ocr-btn ocr-btn-copy"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(extractedText);
                    alert("텍스트가 클립보드에 복사되었습니다!");
                  }}
                >
                  📋 텍스트 복사
                </button>
                <button
                  className="ocr-btn ocr-btn-confirm"
                  type="button"
                  onClick={handleVerify}
                  disabled={!!error || !extractedText || isLoading}
                >
                  ✅ 이 영수증으로 인증하고 리뷰 작성하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCR;
