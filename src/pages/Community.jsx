// src/pages/Community.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./Community.css";

const MOCK_POSTS = [
{
    id: 1,
    category: "notice",
    title: "커뮤니티 오픈 안내",
    content: "HealBot 커뮤니티가 정식 오픈했습니다. 이용 안내를 꼭 확인해 주세요.",
    author: "운영자",
    createdAt: "2025-11-10",
    views: 123,
    tags: ["공지", "이벤트"],
},
{
    id: 2,
    category: "free",
    title: "야간 응급실 다녀온 후기 공유합니다",
    content:
    "어제 야간에 응급실 다녀왔는데, 예약/대기 시간 포함해서 경험을 정리해 봤어요.",
    author: "healing**",
    createdAt: "2025-11-18",
    views: 87,
    tags: ["응급실", "후기"],
},
{
    id: 3,
    category: "question",
    title: "위염 진단받았는데 식단 어떻게 관리해야 하나요?",
    content: "위염 진단받고 약 먹는 중인데, 무엇을 피해야 하는지 궁금합니다.",
    author: "mint***",
    createdAt: "2025-11-17",
    views: 154,
    tags: ["질문", "소화기내과"],
},
{
    id: 4,
    category: "review",
    title: "서울 ○○병원 내시경센터 솔직 후기",
    content:
    "내시경 받을 병원 찾다가 여기 이용해 봤는데, 대기 동선이랑 안내가 괜찮았어요.",
    author: "med***",
    createdAt: "2025-11-15",
    views: 64,
    tags: ["병원후기", "내시경"],
},
{
    id: 5,
    category: "free",
    title: "건강검진 전날 꿀팁 공유",
    content: "공복 유지할 때 덜 힘들게 하는 방법 몇 가지 공유합니다.",
    author: "check***",
    createdAt: "2025-11-14",
    views: 43,
    tags: ["건강검진", "팁"],
},
];

const CATEGORY_TABS = [
{ key: "all", label: "전체" },
{ key: "notice", label: "공지" },
{ key: "free", label: "자유게시판" },
{ key: "question", label: "질문게시판" },
{ key: "review", label: "후기게시판" },
];

function Community() {
const navigate = useNavigate();
const [activeCategory, setActiveCategory] = useState("all");
const [searchKeyword, setSearchKeyword] = useState("");

const filteredPosts = useMemo(() => {
    let list = [...MOCK_POSTS];

    if (activeCategory !== "all") {
    list = list.filter((p) => p.category === activeCategory);
    }

    if (searchKeyword.trim() !== "") {
    const kw = searchKeyword.trim().toLowerCase();
    list = list.filter(
        (p) =>
        p.title.toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw) ||
        p.author.toLowerCase().includes(kw)
    );
    }

    // 최신 글이 위로 오도록 정렬 (createdAt 기준, 간단 문자열 정렬)
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}, [activeCategory, searchKeyword]);

const handleWriteClick = () => {
    // 나중에 /community/write 만들면 여기 라우팅만 살리면 됨
    // navigate("/community/write");
    alert("글쓰기 페이지는 추후에 연결할 수 있게 남겨두었습니다.");
};

const handlePostClick = (postId) => {
    // 나중에 /community/:id 디테일 페이지로 연결
    // navigate(`/community/${postId}`);
    alert(`게시글 상세 페이지는 추후에 /community/${postId} 로 연결하면 됩니다.`);
};

return (
    <>
    <Header />

    <main className="community-main">
        <div className="community-container">
        {/* 상단 타이틀 */}
        <section className="community-header">
            <div className="community-title-wrap">
            <h1 className="community-title">커뮤니티</h1>
            <p className="community-subtitle">
                진료 경험, 건강 고민, 작은 팁까지 서로 편하게 나누는 공간입니다.
            </p>
            </div>

            <div className="community-actions">
            <div className="community-search">
                <input
                type="text"
                placeholder="제목, 내용, 작성자를 검색해 보세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button
                type="button"
                onClick={() => {}}
                className="community-search-btn"
                >
                <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                </svg>
                </button>
            </div>

            <button
                type="button"
                className="community-write-btn"
                onClick={handleWriteClick}
            >
                글쓰기
            </button>
            </div>
        </section>

        {/* 카테고리 탭 */}
        <section className="community-tabs">
            {CATEGORY_TABS.map((tab) => (
            <button
                key={tab.key}
                type="button"
                className={`community-tab-btn ${
                activeCategory === tab.key ? "active" : ""
                }`}
                onClick={() => setActiveCategory(tab.key)}
            >
                {tab.label}
            </button>
            ))}
        </section>

        {/* 게시글 리스트 */}
        <section className="community-list-section">
            {filteredPosts.length === 0 ? (
            <div className="community-empty">
                <p>아직 등록된 게시글이 없습니다.</p>
                <p>첫 번째 글의 주인공이 되어 보세요.</p>
            </div>
            ) : (
            <ul className="community-list">
                {filteredPosts.map((post) => (
                <li
                    key={post.id}
                    className={`community-card community-card-${
                    post.category === "notice" ? "notice" : "default"
                    }`}
                    onClick={() => handlePostClick(post.id)}
                >
                    <div className="community-card-header">
                    <div className="community-card-badge-wrap">
                        {post.category === "notice" && (
                        <span className="badge badge-notice">공지</span>
                        )}
                        {post.category === "question" && (
                        <span className="badge badge-question">질문</span>
                        )}
                        {post.category === "review" && (
                        <span className="badge badge-review">후기</span>
                        )}
                        {post.category === "free" && (
                        <span className="badge badge-free">자유</span>
                        )}
                    </div>
                    <h2 className="community-card-title">{post.title}</h2>
                    </div>

                    <p className="community-card-content">{post.content}</p>

                    <div className="community-card-footer">
                    <div className="community-meta-left">
                        <span className="community-author">
                        {post.author}
                        </span>
                        <span className="community-dot">·</span>
                        <span className="community-date">
                        {post.createdAt.replace(/-/g, ".")}
                        </span>
                    </div>
                    <div className="community-meta-right">
                        <span className="community-views">
                        조회 {post.views}
                        </span>
                    </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                    <div className="community-tags">
                        {post.tags.map((tag) => (
                        <span key={tag} className="community-tag">
                            #{tag}
                        </span>
                        ))}
                    </div>
                    )}
                </li>
                ))}
            </ul>
            )}
        </section>
        </div>
    </main>

    <Footer />
    </>
);
}

export default Community;
