import React, { useEffect, useState } from "react";
import "./ReportModal.css";

const REPORT_TYPES = [
{ key: "spam", label: "스팸/홍보 글이에요" },
{ key: "abuse", label: "욕설/비방/혐오 표현이에요" },
{ key: "personal", label: "개인정보 노출이에요" },
{ key: "false", label: "허위 정보 같아요" },
{ key: "etc", label: "기타 사유" },
];

function ReportModal({ open, targetType, onClose, onSubmit }) {
// targetType: 'POST' | 'COMMENT'
const [selectedType, setSelectedType] = useState(null);
const [detail, setDetail] = useState("");

useEffect(() => {
    if (open) {
    setSelectedType(null);
    setDetail("");
    }
}, [open]);

if (!open) return null;

const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType) {
    alert("신고 유형을 선택해 주세요.");
    return;
    }

    if (typeof onSubmit === "function") {
    onSubmit({
        reasonType: selectedType,
        detail: detail.trim(),
    });
    }
};

const title =
    targetType === "COMMENT" ? "댓글 신고하기" : "게시글 신고하기";

return (
    <div className="report-modal-backdrop" onClick={onClose}>
    <div
        className="report-modal"
        onClick={(e) => e.stopPropagation()}
    >
        <h3 className="report-modal-title">{title}</h3>
        <p className="report-modal-desc">
        신고 사유를 선택하고, 필요하다면 자세한 내용을 적어 주세요.
        </p>

        <form onSubmit={handleSubmit} className="report-modal-form">
        <div className="report-type-group">
            {REPORT_TYPES.map((rt) => (
            <button
                key={rt.key}
                type="button"
                className={
                "report-type-chip" +
                (selectedType === rt.key ? " active" : "")
                }
                onClick={() => setSelectedType(rt.key)}
            >
                {rt.label}
            </button>
            ))}
        </div>

        <label className="report-textarea-label">
            상세 내용 (선택)
            <textarea
            className="report-textarea"
            placeholder="신고 사유를 구체적으로 적어 주시면 검토에 도움이 됩니다."
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            />
        </label>

        <div className="report-modal-buttons">
            <button
            type="button"
            className="report-btn report-btn-secondary"
            onClick={onClose}
            >
            취소
            </button>
            <button
            type="submit"
            className="report-btn report-btn-primary"
            >
            신고하기
            </button>
        </div>
        </form>

        <p className="report-modal-notice">
        허위 신고일 경우, 서비스 이용에 제한이 생길 수 있습니다.
        </p>
    </div>
    </div>
);
}

export default ReportModal;