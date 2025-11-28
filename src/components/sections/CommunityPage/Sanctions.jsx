// components/sections/CommunityPage/Sanctions.jsx
import React, { useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "./Sanction.css";

const MOCK_RECEIVED = [
{
    sanctionId: 1,
    targetType: "POST",
    targetSummary: "병원 욕설이 포함된 게시글",
    reasonType: "INSULT",
    status: "COMPLETED",
    createdAt: "2025-11-20 13:24",
    processedAt: "2025-11-21 09:10",
    action: "게시글 숨김 처리",
},
{
    sanctionId: 2,
    targetType: "COMMENT",
    targetSummary: "과한 비속어 사용 댓글",
    reasonType: "ABUSE",
    status: "WARNING",
    createdAt: "2025-11-22 18:03",
    processedAt: "2025-11-22 18:05",
    action: "1회 경고",
},
];

const MOCK_REPORTED = [
{
    reportId: 10,
    targetType: "POST",
    targetSummary: "허위 진료 후기 의심 글",
    reasonType: "FALSE_INFO",
    result: "조치 완료",
    createdAt: "2025-11-19 11:02",
    processedAt: "2025-11-20 15:20",
},
{
    reportId: 11,
    targetType: "COMMENT",
    targetSummary: "개인정보 노출 댓글",
    reasonType: "PRIVACY",
    result: "삭제 처리",
    createdAt: "2025-11-21 08:15",
    processedAt: "2025-11-21 09:30",
},
];

const getTargetLabel = (type) => {
if (type === "POST") return "게시글";
if (type === "COMMENT") return "댓글";
return "기타";
};

const getReasonLabel = (reason) => {
switch (reason) {
    case "INSULT":
    return "욕설 및 비방";
    case "ABUSE":
    return "과도한 비속어";
    case "FALSE_INFO":
    return "허위 정보";
    case "PRIVACY":
    return "개인정보 노출";
    default:
    return "기타";
}
};

const getStatusBadge = (status) => {
switch (status) {
    case "COMPLETED":
    return { text: "조치 완료", className: "status-badge done" };
    case "WARNING":
    return { text: "경고", className: "status-badge warning" };
    case "PENDING":
    return { text: "검토중", className: "status-badge pending" };
    default:
    return { text: status || "기타", className: "status-badge" };
}
};

function Sanctions() {
const [activeTab, setActiveTab] = useState("received"); // received | reported

// 그냥 목 데이터 사용
const receivedList = MOCK_RECEIVED;
const reportedList = MOCK_REPORTED;

return (
    <>
    <Header />

    <main className="sanction-main">
        <div className="sanction-container">
        {/* 상단 타이틀 */}
        <section className="sanction-header">
            <div>
            <h1 className="sanction-title">제재 내역</h1>
            <p className="sanction-subtitle">
                내가 받은 제재와 내가 신고해서 처리된 내역을 확인할 수 있습니다.
            </p>
            <p className="sanction-mock-notice">
                (현재는 예시 데이터로만 표시되는 화면입니다.)
            </p>
            </div>
        </section>

        {/* 탭 */}
        <section className="sanction-tabs">
            <button
            type="button"
            className={`sanction-tab-btn ${
                activeTab === "received" ? "active" : ""
            }`}
            onClick={() => setActiveTab("received")}
            >
            내가 받은 제재
            </button>
            <button
            type="button"
            className={`sanction-tab-btn ${
                activeTab === "reported" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reported")}
            >
            내가 신고한 글과 댓글
            </button>
        </section>

        {/* 내용 카드 */}
        <section className="sanction-card">
            {activeTab === "received" && (
            <>
                {receivedList.length === 0 ? (
                <div className="sanction-empty">
                    아직 받은 제재 내역이 없습니다.
                </div>
                ) : (
                <div className="sanction-table-wrapper">
                    <table className="sanction-table">
                    <thead>
                        <tr>
                        <th style={{ width: "12%" }}>구분</th>
                        <th style={{ width: "28%" }}>대상 요약</th>
                        <th style={{ width: "18%" }}>사유</th>
                        <th style={{ width: "14%" }}>상태</th>
                        <th style={{ width: "14%" }}>발생 일시</th>
                        <th style={{ width: "14%" }}>조치 내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receivedList.map((s) => {
                        const badge = getStatusBadge(s.status);
                        return (
                            <tr key={s.sanctionId}>
                            <td>
                                <span className="target-pill">
                                {getTargetLabel(s.targetType)}
                                </span>
                            </td>
                            <td className="ellipsis-cell">
                                {s.targetSummary || "-"}
                            </td>
                            <td>{getReasonLabel(s.reasonType)}</td>
                            <td>
                                <span className={badge.className}>
                                {badge.text}
                                </span>
                            </td>
                            <td>
                                {s.createdAt || s.created_at || "-"}
                            </td>
                            <td>{s.action || "-"}</td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                )}
            </>
            )}

            {activeTab === "reported" && (
            <>
                {reportedList.length === 0 ? (
                <div className="sanction-empty">
                    아직 신고가 처리된 내역이 없습니다.
                </div>
                ) : (
                <div className="sanction-table-wrapper">
                    <table className="sanction-table">
                    <thead>
                        <tr>
                        <th style={{ width: "12%" }}>구분</th>
                        <th style={{ width: "30%" }}>신고 대상 요약</th>
                        <th style={{ width: "18%" }}>신고 사유</th>
                        <th style={{ width: "16%" }}>처리 결과</th>
                        <th style={{ width: "12%" }}>신고일</th>
                        <th style={{ width: "12%" }}>처리일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportedList.map((r) => (
                        <tr key={r.reportId}>
                            <td>
                            <span className="target-pill">
                                {getTargetLabel(r.targetType)}
                            </span>
                            </td>
                            <td className="ellipsis-cell">
                            {r.targetSummary || "-"}
                            </td>
                            <td>{getReasonLabel(r.reasonType)}</td>
                            <td>
                            <span className="status-badge done">
                                {r.result || "조치 완료"}
                            </span>
                            </td>
                            <td>{r.createdAt || r.created_at || "-"}</td>
                            <td>{r.processedAt || r.processed_at || "-"}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </>
            )}
        </section>
        </div>
    </main>

    <Footer />
    </>
);
}

export default Sanctions;
