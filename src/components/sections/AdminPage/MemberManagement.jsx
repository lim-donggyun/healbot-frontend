import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMembers, updateMember, deleteMember } from '../../../utils/adminApi';
import Sidebar from './Sidebar';
import '../../../pages/MainPage.css';
import './MemberManagement.css';

const MemberManagement = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    address: ''
  });

  const rowsPerPage = 6;

  // 컴포넌트 마운트 시 회원 데이터 로드
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await getAllMembers();

        // 백엔드 camelCase를 프론트엔드 대문자 형식으로 변환
        const convertedData = data
          .filter(member => member.adminYn !== 'Y') // 관리자 제외
          .map(member => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT: member.createdDate,
            ADMIN_YN: member.adminYn
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
      } catch (error) {
        console.error('회원 데이터 로드 실패:', error);
        alert('회원 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
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

    switch(loginType) {
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
      case "google":
        label = "구글";
        cls = "nurse";
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

  // 통계 계산
  const stats = {
    total: members.length,
    normal: members.filter(m => m.LOGIN_TYPE === "normal").length,
    kakao: members.filter(m => m.LOGIN_TYPE === "kakao").length,
    naver: members.filter(m => m.LOGIN_TYPE === "naver").length,
    google: members.filter(m => m.LOGIN_TYPE === "google").length,
  };

  // 필터 적용
  const applyFilter = () => {
    const filtered = members.filter((m) => {
      const keywordLower = keyword.trim().toLowerCase();
      const textMatch =
        !keywordLower ||
        m.USER_NAME.toLowerCase().includes(keywordLower) ||
        m.MEMBER_ID.toLowerCase().includes(keywordLower) ||
        m.EMAIL.toLowerCase().includes(keywordLower) ||
        m.PHONE.replace(/-/g, "").includes(keywordLower.replace(/-/g, "")) ||
        m.ADDRESS.toLowerCase().includes(keywordLower);

      const roleMatch = roleFilter === "ALL" || m.LOGIN_TYPE === roleFilter;
      const statusMatch = statusFilter === "ALL" || m.GENDER === statusFilter;

      return textMatch && roleMatch && statusMatch;
    });

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setKeyword('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setFilteredMembers(members);
    setCurrentPage(1);
  };

  // 상세보기 모달 열기
  const handleDetailClick = (memberId) => {
    const member = members.find(m => m.MEMBER_ID === memberId);
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
      address: selectedMember.ADDRESS
    });
    setIsEditMode(true);
  };

  // 수정 폼 입력 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 저장
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateMember(selectedMember.MEMBER_ID, editFormData);

      if (result.success) {
        alert('회원 정보가 수정되었습니다.');

        // 목록 새로고침
        const data = await getAllMembers();
        const convertedData = data
          .filter(member => member.adminYn !== 'Y')
          .map(member => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT: member.createdDate,
            ADMIN_YN: member.adminYn
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
        setIsDetailModalOpen(false);
        setIsEditMode(false);
      } else {
        alert('회원 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정 중 오류가 발생했습니다.');
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
        alert('회원이 삭제되었습니다.');
        // 삭제 후 목록 새로고침
        const data = await getAllMembers();

        // 백엔드 camelCase를 프론트엔드 대문자 형식으로 변환
        const convertedData = data
          .filter(member => member.adminYn !== 'Y') // 관리자 제외
          .map(member => ({
            MEMBER_ID: member.memberId,
            LOGIN_TYPE: member.loginType,
            USER_NAME: member.userName,
            EMAIL: member.email,
            PHONE: member.phone,
            BORN_DATE: member.bornDate,
            GENDER: member.gender,
            ADDRESS: member.address,
            CREATED_AT: member.createdDate,
            ADMIN_YN: member.adminYn
          }));

        setMembers(convertedData);
        setFilteredMembers(convertedData);
        setIsDetailModalOpen(false);
      } else {
        alert('회원 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      alert('회원 삭제 중 오류가 발생했습니다.');
    }
  };

  // 엔터키 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilter();
    }
  };

  // 필터 변경 시 자동 적용
  useEffect(() => {
    applyFilter();
  }, [roleFilter, statusFilter]);

  // 페이징
  const total = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, total);
  const pageItems = filteredMembers.slice(startIdx, endIdx);

  const renderPagination = () => {
    const pages = [];
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);

    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(p)}
        >
          {p}
        </button>
      );
    }

    return (
      <>
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          ‹
        </button>
        {pages}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          ›
        </button>
      </>
    );
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          fontSize: '16px',
          color: 'var(--muted)'
        }}>
          데이터를 불러오는 중...
        </div>
      </main>
    );
  }

  return (
      <main className="admin-page">
        <Sidebar />

      {/* 메인 */}
      <section className="admin-main">
        {/* 통계 카드 */}
        <section className="admin-stats">
          <article className="stat-card">
            <div className="stat-label">전체 회원 수</div>
            <div className="stat-main">
              <div className="stat-value">{stats.total}</div>
              <span className="stat-chip">+{stats.newToday} 오늘 가입</span>
              <div className="stat-icon">👥</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">정상 · 이용 중</div>
            <div className="stat-main">
              <div className="stat-value">{stats.active}</div>
              <span className="stat-chip">서비스 이용 중</span>
              <div className="stat-icon">✅</div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">휴면 · 탈퇴 계정</div>
            <div className="stat-main">
              <div className="stat-value">{stats.inactive}</div>
              <span className="stat-chip warning">재활성 검토 필요</span>
              <div className="stat-icon">⚠️</div>
            </div>
          </article>
        </section>

        {/* 검색 / 필터 카드 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">검색 및 필터</div>
              <div className="admin-card-sub">
                이름, 회원ID, 이메일, 연락처, 주소로 검색하거나 로그인 타입 · 성별을 선택해 결과를 좁혀볼 수 있습니다.
              </div>
            </div>
            <button type="button" className="btn-outline btn" onClick={handleReset}>
              초기화
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="filter-grid">
              <div className="form-group">
                <label className="form-label">통합 검색</label>
                <input
                  type="text"
                  className="input"
                  placeholder="이름 / 아이디 / 이메일 / 연락처"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="form-group">
                <label className="form-label">로그인 타입</label>
                <select
                  className="select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="normal">일반</option>
                  <option value="kakao">카카오</option>
                  <option value="naver">네이버</option>
                  <option value="google">구글</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">성별</label>
                <select
                  className="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
              <div className="filter-actions">
                <button className="btn" type="button" onClick={applyFilter}>
                  🔍 검색
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* 회원 목록 카드 */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">
                회원 목록
                <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '4px' }}>
                  ({total}명)
                </span>
              </div>
              <div className="admin-card-sub">
                가입일 기준으로 정렬됩니다. 상세보기에서 개별 회원의 모든 정보를 확인할 수 있습니다.
              </div>
            </div>
            <span className="admin-badge-muted">
              로그인 타입별, 성별 필터 기능 제공
            </span>
          </div>

          <div className="table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '48px' }}>No</th>
                    <th>회원ID</th>
                    <th>로그인타입</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>연락처</th>
                    <th>생년월일</th>
                    <th>성별</th>
                    <th>주소</th>
                    <th>가입일</th>
                    <th className="text-center" style={{ width: '140px' }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((m, idx) => (
                    <tr key={m.MEMBER_ID}>
                      <td className="text-center">{startIdx + idx + 1}</td>
                      <td>{m.MEMBER_ID}</td>
                      <td>{getLoginTypePill(m.LOGIN_TYPE)}</td>
                      <td>{m.USER_NAME}</td>
                      <td>{m.EMAIL}</td>
                      <td>{m.PHONE}</td>
                      <td>{formatDate(m.BORN_DATE)}</td>
                      <td className="text-center">{m.GENDER === 'M' ? '남' : '여'}</td>
                      <td>{m.ADDRESS}</td>
                      <td>{formatDate(m.CREATED_AT)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn-sm primary"
                          onClick={() => handleDetailClick(m.MEMBER_ID)}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <div>
                <span>
                  {total === 0 ? '0명 중 0–0명' : `${total}명 중 ${startIdx + 1}–${endIdx}명`}
                </span>
              </div>
              <div className="pagination">
                {renderPagination()}
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* 회원 상세 모달 */}
      {isDetailModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={() => {
          setIsDetailModalOpen(false);
          setIsEditMode(false);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? '회원 정보 수정' : '회원 상세'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsEditMode(false);
                }}
              >
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
                        <div className="detail-value">{selectedMember.GENDER === 'M' ? '남성' : '여성'}</div>
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

                  <div className="detail-section">
                    <h4>연락처 정보</h4>
                    <div className="detail-grid">
                      <div className="detail-item full-width">
                        <div className="detail-label">이메일</div>
                        <div className="detail-value">{selectedMember.EMAIL}</div>
                      </div>
                      <div className="detail-item full-width">
                        <div className="detail-label">연락처</div>
                        <div className="detail-value">{selectedMember.PHONE}</div>
                      </div>
                      <div className="detail-item full-width">
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
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="detail-section">
                    <h4>기본 정보 (읽기 전용)</h4>
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
                        <div className="detail-label">성별</div>
                        <div className="detail-value">{selectedMember.GENDER === 'M' ? '남성' : '여성'}</div>
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

                  <div className="detail-section">
                    <h4>수정 가능 정보</h4>
                    <div className="form-group">
                      <label className="form-label">이름</label>
                      <input
                        type="text"
                        className="input"
                        name="userName"
                        value={editFormData.userName}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">이메일</label>
                      <input
                        type="email"
                        className="input"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">연락처</label>
                      <input
                        type="tel"
                        className="input"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">주소</label>
                      <input
                        type="text"
                        className="input"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEditMode(false)}
                  >
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    저장
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
