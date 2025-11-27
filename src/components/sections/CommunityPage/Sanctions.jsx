// src/pages/Sanction.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "./Sanction.css";

const formatDate = (str) => {
if (!str) return "-";
const dateOnly = str.split("T")[0] || str;
return dateOnly.replace(/-/g, ".");
};

const getTargetLabel = (targetType) => {
if (targetType === "POST") return "게시글";
if (targetType === "COMMENT") return "댓글";
return "기타";
};

const getActionLabel = (actionType) => {
switch (actionType) {
    case "DELETE":
    return "삭제";
    case "WARNING":
    return "경고";
    case "BLOCK":
    return "이용 제한";
    default:
    return actionType || "-";
}
};

const getStatusLabel = (status) => {
switch (status) {
    case "PENDING":
    return "처리 중";
    case "DONE":
    case "COMPLETED":
    return "처리 완료";
    case "REJECTED":
    return "반려";
    default:
    return status || "-";
}
};

/** 🔹 화면 확인용 더미 데이터 */
const REPORTED_SANCTIONS_DEMO = [
{
    reportId: 1,
    targetType: "POST",
    targetTitle: "병원 후기를 가장한 광고 글",
    postId: 123,
    commentId: null,
    actionType: "DELETE",
    status: "DONE",
    processedAt: "2025-11-20T10:23:11",
    reasonType: "광고/상업성",
},
{
    reportId: 2,
    targetType: "COMMENT",
    targetTitle: "댓글 내용 일부 (욕설 포함)",
    postId: 124,
    commentId: 999,
    actionType: "WARNING",
    status: "DONE",
    processedAt: "2025-11-18T09:01:00",
    reasonType: "욕설/비방",
},
];

const MY_SANCTIONS_DEMO = [
{
    sanctionId: 10,
    targetType: "POST",
    targetTitle: "중복 게시물 안내",
    postId: 130,
    commentId: null,
    actionType: "WARNING",
    status: "DONE",
    createdAt: "2025-11-10T12:00:00",
    releasedAt: "2025-11-10T12:00:00",
},
{
    sanctionId: 11,
    targetType: "COMMENT",
    targetTitle: "부적절한 표현이 포함된 댓글",
    postId: 140,
    commentId: 2001,
    actionType: "DELETE",
    status: "DONE",
    createdAt: "2025-11-05T15:30:00",
    releasedAt: "2025-11-05T15:30:00",
},
];

const Sanction = () => {
const navigate = useNavigate();

const handleBackMyPage = () => {
    navigate("/mypage");
};

// 프론트 디자인만 보려고 하니까 바로 더미 데이터 사용
const reportedSanctions = REPORTED_SANCTIONS_DEMO;
const mySanctions = MY_SANCTIONS_DEMO;

return (
    <>
    <Header />
    <main className="sanction-main">
        <div className="sanction-container">
        {/* 상단 타이틀 */}
        <div className="sanction-header-row">
            <div>
            <h1 className="sanction-title">제재 내역</h1>
            <p className="sanction-subtitle">
                내가 신고한 내용의 처리 결과와, 커뮤니티 이용 중 받은 제재 내역을 확인할 수 있습니다.
            </p>
            </div>
            <button
            type="button"
            className="sanction-back-btn"
            onClick={handleBackMyPage}
            >
            마이페이지로
            </button>
        </div>

        {/* 내가 신고한 것 중 제재가 처리된 내역 */}
        <section className="sanction-card">
            <div className="sanction-card-header">
            <div>
                <h2 className="sanction-card-title">내가 신고한 내용의 처리 결과</h2>
                <p className="sanction-card-desc">
                내가 신고한 게시글·댓글 중 운영진이 제재를 결정한 내역만 표시됩니다.
                </p>
            </div>
            <span className="sanction-count-pill">
                총 {reportedSanctions.length}건
            </span>
            </div>

            {reportedSanctions.length === 0 ? (
            <div className="sanction-empty">
                <p>제재로 이어진 신고 내역이 없습니다.</p>
            </div>
            ) : (
            <div className="sanction-table-wrapper">
                <table className="sanction-table">
                <thead>
                    <tr>
                    <th style={{ width: "10%" }}>유형</th>
                    <th style={{ width: "32%" }}>대상</th>
                    <th style={{ width: "18%" }}>제재 조치</th>
                    <th style={{ width: "18%" }}>처리 상태</th>
                    <th style={{ width: "12%" }}>처리일</th>
                    <th style={{ width: "10%" }}>신고 사유</th>
                    </tr>
                </thead>
                <tbody>
                    {reportedSanctions.map((item) => (
                    <tr
                        key={
                        item.reportId ||
                        `${item.targetType}-${item.targetId}-${item.processedAt}`
                        }
                    >
                        <td>
                        <span className="sanction-badge">
                            {getTargetLabel(item.targetType)}
                        </span>
                        </td>
                        <td className="sanction-title-cell">
                        <div className="sanction-target-title">
                            {item.targetTitle || "(제목 없음 / 삭제됨)"}
                        </div>
                        <div className="sanction-meta-line">
                            ID:{" "}
                            {item.targetType === "POST"
                            ? item.postId
                            : item.commentId}
                        </div>
                        </td>
                        <td>
                        <span className="sanction-chip action">
                            {getActionLabel(item.actionType)}
                        </span>
                        </td>
                        <td>
                        <span className="sanction-chip status">
                            {getStatusLabel(item.status)}
                        </span>
                        </td>
                        <td>{formatDate(item.processedAt || item.createdAt)}</td>
                        <td>
                        <div className="sanction-reason">
                            {item.reasonType || "-"}
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </section>

        {/* 내가 제재를 받은 내역 */}
        <section className="sanction-card">
            <div className="sanction-card-header">
            <div>
                <h2 className="sanction-card-title">내가 받은 제재 내역</h2>
                <p className="sanction-card-desc">
                커뮤니티 이용 중 운영진으로부터 받은 경고, 삭제, 이용 제한 등의 내역입니다.
                </p>
            </div>
            <span className="sanction-count-pill">
                총 {mySanctions.length}건
            </span>
            </div>

            {mySanctions.length === 0 ? (
            <div className="sanction-empty">
                <p>현재까지 받은 제재 내역이 없습니다.</p>
            </div>
            ) : (
            <div className="sanction-table-wrapper">
                <table className="sanction-table">
                <thead>
                    <tr>
                    <th style={{ width: "10%" }}>유형</th>
                    <th style={{ width: "32%" }}>대상</th>
                    <th style={{ width: "15%" }}>제재 조치</th>
                    <th style={{ width: "15%" }}>상태</th>
                    <th style={{ width: "14%" }}>적용일</th>
                    <th style={{ width: "14%" }}>해제일</th>
                    </tr>
                </thead>
                <tbody>
                    {mySanctions.map((item) => (
                    <tr
                        key={
                        item.sanctionId ||
                        `${item.targetType}-${item.targetId}-${item.createdAt}`
                        }
                    >
                        <td>
                        <span className="sanction-badge">
                            {getTargetLabel(item.targetType)}
                        </span>
                        </td>
                        <td className="sanction-title-cell">
                        <div className="sanction-target-title">
                            {item.targetTitle || "(제목 없음 / 삭제됨)"}
                        </div>
                        <div className="sanction-meta-line">
                            ID:{" "}
                            {item.targetType === "POST"
                            ? item.postId
                            : item.commentId}
                        </div>
                        </td>
                        <td>
                        <span className="sanction-chip action">
                            {getActionLabel(item.actionType)}
                        </span>
                        </td>
                        <td>
                        <span className="sanction-chip status">
                            {getStatusLabel(item.status)}
                        </span>
                        </td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td>{formatDate(item.releasedAt)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </section>
        </div>
    </main>
    <Footer />
    </>
);
};

export default Sanction;
