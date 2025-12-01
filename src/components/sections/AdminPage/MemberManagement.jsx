import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMembers, updateMember, deleteMember } from "../../../utils/adminApi";
import Sidebar from "./Sidebar";
import "../../../pages/MainPage.css";
import "./MemberManagement.css";

const MemberManagement = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
    detailAddress: "",
  });

  const rowsPerPage = 5;

  // 컴포넌트 마운트 시 회원 데이터 로드 및 스크립트 로드
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getAllMembers();

        // 백엔드 camelCase를 프론트엔드 대문자 형식으로 변환
        const convertedData = data
          .filter((member) => member.adminYn !== "Y") // 관리자 제외
          .map((member) => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT:
              member.createdDate || member.createdAt || member.createDate || member.registDate || member.joinDate,
            ADMIN_YN: member.adminYn,
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
      } catch (error) {
        console.error("회원 데이터 로드 실패:", error);
        alert("회원 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Load Daum Postcode script
    const postcodeScriptId = "daum-postcode-script";
    if (!document.getElementById(postcodeScriptId)) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.id = postcodeScriptId;
      document.head.appendChild(script);
    }
  }, []);

  // 유틸 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    // "2001.06.15 00:00:00" 형식 처리
    if (dateStr.includes(" ")) {
      const [datePart] = dateStr.split(" ");
      return datePart; // 이미 YYYY.MM.DD 형식
    }

    // "2024-11-18T12:30:45" 형식이나 "2024-11-18" 형식 처리
    const dateOnly = dateStr.split("T")[0];
    const [y, m, d] = dateOnly.split("-");
    return `${y}.${m}.${d}`;
  };

  const getLoginTypePill = (loginType) => {
    let label = "";
    let cls = "";

    switch (loginType) {
      case "normal":
        label = "일반";
        cls = "";
        break;
      case "kakao":
        label = "카카오";
        cls = "admin";
        break;
      case "naver":
        label = "네이버";
        cls = "doctor";
        break;
      default:
        label = loginType;
    }

    return (
      <span className={`role-pill ${cls}`}>
        <span className="role-dot"></span>
        {label}
      </span>
    );
  };


  // 필터 적용
  const applyFilter = () => {
    let filtered = members;

    // 키워드 필터링
    if (keyword.trim() !== "") {
      const keywordLower = keyword.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.USER_NAME?.toLowerCase().includes(keywordLower) ||
          m.MEMBER_ID?.toLowerCase().includes(keywordLower) ||
          m.EMAIL?.toLowerCase().includes(keywordLower) ||
          m.PHONE?.includes(keyword) ||
          m.ADDRESS?.toLowerCase().includes(keywordLower)
      );
    }

    // 로그인 타입 필터링
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((m) => m.LOGIN_TYPE === roleFilter);
    }

    // 성별 필터링
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((m) => m.GENDER === statusFilter);
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = (memberId) => {
    const member = members.find((m) => m.MEMBER_ID === memberId);
    if (member) {
      setSelectedMember(member);
      setIsDetailModalOpen(true);
      setIsEditMode(false);
    }
  };

  // 수정 모드로 전환
  const handleEditFromDetail = () => {
    setEditFormData({
      userName: selectedMember.USER_NAME,
      email: selectedMember.EMAIL,
      phone: selectedMember.PHONE,
      address: selectedMember.ADDRESS || "",
      detailAddress: "",
    });
    setIsEditMode(true);
  };

  // 수정 폼 입력 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

        setEditFormData((prev) => ({
          ...prev,
          address: fullAddress,
        }));
      },
    }).open();
  };

  // 수정 저장
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateMember(selectedMember.MEMBER_ID, editFormData);

      if (result.success) {
        alert("회원 정보가 수정되었습니다.");

        // 목록 새로고침
        const data = await getAllMembers();
        const convertedData = data
          .filter((member) => member.adminYn !== "Y")
          .map((member) => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT: member.createdDate,
            ADMIN_YN: member.adminYn,
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
        setIsDetailModalOpen(false);
        setIsEditMode(false);
      } else {
        alert("회원 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      alert("회원 정보 수정 중 오류가 발생했습니다.");
    }
  };

  // 회원 삭제 (상세 모달에서)
  const handleDeleteFromDetail = async () => {
    if (!selectedMember) return;

    const confirmed = window.confirm(`정말로 '${selectedMember.USER_NAME}' 회원을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const result = await deleteMember(selectedMember.MEMBER_ID);
      if (result.success) {
        alert("회원이 삭제되었습니다.");
        // 삭제 후 목록 새로고침
        const data = await getAllMembers();

        // 백엔드 camelCase를 프론트엔드 대문자 형식으로 변환
        const convertedData = data
          .filter((member) => member.adminYn !== "Y") // 관리자 제외
          .map((member) => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT: member.createdAt,
            ADMIN_YN: member.adminYn,
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
        setIsDetailModalOpen(false);
      } else {
        alert("회원 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 삭제 실패:", error);
      alert("회원 삭제 중 오류가 발생했습니다.");
    }
  };

  // 필터 변경 시 자동 적용
  useEffect(() => {
    applyFilter();
  }, [keyword, roleFilter, statusFilter]);

  // 페이징
  const total = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredMembers.slice(startIdx, endIdx);

  // 페이지 번호 5개씩 그룹화
  const pageGroupSize = 5;
  const currentPageGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentPageGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(currentPageGroup * pageGroupSize, totalPages);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const goToPrevGroup = () => {
    const prevGroupLastPage = (currentPageGroup - 2) * pageGroupSize + pageGroupSize;
    setCurrentPage(prevGroupLastPage);
  };

  const goToNextGroup = () => {
    const nextGroupFirstPage = currentPageGroup * pageGroupSize + 1;
    setCurrentPage(nextGroupFirstPage);
  };

  if (loading) {
    return (
      <main className="admin-page member-management-page">
        <Sidebar />
        <section className="admin-main">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              fontSize: "16px",
              color: "var(--muted)",
            }}>
            데이터를 불러오는 중...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page member-management-page">
      <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 회원 관리 */}
        <div className="member-management">
          <div className="member-header">
            <h2>
              검색된 회원 <span className="member-count">{filteredMembers.length}</span>명
            </h2>
          </div>

          <div className="member-search-filters">
            <div className="filter-group">
              <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="ALL">전체 로그인타입</option>
                <option value="normal">일반</option>
                <option value="kakao">카카오</option>
                <option value="naver">네이버</option>
              </select>

              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">전체 성별</option>
                <option value="M">남성</option>
                <option value="F">여성</option>
              </select>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="회원 ID, 이름, 이메일, 연락처, 주소로 검색..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                applyFilter();
              }}
            />
          </div>

          <div className="member-table-container">
            <table className="member-table">
              <thead>
                <tr>
                  <th>회원ID</th>
                  <th>로그인타입</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>연락처</th>
                  <th>생년월일</th>
                  <th>성별</th>
                  <th>주소</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      등록된 회원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((m) => (
                    <tr key={m.MEMBER_ID} onClick={() => handleDetailClick(m.MEMBER_ID)} style={{ cursor: "pointer" }}>
                      <td>{m.MEMBER_ID}</td>
                      <td>{getLoginTypePill(m.LOGIN_TYPE)}</td>
                      <td>{m.USER_NAME}</td>
                      <td>{m.EMAIL}</td>
                      <td>{m.PHONE}</td>
                      <td>{formatDate(m.BORN_DATE)}</td>
                      <td>{m.GENDER === "M" ? "남" : "여"}</td>
                      <td>{m.ADDRESS}</td>
                      <td>{formatDate(m.CREATED_AT)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(1)}
                className={`page-btn arrow-btn ${currentPage === 1 ? "disabled" : ""}`}
                disabled={currentPage === 1}
                title="첫 페이지">
                처음 페이지
              </button>

              <button
                onClick={goToPrevGroup}
                className={`page-btn arrow-btn ${currentPageGroup === 1 ? "disabled" : ""}`}
                disabled={currentPageGroup === 1}
                title="이전 5페이지">
                «
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`page-btn ${currentPage === number ? "active" : ""}`}>
                  {number}
                </button>
              ))}

              <button
                onClick={goToNextGroup}
                className={`page-btn arrow-btn ${endPage >= totalPages ? "disabled" : ""}`}
                disabled={endPage >= totalPages}
                title="다음 5페이지">
                »
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
                title="마지막 페이지">
                끝 페이지
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 회원 상세 모달 */}
      {isDetailModalOpen && selectedMember && (
        <div
          className="modal-overlay"
          onClick={() => {
            setIsDetailModalOpen(false);
            setIsEditMode(false);
          }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? "회원 정보 수정" : "회원 상세"}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsEditMode(false);
                }}>
                ✕
              </button>
            </div>

            {!isEditMode ? (
              /* 조회 모드 */
              <>
                <div className="modal-body">
                  <div className="detail-section">
                    <h4>기본 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">회원 ID</div>
                        <div className="detail-value">{selectedMember.MEMBER_ID}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">로그인 타입</div>
                        <div className="detail-value">{getLoginTypePill(selectedMember.LOGIN_TYPE)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">이름</div>
                        <div className="detail-value">{selectedMember.USER_NAME}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">성별</div>
                        <div className="detail-value">{selectedMember.GENDER === "M" ? "남성" : "여성"}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">생년월일</div>
                        <div className="detail-value">{formatDate(selectedMember.BORN_DATE)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">가입일</div>
                        <div className="detail-value">{formatDate(selectedMember.CREATED_AT)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section contact-info-section">
                    <h4>연락처 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-label">이메일</div>
                        <div className="detail-value">{selectedMember.EMAIL}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">연락처</div>
                        <div className="detail-value">{selectedMember.PHONE}</div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">주소</div>
                        <div className="detail-value">{selectedMember.ADDRESS}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="edit-btn" onClick={handleEditFromDetail}>
                    수정
                  </button>
                  <button className="delete-btn" onClick={handleDeleteFromDetail}>
                    삭제
                  </button>
                </div>
              </>
            ) : (
              /* 수정 모드 */
              <form onSubmit={handleUpdateSubmit} className="member-form">
                <div className="form-two-column">
                  <div className="form-column">
                    <div className="form-row">
                      <label>회원 ID *</label>
                      <input type="text" value={selectedMember.MEMBER_ID} disabled />
                    </div>

                    <div className="form-row">
                      <label>로그인 타입</label>
                      <input
                        type="text"
                        value={
                          selectedMember.LOGIN_TYPE === "normal"
                            ? "일반"
                            : selectedMember.LOGIN_TYPE === "kakao"
                            ? "카카오"
                            : "네이버"
                        }
                        disabled
                      />
                    </div>

                    <div className="form-row">
                      <label>성별</label>
                      <input type="text" value={selectedMember.GENDER === "M" ? "남성" : "여성"} disabled />
                    </div>

                    <div className="form-row">
                      <label>생년월일</label>
                      <input type="text" value={formatDate(selectedMember.BORN_DATE)} disabled />
                    </div>

                    <div className="form-row">
                      <label>가입일</label>
                      <input type="text" value={formatDate(selectedMember.CREATED_AT)} disabled />
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-row">
                      <label>이름 *</label>
                      <input
                        type="text"
                        name="userName"
                        value={editFormData.userName}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label>이메일 *</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label>연락처 *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label>주소 *</label>
                      <div className="address-input-group">
                        <input
                          type="text"
                          name="address"
                          value={editFormData.address}
                          onChange={handleEditInputChange}
                          required
                          readOnly
                          placeholder="클릭하여 주소 검색"
                          onClick={handleAddressSearch}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label>상세주소</label>
                      <input
                        type="text"
                        name="detailAddress"
                        value={editFormData.detailAddress}
                        onChange={handleEditInputChange}
                        placeholder="상세 주소 입력"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditMode(false)}>
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    수정
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MemberManagement;
