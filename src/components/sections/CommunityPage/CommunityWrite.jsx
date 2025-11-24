// src/pages/CommunityWrite.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSession } from "../../../utils/memberApi";
import "./CommunityWrite.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const CATEGORY_OPTIONS = [
{ key: "free", label: "자유게시판" },
{ key: "question", label: "질문게시판" },
{ key: "review", label: "후기게시판" },
];

function CommunityWrite() {
const navigate = useNavigate();
const [category, setCategory] = useState("free");
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

// 로그인 체크
useEffect(() => {
    const verify = async () => {
    try {
        const data = await checkSession();
        if (!data.loggedIn) {
        alert("로그인 후 이용 가능한 서비스입니다.");
        navigate("/login");
        }
    } catch (e) {
        console.error("세션 확인 실패:", e);
        alert("로그인 확인 중 오류가 발생했습니다.");
        navigate("/login");
    }
    };
    verify();
}, [navigate]);

const handleCancel = () => {
    if (!window.confirm("작성 내용을 취소하시겠습니까?")) return;
    navigate("/community");
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
    alert("제목을 입력해 주세요.");
    return;
    }
    if (!content.trim()) {
    alert("내용을 입력해 주세요.");
    return;
    }

    if (!window.confirm("이 내용으로 게시글을 등록하시겠습니까?")) return;

    try {
    setIsSubmitting(true);

    const payload = {
        category,
        title: title.trim(),
        content: content.trim(),
    };

    // 🔥 반드시 이렇게 바꿔야 함!!
    const res = await fetch("/react/api/community/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    });

    if (!res.ok) {
        alert("게시글 등록 중 오류가 발생했습니다.");
        return;
    }

    const postId = await res.json();

    alert("게시글이 등록되었습니다.");
    navigate("/community");

    } catch (err) {
    console.error("글쓰기 요청 오류:", err);
    alert("게시글 등록 중 오류가 발생했습니다.");
    } finally {
    setIsSubmitting(false);
    }
};

return (
    <>
    <Header />
    <main className="community-write-main">
        <div className="community-write-container">
        <section className="community-write-header">
            <h1 className="community-write-title">글쓰기</h1>
            <p className="community-write-subtitle">
            진료 경험, 건강 고민, 작은 팁까지 서로 편하게 나누어 보세요.<br/>
            서비스의 투명성을 유지하고 기록의 일관성을 위해 게시물 수정은 지원되지 않습니다.
            게시물을 삭제하신 후 다시 작성해 주시기 바랍니다.
            </p>
        </section>

        <article className="community-write-card">
            <div className="cw-row">
            <label className="cw-label">게시판</label>
            <div className="cw-category-group">
                {CATEGORY_OPTIONS.map((opt) => (
                <button
                    key={opt.key}
                    type="button"
                    className={`cw-category-btn ${
                    category === opt.key ? "active" : ""
                    }`}
                    onClick={() => setCategory(opt.key)}
                >
                    {opt.label}
                </button>
                ))}
            </div>
            </div>

            <div className="cw-row">
            <label className="cw-label">제목</label>
            <input
                className="cw-input"
                placeholder="제목을 입력해 주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div>

            <div className="cw-row">
            <label className="cw-label">내용</label>
            <textarea
                className="cw-textarea"
                placeholder="내용을 입력해 주세요"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="cw-help-text">
                의료기관·개인 실명 언급 및 비방성 내용은 삭제될 수 있습니다.
            </div>
            </div>

            <div className="cw-footer">
            <button
                type="button"
                className="cw-btn cw-btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
            >
                취소
            </button>
            <button
                type="button"
                className="cw-btn cw-btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "등록 중..." : "등록하기"}
            </button>
            </div>
        </article>
        </div>
    </main>
    <Footer />
    </>
);
}

export default CommunityWrite;
