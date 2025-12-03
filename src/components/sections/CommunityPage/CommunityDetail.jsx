// components/sections/CommunityPage/CommunityDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CommunityDetail.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import ReportModal from "./ReportModal";

const getCategoryLabel = (category) => {
  switch (category) {
    case "notice":
      return "공지";
    case "free":
      return "자유";
    case "question":
      return "질문";
    case "review":
      return "후기";
    default:
      return "기타";
  }
};

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // 🔥 신고 모달 상태
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  // reportTarget: { type: 'POST' | 'COMMENT', id: number }

  // React StrictMode 방지용
  const fetchedPostRef = useRef(false);

  // ===== 게시글 상세 조회 =====
  useEffect(() => {
    if (fetchedPostRef.current) return;
    fetchedPostRef.current = true;

    const fetchPost = async () => {
      try {
        setPostLoading(true);
        setPostError(null);

        const res = await fetch(`/react/api/community/posts/${postId}`, {
          method: "GET",
        });

        if (!res.ok) {
          if (res.status === 404) {
            setPost(null);
            setPostError("NOT_FOUND");
            return;
          }
          throw new Error("게시글을 불러오지 못했습니다.");
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("게시글 상세 조회 오류:", err);
        setPostError(err.message || "오류가 발생했습니다.");
      } finally {
        setPostLoading(false);
      }
    };

    if (!Number.isNaN(postId)) {
      fetchPost();
    }
  }, [postId]);

  // ===== 댓글 목록 조회 =====
  const loadComments = async () => {
    try {
      setCommentLoading(true);
      setCommentError(null);

      const res = await fetch(`/react/api/community/posts/${postId}/comments`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("댓글을 불러오지 못했습니다.");
      }

      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("댓글 목록 조회 오류:", err);
      setCommentError(err.message || "오류가 발생했습니다.");
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isNaN(postId)) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleBackToList = () => {
    navigate("/community");
  };

  // ===== 댓글 작성 =====
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      setSubmitLoading(true);

      const res = await fetch(`/react/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (res.status === 401) {
        alert("로그인이 필요한 기능입니다.");
        return;
      }

      if (!res.ok) {
        throw new Error("댓글 등록에 실패했습니다.");
      }

      setCommentText("");
      await loadComments();
    } catch (err) {
      console.error("댓글 등록 오류:", err);
      alert(err.message || "댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ===== 신고 모달 열기 (게시글/댓글 공용) =====
  const openPostReport = () => {
    setReportTarget({ type: "POST", id: postId });
    setIsReportOpen(true);
  };

  const openCommentReport = (commentId) => {
    setReportTarget({ type: "COMMENT", id: commentId });
    setIsReportOpen(true);
  };

  // ===== 신고 실제 요청 =====
  const handleReportSubmit = async ({ reasonType, detail }) => {
    if (!reportTarget) return;

    try {
      let url = "";
      if (reportTarget.type === "POST") {
        url = `/react/api/community/posts/${reportTarget.id}/report`;
      } else if (reportTarget.type === "COMMENT") {
        url = `/react/api/community/comments/${reportTarget.id}/report`;
      } else {
        throw new Error("잘못된 신고 대상입니다.");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasonType, detail }),
      });

      if (res.status === 401) {
        alert("로그인이 필요한 기능입니다.");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "신고 처리에 실패했습니다.");
      }

      alert("신고가 접수되었습니다. 감사합니다.");
      setIsReportOpen(false);
    } catch (e) {
      console.error("신고 오류:", e);
      alert(e.message || "신고 중 오류가 발생했습니다.");
    }
  };

  // ---- 렌더링 ----

  if (postError === "NOT_FOUND") {
    return (
      <div className="review-page-wrapper">
        <Header />
        <main className="community-detail-main">
          <div className="community-detail-wrapper">
            <div className="community-detail-card">
              <div className="community-detail-empty">
                <h2>게시글을 찾을 수 없습니다.</h2>
                <p>삭제되었거나 주소가 잘못되었을 수 있습니다.</p>
                <button type="button" onClick={handleBackToList}>
                  목록으로
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (postLoading || !post) {
    return (
      <div className="review-page-wrapper">
        <Header />
        <main className="community-detail-main">
          <div className="community-detail-wrapper">
            <div className="community-detail-card">
              <div className="community-detail-empty">
                <p>게시글을 불러오는 중입니다…</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="review-page-wrapper">
      <Header />
      <main className="community-detail-main">
        <div className="community-detail-wrapper">
          {/* 흰색 카드 한 장 */}
          <article className="community-detail-card">
            {/* 상단 메타 */}
            <section className="cd-header">
              <div className="cd-meta-top">
                <span className={`cd-badge cd-badge-${post.category}`}>{getCategoryLabel(post.category)}</span>
                <span className="cd-meta-dot">·</span>
                <span className="cd-meta-author">{post.memberId}</span>
                <span className="cd-meta-dot">·</span>
                <span className="cd-meta-date">{(post.createdAt || "").replace(/-/g, ".")}</span>
                <span className="cd-meta-dot">·</span>
                <span className="cd-meta-views">조회 {post.views}</span>
              </div>
              <h1 className="cd-title">{post.title}</h1>
            </section>

            {/* 본문 */}
            <section className="cd-body">
              {(post.content || "").split("\n").map((line, idx) => (
                <p key={idx} className="cd-content-line">
                  {line}
                </p>
              ))}
            </section>

            {/* 댓글 섹션 */}
            <section className="cd-comment-section">
              <h2 className="cd-comment-title">댓글 {comments.length}</h2>
              <p className="cd-comment-guide">의료기관/개인을 비방하거나 개인정보가 포함된 글은 제재될 수 있습니다.</p>

              <form className="cd-comment-form" onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="내용을 입력해 주세요."
                />
                <div className="cd-comment-form-bottom">
                  <span className="cd-comment-hint">로그인한 계정으로 등록됩니다.</span>
                  <button
                    type="submit"
                    className="cd-btn cd-btn-primary"
                    disabled={!commentText.trim() || submitLoading}>
                    {submitLoading ? "등록 중..." : "댓글 등록"}
                  </button>
                </div>
              </form>

              {commentError && (
                <div className="cd-comment-error">
                  <p>{commentError}</p>
                </div>
              )}

              {commentLoading && (
                <div className="cd-comment-loading">
                  <p>댓글을 불러오는 중입니다…</p>
                </div>
              )}

              <ul className="cd-comment-list">
                {comments.map((c) => (
                  <li key={c.commentId} className="cd-comment-item">
                    <div className="cd-comment-meta">
                      <span className="cd-comment-author">{c.memberId}</span>
                      <span className="cd-meta-dot">·</span>
                      <span className="cd-comment-date">{(c.createdAt || "").replace(/-/g, ".")}</span>

                      {/* 🔥 댓글 신고 버튼 */}
                      <button
                        type="button"
                        className="cd-comment-report-btn"
                        onClick={() => openCommentReport(c.commentId)}>
                        신고
                      </button>
                    </div>
                    <p className="cd-comment-content">{c.content}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 하단 버튼 */}
            <section className="cd-footer">
              <button type="button" className="cd-btn cd-btn-secondary" onClick={handleBackToList}>
                목록으로
              </button>
              <div className="cd-footer-spacer" />
              <button type="button" className="cd-btn cd-btn-outline" onClick={openPostReport}>
                신고
              </button>
            </section>
          </article>

          {/* 신고 모달 (게시글 / 댓글 공용) */}
          <ReportModal
            open={isReportOpen}
            targetType={reportTarget?.type || "POST"}
            onClose={() => setIsReportOpen(false)}
            onSubmit={handleReportSubmit}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CommunityDetail;
