import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../pages/MainPage.css';
import './MemberManagement.css';

// 더미 회원 데이터 (DB 컬럼 구조에 맞춤)
const initialMembers = [
  {
    MEMBER_ID: "kjh01",
    LOGIN_TYPE: "normal",
    USER_NAME: "김지훈",
    EMAIL: "kjh01@example.com",
    PHONE: "010-1234-5678",
    BORN_DATE: "1990-05-15",
    GENDER: "M",
    ADDRESS: "서울시 강남구",
    CREATED_AT: "2023-03-10",
  },
  {
    MEMBER_ID: "jieun",
    LOGIN_TYPE: "kakao",
    USER_NAME: "이지은",
    EMAIL: "jieun@example.com",
    PHONE: "010-2222-4444",
    BORN_DATE: "1992-08-20",
    GENDER: "F",
    ADDRESS: "서울시 서초구",
    CREATED_AT: "2022-07-21",
  },
  {
    MEMBER_ID: "admin",
    LOGIN_TYPE: "normal",
    USER_NAME: "관리자",
    EMAIL: "admin@guro-hosp.or.kr",
    PHONE: "02-0000-0000",
    BORN_DATE: "1985-01-01",
    GENDER: "M",
    ADDRESS: "서울시 구로구",
    CREATED_AT: "2020-01-02",
  },
  {
    MEMBER_ID: "psj90",
    LOGIN_TYPE: "naver",
    USER_NAME: "박수진",
    EMAIL: "psj90@example.com",
    PHONE: "010-8888-9999",
    BORN_DATE: "1990-12-10",
    GENDER: "F",
    ADDRESS: "경기도 성남시",
    CREATED_AT: "2021-12-01",
  },
  {
    MEMBER_ID: "jws",
    LOGIN_TYPE: "google",
    USER_NAME: "정우성",
    EMAIL: "jws@example.com",
    PHONE: "010-5555-6666",
    BORN_DATE: "1988-03-25",
    GENDER: "M",
    ADDRESS: "서울시 송파구",
    CREATED_AT: "2024-03-18",
  },
  {
    MEMBER_ID: "hjm",
    LOGIN_TYPE: "normal",
    USER_NAME: "한지민",
    EMAIL: "hjm@example.com",
    PHONE: "010-1010-0202",
    BORN_DATE: "1995-11-05",
    GENDER: "F",
    ADDRESS: "인천시 남동구",
    CREATED_AT: "2021-06-15",
  },
  {
    MEMBER_ID: "cms",
    LOGIN_TYPE: "kakao",
    USER_NAME: "최민수",
    EMAIL: "cms@example.com",
    PHONE: "010-3333-7777",
    BORN_DATE: "1987-09-09",
    GENDER: "M",
    ADDRESS: "부산시 해운대구",
    CREATED_AT: "2020-09-09",
  },
  {
    MEMBER_ID: "sylee",
    LOGIN_TYPE: "normal",
    USER_NAME: "이서연",
    EMAIL: "sylee@example.com",
    PHONE: "010-7777-1111",
    BORN_DATE: "1993-01-15",
    GENDER: "F",
    ADDRESS: "서울시 마포구",
    CREATED_AT: "2024-01-05",
  },
  {
    MEMBER_ID: "minaa",
    LOGIN_TYPE: "naver",
    USER_NAME: "김민아",
    EMAIL: "minaa@example.com",
    PHONE: "010-9999-2222",
    BORN_DATE: "1998-05-20",
    GENDER: "F",
    ADDRESS: "경기도 수원시",
    CREATED_AT: "2024-05-19",
  },
  {
    MEMBER_ID: "ohjh",
    LOGIN_TYPE: "google",
    USER_NAME: "오준호",
    EMAIL: "ohjh@example.com",
    PHONE: "010-4444-3333",
    BORN_DATE: "1991-10-30",
    GENDER: "M",
    ADDRESS: "대전시 유성구",
    CREATED_AT: "2023-10-01",
  },
];

const MemberManagement = () => {
  const navigate = useNavigate();
  const [members] = useState(initialMembers);
  const [filteredMembers, setFilteredMembers] = useState(initialMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const rowsPerPage = 6;

  // 유틸 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("-");
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

  // 상세보기 토글
  const handleDetailClick = (memberId) => {
    // 이미 열려있는 회원을 다시 클릭하면 닫기
    if (selectedMember?.MEMBER_ID === memberId && showDetail) {
      setShowDetail(false);
      setSelectedMember(null);
    } else {
      const member = members.find(m => m.MEMBER_ID === memberId);
      if (member) {
        setSelectedMember(member);
        setShowDetail(true);
      }
    }
  };

  // 회원 삭제
  const handleDeleteClick = (memberId) => {
    const member = members.find(m => m.MEMBER_ID === memberId);
    if (member) {
      alert("데모 페이지이므로 실제 삭제는 적용되지 않습니다.\n\n선택된 회원: " + member.USER_NAME);
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

  return (
      <main className="admin-page">
        {/* 사이드바 */}
        <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-avatar">AD</div>
          <div>
            <div className="admin-info-name">시스템 관리자</div>
            <div className="admin-info-role">전체 회원 / 권한 관리</div>
          </div>
        </div>
        <div className="admin-sidebar-sub">
          병원 서비스 회원의 가입 정보와 상태를
          한 화면에서 관리할 수 있습니다.
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-item" onClick={() => navigate('/admin-dashboard')}>
            <span className="icon">📊</span>
            <span>대시보드</span>
          </div>
          <div className="admin-nav-item active">
            <span className="icon">👥</span>
            <span>회원 관리</span>
          </div>
          <div className="admin-nav-item">
            <span className="icon">🩺</span>
            <span>의료진 계정</span>
          </div>
          <div className="admin-nav-item">
            <span className="icon">⚙️</span>
            <span>권한 · 설정</span>
          </div>
        </nav>
      </aside>

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
                    <React.Fragment key={m.MEMBER_ID}>
                      <tr>
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
                            {selectedMember?.MEMBER_ID === m.MEMBER_ID && showDetail ? '닫기' : '상세보기'}
                          </button>
                          <button
                            type="button"
                            className="btn-sm danger"
                            onClick={() => handleDeleteClick(m.MEMBER_ID)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                      {/* 상세 정보 확장 행 */}
                      {showDetail && selectedMember?.MEMBER_ID === m.MEMBER_ID && (
                        <tr>
                          <td colSpan="11" style={{ padding: 0, backgroundColor: '#f9fafb' }}>
                            <div className="detail-panel-inline">
                              <div className="detail-panel-header">
                                <div className="detail-panel-title">
                                  회원 상세 정보
                                </div>
                              </div>
                              <div style={{ marginBottom: '6px' }}>
                                <span className="badge-soft">회원ID : {selectedMember.MEMBER_ID}</span>
                              </div>
                              <div className="detail-grid">
                                <div className="detail-label">회원ID</div>
                                <div className="detail-value">{selectedMember.MEMBER_ID}</div>

                                <div className="detail-label">로그인타입</div>
                                <div className="detail-value">{getLoginTypePill(selectedMember.LOGIN_TYPE)}</div>

                                <div className="detail-label">이름</div>
                                <div className="detail-value">{selectedMember.USER_NAME}</div>

                                <div className="detail-label">이메일</div>
                                <div className="detail-value">{selectedMember.EMAIL}</div>

                                <div className="detail-label">연락처</div>
                                <div className="detail-value">{selectedMember.PHONE}</div>

                                <div className="detail-label">생년월일</div>
                                <div className="detail-value">{formatDate(selectedMember.BORN_DATE)}</div>

                                <div className="detail-label">성별</div>
                                <div className="detail-value">{selectedMember.GENDER === 'M' ? '남성' : '여성'}</div>

                                <div className="detail-label">주소</div>
                                <div className="detail-value">{selectedMember.ADDRESS}</div>

                                <div className="detail-label">가입일</div>
                                <div className="detail-value">{formatDate(selectedMember.CREATED_AT)}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
      </main>
  );
};

export default MemberManagement;
