import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import "./Profile.css";

// 프로필 수정 컴포넌트
const Profile = () => {
const navigate = useNavigate();
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [birthdate, setBirthdate] = useState("");
const [gender, setGender] = useState(""); // "M" | "F"
const [address, setAddress] = useState("");
const [detailAddress, setDetailAddress] = useState("");

// 간단한 검증 함수들
const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const validatePhoneFormat = (val) => /^010-\d{4}-\d{4}$/.test(val);

// Daum 주소 검색 스크립트 로드
useEffect(() => {
    const postcodeScriptId = "daum-postcode-script";
    if (!document.getElementById(postcodeScriptId)) {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.id = postcodeScriptId;
    document.head.appendChild(script);
    }
}, []);

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

        // 생년월일 형식 변환 (YYYY-MM-DD 형식으로)
        let formattedBirthdate = "";
        if (data.bornDate) {
        const dateStr = String(data.bornDate);
        if (dateStr.length === 8) {
            // YYYYMMDD 형식인 경우
            formattedBirthdate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        } else if (dateStr.includes('-') || dateStr.includes('.') || dateStr.includes('/')) {
            // 이미 구분자가 있는 경우 YYYY-MM-DD로 변환
            const cleaned = dateStr.replace(/[./]/g, '-');
            formattedBirthdate = cleaned.slice(0, 10);
        } else {
            formattedBirthdate = dateStr;
        }
        }
        setBirthdate(formattedBirthdate);

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

// 주소 검색
const handleAddressSearch = () => {
    if (!window.daum) {
    alert("주소 검색 서비스가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
    }

    new window.daum.Postcode({
    oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
        if (data.bname !== "") {
            extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
            extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setAddress(fullAddress);
    },
    }).open();
};

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
        address: detailAddress.trim() ? `${address} ${detailAddress}` : address,
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
    navigate('/mypage');
    } catch (err) {
    console.error("프로필 수정 오류:", err);
    alert("프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
    setSaving(false);
    }
};

if (loading) {
    return (
    <>
        <Header />
        <main className="profile-main">
        <div className="profile-container">
            <section className="mp-card">
            <h2 className="mp-card-title">프로필 수정</h2>
            <p>정보를 불러오는 중입니다...</p>
            </section>
        </div>
        </main>
        <Footer />
    </>
    );
}

return (
    <>
    <Header />
    <main className="profile-main">
        <div className="profile-container">
        <div className="profile-header">
            <h1 className="profile-title">프로필 수정</h1>
            <p className="profile-subtitle">회원님의 기본 정보를 수정할 수 있습니다.</p>
        </div>

        <section className="mp-card">

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
            placeholder="클릭하여 주소 검색"
            onClick={handleAddressSearch}
            readOnly
            style={{ cursor: "pointer" }}
        />
        </div>

        {/* 상세주소 */}
        <div className="mp-form-group mp-form-full">
        <label className="mp-label" htmlFor="pf-detail-address">
            상세주소
        </label>
        <input
            id="pf-detail-address"
            type="text"
            className="mp-input"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="상세 주소를 입력해주세요."
        />
        </div>

        {/* 버튼 영역 */}
        <div className="mp-btn-row">
        <button
            type="button"
            className="mp-btn mp-btn-ghost"
            onClick={() => navigate('/mypage')}
        >
            취소
        </button>
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
        </div>
    </main>
    <Footer />
    </>
);
};

export default Profile;