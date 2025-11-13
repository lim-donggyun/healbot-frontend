import React, { useState } from "react";
import { searchSymptomsWithAI } from "../../utils/api";

function AIChatbotSearch({ onSymptomsFound }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!message.trim()) {
      setError("증상을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const symptoms = await searchSymptomsWithAI(message);
      onSymptomsFound(symptoms);
      setMessage("");
    } catch (err) {
      setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="ai-chatbot-section">
      <p className="search-method-title">③ 증상 설명이 어려우신가요?</p>
      <div className="ai-chatbot-container">
        <div className="ai-chatbot-header">
          <svg viewBox="0 0 24 24" className="ai-icon">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" x2="8" y1="16" y2="16" />
            <line x1="16" x2="16" y1="16" y2="16" />
          </svg>
          <span>AI 챗봇과 대화하기</span>
        </div>
        <div className="ai-chatbot-input-container">
          <input
            type="text"
            className="ai-chatbot-input"
            placeholder="예: 두통, 발열, 복통 등 증상을 말씀해주세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="ai-chatbot-search-btn"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "검색중..." : "검색"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default AIChatbotSearch;
