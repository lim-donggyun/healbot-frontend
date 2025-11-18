import React, { useEffect, useState } from "react";
import "./Profile.css"; // 스타일은 나중에 손봐도 됨 (없어도 동작은 함)

// 프로필 수정 컴포넌트
const Profile = () => {
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [birthdate, setBirthdate] = useState("");
const [gender, setGender] = useState(""); // "M" | "F"
const [address, setAddress] = useState("");

// 간단한 검증 함수들
const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const validatePhoneFormat = (val) => /^010-\d{4}-\d{4}$/.test(val);

// 프로필 조회 (마운트 시 1번 호출)
useEffect(() => {
    const fetchProfile = async () => {
    try {
        // 🔹 실제 백엔드 API에 맞게 URL 수정
        const res = await fetch("/react/api/member/profile", {
        method: "GET",
        });

        if (!res.ok) {
        console.error("프로필 조회 실패:", res.status);
        setLoading(false);
        return;
        }

        const data = await res.json();

        // 🔹 백엔드에서 내려주는 필드명에 맞게 매핑
        setName(data.userName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBirthdate(data.bornDate || "");
        setGender(data.gender || "");
        setAddress(data.address || "");
    } catch (err) {
        console.error("프로필 조회 오류:", err);
    } finally {
        setLoading(false);
    }
    };

    fetchProfile();
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    // 검증
    if (!name.trim()) {
    alert("이름을 입력해주세요.");
    return;
    }

    if (!email.trim() || !validateEmail(email.trim())) {
    alert("올바른 이메일을 입력해주세요.");
    return;
    }

    if (!phone.trim() || !validatePhoneFormat(phone.trim())) {
    alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
    return;
    }

    if (!birthdate) {
    alert("생년월일을 입력해주세요.");
    return;
    }

    if (!gender) {
    alert("성별을 선택해주세요.");
    return;
    }

    if (!address.trim()) {
    alert("주소를 입력해주세요.");
    return;
    }

    // 저장 요청
    try {
    setSaving(true);

    // 🔹 실제 백엔드 API에 맞게 URL/메서드 수정 (예: PUT /api/member/profile)
    const res = await fetch("/react/api/member/profile", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        userName: name,
        email: email,
        phone: phone,
        bornDate: birthdate,
        gender: gender,
        address: address,
        }),
    });

    if (!res.ok) {
        alert("프로필 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    const data = await res.json().catch(() => ({}));

    // 🔹 백엔드 응답 형식에 맞춰 처리 (예: { success: true })
    if (data.success === false) {
        alert(data.message || "프로필 수정에 실패했습니다.");
        return;
    }

    alert("프로필 정보가 수정되었습니다.");
    } catch (err) {
    console.error("프로필 수정 오류:", err);
    alert("프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
    setSaving(false);
    }
};

if (loading) {
    return (
    <section className="mp-card">
        <h2 className="mp-card-title">프로필 수정</h2>
        <p>정보를 불러오는 중입니다...</p>
    </section>
    );
}

return (
    <section className="mp-card">
    <h2 className="mp-card-title">프로필 수정</h2>
    <p className="mp-sub-desc">
        회원님의 기본 정보를 수정할 수 있습니다.
    </p>

    <form className="mp-form" onSubmit={handleSubmit}>
        {/* 이름 */}
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="pf-name">
            이름 *
        </label>
        <input
            id="pf-name"
            type="text"
            className="mp-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
        />
        </div>

        {/* 이메일 */}
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="pf-email">
            이메일 *
        </label>
        <input
            id="pf-email"
            type="email"
            className="mp-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
        />
        </div>

        {/* 전화번호 */}
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="pf-phone">
            전화번호 * <span className="mp-label-hint">(010-0000-0000)</span>
        </label>
        <input
            id="pf-phone"
            type="text"
            className="mp-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
        />
        </div>

        {/* 생년월일 */}
        <div className="mp-form-group mp-form-half">
        <label className="mp-label" htmlFor="pf-birth">
            생년월일 *
        </label>
        <input
            id="pf-birth"
            type="date"
            className="mp-input"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
        />
        </div>

        {/* 성별 */}
        <div className="mp-form-group mp-form-half">
        <label className="mp-label">성별 *</label>
        <div className="mp-gender-row">
            <label className="mp-radio-label">
            <input
                type="radio"
                name="pf-gender"
                value="M"
                checked={gender === "M"}
                onChange={(e) => setGender(e.target.value)}
            />
            <span>남자</span>
            </label>
            <label className="mp-radio-label">
            <input
                type="radio"
                name="pf-gender"
                value="F"
                checked={gender === "F"}
                onChange={(e) => setGender(e.target.value)}
            />
            <span>여자</span>
            </label>
        </div>
        </div>

        {/* 주소 */}
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="pf-address">
            주소 *
        </label>
        <input
            id="pf-address"
            type="text"
            className="mp-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="기본 주소를 입력해주세요."
        />
        </div>

        {/* 버튼 영역 */}
        <div className="mp-btn-row">
        {/* 필요하면 취소 버튼에 onClick으로 마이페이지로 돌아가게 처리 */}
        {/* <button type="button" className="mp-btn mp-btn-ghost" onClick={() => window.history.back()}>
            취소
        </button> */}
        <button
            type="submit"
            className="mp-btn mp-btn-primary"
            disabled={saving}
        >
            {saving ? "저장 중..." : "정보 저장하기"}
        </button>
        </div>
    </form>
    </section>
);
};

export default Profile;