// src/components/ocr/OCR.jsx
import React, { useState, useRef } from "react";
import "./OCR.css";

const OCR = ({ onVerified }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 파일 선택 처리
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  // 이미지 처리
  const processImage = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setExtractedText("");
    setError(null);
  };

  // 네이버 클로버 OCR API 호출
  const performOCR = async () => {
    if (!selectedImage) {
      setError("이미지를 먼저 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      // 백엔드 API 엔드포인트 호출
      const response = await fetch("/api/ocr/receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR 처리 중 오류가 발생했습니다.");
      }

      const result = await response.json();

      // 백엔드 응답 처리
      if (!result.success) {
        throw new Error(result.error || "OCR 처리 실패");
      }

      const data = result.data;

      // 추출된 텍스트 처리
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

  // 초기화
  const resetAll = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setExtractedText("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // OCR 인증 완료 → 상위로 전달
  const handleVerify = () => {
    if (!extractedText || error) return;
    if (onVerified) {
      onVerified({
        image: selectedImage,
        text: extractedText,
      });
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

          {/* 업로드 버튼 */}
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

          {/* 이미지 미리보기 + OCR 버튼 */}
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

          {/* 안내 메시지 (처음 상태) */}
          {!previewUrl && (
            <div className="ocr-guide">
              <p>📄 병원 영수증 이미지를 업로드해주세요.</p>
              <p>지원 형식: JPG, PNG, JPEG</p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && <div className="ocr-error">⚠️ {error}</div>}

          {/* 추출된 텍스트 */}
          {extractedText && (
            <div className="ocr-result-section">
              <h3 className="ocr-section-title">추출된 텍스트</h3>
              <div className="ocr-result">
                <pre>{extractedText}</pre>
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
                  disabled={!!error || !extractedText}
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
