// src/components/sections/MyPage/DeleteAccount.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";

const DeleteAccount = () => {
const navigate = useNavigate();
const [password, setPassword] = useState("");
const [reason, setReason] = useState("");
const [isAgree, setIsAgree] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAgree) {
    alert("안내사항을 확인하고 동의해 주세요.");
    return;
    }

    if (!password.trim()) {
    alert("비밀번호를 입력해 주세요.");
    return;
    }

    const ok = window.confirm(
    "정말로 회원을 탈퇴하시겠습니까?\n탈퇴 후에는 복구가 불가능합니다."
    );
    if (!ok) return;

    try {
    setIsSubmitting(true);

    // 🔹 실제 회원 탈퇴 API 주소에 맞게 수정해서 사용
    const res = await fetch("/react/api/member/delete", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        password,
        reason,
        }),
    });

    if (!res.ok) {
        alert("탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return;
    }

    const data = await res.json().catch(() => ({}));

    // 백엔드 응답 형식에 맞게 성공 여부 처리 (예: { success: true })
    if (data.success === false) {
        alert(data.message || "비밀번호가 일치하지 않거나 탈퇴에 실패했습니다.");
        return;
    }

    alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
    // 세션 제거 후 메인으로 이동
    navigate("/");
    window.location.reload();
    } catch (err) {
    console.error("탈퇴 요청 오류:", err);
    alert("탈퇴 요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
    setIsSubmitting(false);
    }
};

return (
    <section className="mp-card mp-danger-card">
    <h2 className="mp-card-title mp-danger-title">회원 탈퇴</h2>
    <p className="mp-danger-desc">
        회원 탈퇴 시 작성하신 리뷰, 적립 포인트 등 계정과 연결된 정보가
        <strong> 복구 불가능하게 삭제</strong>될 수 있습니다.
        <br />
        탈퇴 전에 꼭 필요한 데이터는 미리 백업해 주세요.
    </p>

    <div className="mp-danger-box">
        <ul className="mp-danger-list">
        <li>탈퇴 후 동일 아이디로 재가입이 제한될 수 있습니다.</li>
        <li>법령에 따라 일부 정보는 일정 기간 보관될 수 있습니다.</li>
        <li>병원 리뷰 등 공개 게시물은 익명화 처리 후 남을 수 있습니다.</li>
        </ul>
    </div>

    <form className="mp-danger-form" onSubmit={handleSubmit}>
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="da-reason">
            탈퇴 사유 (선택)
        </label>
        <textarea
            id="da-reason"
            className="mp-textarea"
            rows={3}
            placeholder="서비스 이용이 불편했던 점이나 개선이 필요한 부분이 있다면 적어주세요."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
        />
        </div>

        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="da-password">
            비밀번호 확인 *
        </label>
        <input
            id="da-password"
            type="password"
            className="mp-input"
            placeholder="현재 비밀번호를 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
        />
        </div>

        <div className="mp-check-row">
        <label className="mp-check-label">
            <input
            type="checkbox"
            checked={isAgree}
            onChange={(e) => setIsAgree(e.target.checked)}
            />
            <span>
            위 안내사항을 모두 확인했으며, 계정 삭제에 동의합니다.
            </span>
        </label>
        </div>

        <div className="mp-btn-row">
        <button
            type="submit"
            className="mp-btn mp-btn-danger"
            disabled={isSubmitting}
        >
            {isSubmitting ? "처리 중..." : "정말 탈퇴하기"}
        </button>
        </div>
    </form>
    </section>
);
};

export default DeleteAccount;
