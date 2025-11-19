// src/components/sections/MyPage/DeleteAccount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";

const DeleteAccount = () => {
const navigate = useNavigate();
const [isAgree, setIsAgree] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAgree) {
    alert("안내 사항을 모두 확인하고 동의해 주세요.");
    return;
    }

    const ok = window.confirm(
    "정말로 회원을 탈퇴하시겠습니까?\n탈퇴 후에는 복구가 불가능합니다."
    );
    if (!ok) return;

    try {
    setIsSubmitting(true);

    const res = await fetch("/react/api/member/delete", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        // 필요하면 추가 파라미터 넣어서 사용
        body: JSON.stringify({}),
    });

    if (!res.ok) {
        alert("탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
    }

    const data = await res.json().catch(() => ({}));

    if (data.success === false) {
        alert(data.message || "탈퇴 처리에 실패했습니다.");
        return;
    }

    alert("회원 탈퇴가 완료되었습니다.");
    navigate("/");
    window.location.reload();
    } catch (err) {
    console.error("탈퇴 요청 오류:", err);
    alert("탈퇴 요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
    setIsSubmitting(false);
    }
};

const handleCancel = () => {
    navigate(-1); // 이전 페이지로
};

return (
    <>
    <Header />
    <section className="da-wrap">
    <form className="da-box" onSubmit={handleSubmit}>
        <h2 className="da-title">
        회원 탈퇴를 신청하기 전, 다음 내용을 꼭 확인해 주세요.
        </h2>

        <ul className="da-list">
        <li>
            고객 정보 및 개인형 서비스 이용 기록은 개인정보 처리 방침 기준에 따라
            삭제됩니다.
        </li>
        <li>
            보유하고 계신 적립금은 최근 정보에 등록된 계좌로 3~7 영업일 이내에 자동
            입금 처리됩니다.
        </li>
        <li>
            회원 탈퇴 후에는 동일 아이디 재사용이 제한될 수 있으며, 서비스 이용이
            불가능합니다.
        </li>
        </ul>

        <div className="da-check-row">
        <label className="da-check-label">
            <input
            type="checkbox"
            checked={isAgree}
            onChange={(e) => setIsAgree(e.target.checked)}
            />
            <span>안내 사항을 모두 확인하였으며, 이에 동의합니다.</span>
        </label>
        </div>

        <div className="da-btn-row">
        <button
            type="submit"
            className="da-btn da-btn-primary"
            disabled={isSubmitting}
        >
            {isSubmitting ? "처리 중..." : "회원 탈퇴하기"}
        </button>
        <button
            type="button"
            className="da-btn da-btn-secondary"
            onClick={handleCancel}
        >
            취소
        </button>
        </div>
    </form>
    </section>

    <Footer />
</>
);
};

export default DeleteAccount;
