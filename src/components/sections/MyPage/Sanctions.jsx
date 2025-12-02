// components/sections/CommunityPage/Sanctions.jsx
import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "./Sanction.css";

const getTargetLabel = (type) => {
  if (type === "POST") return "게시글";
  if (type === "COMMENT") return "댓글";
  return "기타";
};

const getReasonLabel = (reason) => {
  switch (reason) {
    case "spam":
      return "스팸/광고";
    case "abuse":
      return "욕설/비방";
    case "personal":
      return "개인정보 노출";
    case "FALSE":
      return "허위 정보";
    case "etc":
      return "기타";
    default:
      return reason || "기타";
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
  const [receivedList, setReceivedList] = useState([]);
  const [reportedList, setReportedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // 내가 제재받은 내역
        const res1 = await fetch("/react/api/community/my-sanctions/received", { method: "GET" });
        if (res1.status === 401) {
          alert("로그인이 필요합니다.");
          return;
        }
        if (!res1.ok) throw new Error("내가 받은 제재 내역을 불러오지 못했습니다.");
        const data1 = await res1.json();

        // 내가 신고한 내역
        const res2 = await fetch("/react/api/community/my-sanctions/reported", { method: "GET" });
        if (res2.status === 401) {
          alert("로그인이 필요합니다.");
          return;
        }
        if (!res2.ok) throw new Error("내가 신고한 내역을 불러오지 못했습니다.");
        const data2 = await res2.json();

        // 백엔드 DTO -> 화면용 필드 맞추기
        setReceivedList(
          (Array.isArray(data1) ? data1 : []).map((r) => ({
            sanctionId: r.reportId,
            targetType: r.targetType,
            targetSummary: r.targetSummary,
            reasonType: r.reasonType,
            status: r.status,
            createdAt: r.createdAt,
            action: r.penaltyReason, // PENALTY_REASON → 조치 내용
          }))
        );

        setReportedList(
          (Array.isArray(data2) ? data2 : []).map((r) => ({
            reportId: r.reportId,
            targetType: r.targetType,
            targetSummary: r.targetSummary,
            reasonType: r.reasonType,
            createdAt: r.createdAt,
            processedAt: r.createdAt, // 별도 처리일 컬럼 없으면 일단 신고일과 동일
            result: r.penaltyReason || r.status, // 결과 표시
          }))
        );
      } catch (e) {
        console.error("제재/신고 내역 조회 오류:", e);
        setErrorMsg(e.message || "제재 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <Header />

      <main className="sanction-main">
        <div className="sanction-container">
          {/* 상단 타이틀 */}
          <section className="sanction-header">
            <div>
              <h1 className="sanction-title">제재 내역</h1>
              <p className="sanction-subtitle">내가 받은 제재와 내가 신고해서 처리된 내역을 확인할 수 있습니다.</p>
            </div>
          </section>

          {/* 탭 */}
          <section className="sanction-tabs">
            <button
              type="button"
              className={`sanction-tab-btn ${activeTab === "received" ? "active" : ""}`}
              onClick={() => setActiveTab("received")}>
              내가 받은 제재
            </button>
            <button
              type="button"
              className={`sanction-tab-btn ${activeTab === "reported" ? "active" : ""}`}
              onClick={() => setActiveTab("reported")}>
              내가 신고한 글과 댓글
            </button>
          </section>

          <section className="sanction-card">
            {loading && <div className="sanction-empty">내역을 불러오는 중입니다…</div>}
            {errorMsg && !loading && <div className="sanction-empty">{errorMsg}</div>}

            {!loading && !errorMsg && activeTab === "received" && (
              <>
                {receivedList.length === 0 ? (
                  <div className="sanction-empty">아직 받은 제재 내역이 없습니다.</div>
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
                                <span className="target-pill">{getTargetLabel(s.targetType)}</span>
                              </td>
                              <td className="ellipsis-cell">{s.targetSummary || "-"}</td>
                              <td>{getReasonLabel(s.reasonType)}</td>
                              <td>
                                <span className={badge.className}>{badge.text}</span>
                              </td>
                              <td>{s.createdAt || "-"}</td>
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

            {!loading && !errorMsg && activeTab === "reported" && (
              <>
                {reportedList.length === 0 ? (
                  <div className="sanction-empty">아직 신고가 처리된 내역이 없습니다.</div>
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
                              <span className="target-pill">{getTargetLabel(r.targetType)}</span>
                            </td>
                            <td className="ellipsis-cell">{r.targetSummary || "-"}</td>
                            <td>{getReasonLabel(r.reasonType)}</td>
                            <td>
                              <span className="status-badge done">{r.result || "조치 완료"}</span>
                            </td>
                            <td>{r.createdAt || "-"}</td>
                            <td>{r.processedAt || "-"}</td>
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
