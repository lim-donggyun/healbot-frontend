import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getAllHospitals, createHospital, updateHospital, deleteHospital, getHospitalDepartments } from '../../../utils/hospitalApi';
import './HospitalManagement.css';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [emergencyFilter, setEmergencyFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    hospitalId: '',
    hospitalName: '',
    address: '',
    hospitalGrade: '',
    hospitalType: '',
    details: '',
    operatingHours: '',
    lunchTime: '',
    emergencyYn: 'N',
    phone: '',
    erPhone: '',
    longitude: '',
    latitude: '',
    simpleMap: '',
    mainImage: '',
    websiteURL: '',
    nearbyDistricts: ''
  });

  const itemsPerPage = 5;

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const data = await getAllHospitals();
      setHospitals(data);
      setFilteredHospitals(data);
    } catch (error) {
      console.error('병원 목록 로딩 실패:', error);
      alert('병원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (keyword, type, emergency) => {
    let filtered = hospitals;

    // 키워드 필터링
    if (keyword.trim() !== '') {
      filtered = filtered.filter(hospital =>
        hospital.hospitalName?.toLowerCase().includes(keyword.toLowerCase()) ||
        hospital.hospitalId?.toLowerCase().includes(keyword.toLowerCase()) ||
        hospital.address?.toLowerCase().includes(keyword.toLowerCase()) ||
        hospital.phone?.includes(keyword)
      );
    }

    // 유형 필터링
    if (type !== 'ALL') {
      filtered = filtered.filter(hospital => hospital.hospitalType === type);
    }

    // 응급실 필터링
    if (emergency !== 'ALL') {
      filtered = filtered.filter(hospital => hospital.emergencyYn === emergency);
    }

    setFilteredHospitals(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    applyFilters(keyword, typeFilter, emergencyFilter);
  };

  const handleTypeFilter = (e) => {
    const type = e.target.value;
    setTypeFilter(type);
    applyFilters(searchKeyword, type, emergencyFilter);
  };

  const handleEmergencyFilter = (e) => {
    const emergency = e.target.value;
    setEmergencyFilter(emergency);
    applyFilters(searchKeyword, typeFilter, emergency);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateHospital(selectedHospital.hospitalId, formData);
        alert('병원 정보가 수정되었습니다.');
      } else {
        await createHospital(formData);
        alert('병원이 추가되었습니다.');
      }

      setIsModalOpen(false);
      resetForm();
      fetchHospitals();
    } catch (error) {
      console.error('병원 저장 실패:', error);
      alert(isEditMode ? '병원 수정에 실패했습니다.' : '병원 추가에 실패했습니다.');
    }
  };

  const handleDetail = async (hospital) => {
    setSelectedHospital(hospital);
    setIsDetailModalOpen(true);

    // 진료과 목록 조회
    try {
      console.log('진료과 조회 중... Hospital ID:', hospital.hospitalId);
      const depts = await getHospitalDepartments(hospital.hospitalId);
      console.log('진료과 응답:', depts);
      console.log('진료과 개수:', depts ? depts.length : 0);
      setDepartments(depts || []);
    } catch (error) {
      console.error('진료과 목록 조회 실패:', error);
      setDepartments([]);
    }
  };

  const handleEditFromDetail = () => {
    setFormData({
      hospitalId: selectedHospital.hospitalId || '',
      hospitalName: selectedHospital.hospitalName || '',
      address: selectedHospital.address || '',
      hospitalGrade: selectedHospital.hospitalGrade || '',
      hospitalType: selectedHospital.hospitalType || '',
      details: selectedHospital.details || '',
      operatingHours: selectedHospital.operatingHours || '',
      lunchTime: selectedHospital.lunchTime || '',
      emergencyYn: selectedHospital.emergencyYn || 'N',
      phone: selectedHospital.phone || '',
      erPhone: selectedHospital.erPhone || '',
      longitude: selectedHospital.longitude || '',
      latitude: selectedHospital.latitude || '',
      simpleMap: selectedHospital.simpleMap || '',
      mainImage: selectedHospital.mainImage || '',
      websiteURL: selectedHospital.websiteURL || '',
      nearbyDistricts: selectedHospital.nearbyDistricts || ''
    });
    setIsEditMode(true);
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteFromDetail = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteHospital(selectedHospital.hospitalId);
      alert('병원이 삭제되었습니다.');
      setIsDetailModalOpen(false);
      fetchHospitals();
    } catch (error) {
      console.error('병원 삭제 실패:', error);
      alert('병원 삭제에 실패했습니다.');
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      hospitalId: '',
      hospitalName: '',
      address: '',
      hospitalGrade: '',
      hospitalType: '',
      details: '',
      operatingHours: '',
      lunchTime: '',
      emergencyYn: 'N',
      phone: '',
      erPhone: '',
      longitude: '',
      latitude: '',
      simpleMap: '',
      mainImage: '',
      websiteURL: '',
      nearbyDistricts: ''
    });
    setSelectedHospital(null);
  };

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHospitals = filteredHospitals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 고유한 병원 유형 추출
  const hospitalTypes = ['ALL', ...new Set(hospitals.map(h => h.hospitalType).filter(Boolean))];

  // 페이지 번호 10개씩 그룹화
  const pageGroupSize = 10;
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
      <main className="admin-page">
        <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">데이터를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <Sidebar />
      <section className="admin-main">
        <div className="hospital-management">
          <div className="hospital-header">
            <h2>병원 관리</h2>
            <button className="add-hospital-btn" onClick={handleAddNew}>
              병원 추가
            </button>
          </div>

          <div className="hospital-search-filters">
            <input
              type="text"
              className="search-input"
              placeholder="병원 ID, 병원명, 주소, 전화번호로 검색..."
              value={searchKeyword}
              onChange={handleSearch}
            />

            <div className="filter-group">
              <select
                className="filter-select"
                value={typeFilter}
                onChange={handleTypeFilter}
              >
                <option value="ALL">전체 유형</option>
                {hospitalTypes.filter(type => type !== 'ALL').map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={emergencyFilter}
                onChange={handleEmergencyFilter}
              >
                <option value="ALL">전체 응급실</option>
                <option value="Y">응급실 있음</option>
                <option value="N">응급실 없음</option>
              </select>
            </div>
          </div>

          <div className="hospital-table-container">
            <table className="hospital-table">
              <thead>
                <tr>
                  <th>병원 ID</th>
                  <th>병원명</th>
                  <th>주소</th>
                  <th>등급</th>
                  <th>유형</th>
                  <th>응급실</th>
                  <th>전화번호</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {currentHospitals.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">등록된 병원이 없습니다.</td>
                  </tr>
                ) : (
                  currentHospitals.map(hospital => (
                    <tr key={hospital.hospitalId}>
                      <td>{hospital.hospitalId}</td>
                      <td>{hospital.hospitalName}</td>
                      <td>{hospital.address}</td>
                      <td>{hospital.hospitalGrade}</td>
                      <td>{hospital.hospitalType}</td>
                      <td>{hospital.emergencyYn === 'Y' ? '있음' : '없음'}</td>
                      <td>{hospital.phone}</td>
                      <td>
                        <button
                          className="detail-btn"
                          onClick={() => handleDetail(hospital)}
                        >
                          상세
                        </button>
                      </td>
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
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className="page-btn arrow-btn"
                title="첫 페이지"
              >
                ≪
              </button>

              <button
                onClick={goToPrevGroup}
                disabled={currentPageGroup === 1}
                className="page-btn arrow-btn"
                title="이전 10페이지"
              >
                ←
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`page-btn ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={goToNextGroup}
                disabled={endPage >= totalPages}
                className="page-btn arrow-btn"
                title="다음 10페이지"
              >
                →
              </button>

              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className="page-btn arrow-btn"
                title="마지막 페이지"
              >
                ≫
              </button>
            </div>
          )}
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{isEditMode ? '병원 정보 수정' : '병원 추가'}</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="hospital-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>병원 ID *</label>
                    <input
                      type="text"
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleInputChange}
                      required
                      disabled={isEditMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>병원명 *</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>주소 *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>병원 등급</label>
                    <input
                      type="text"
                      name="hospitalGrade"
                      value={formData.hospitalGrade}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>병원 유형</label>
                    <input
                      type="text"
                      name="hospitalType"
                      value={formData.hospitalType}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>전화번호</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>응급실 전화번호</label>
                    <input
                      type="text"
                      name="erPhone"
                      value={formData.erPhone}
                      onChange={handleInputChange}
                      placeholder="응급실 전화번호"
                    />
                  </div>

                  <div className="form-group">
                    <label>응급실 여부</label>
                    <select
                      name="emergencyYn"
                      value={formData.emergencyYn}
                      onChange={handleInputChange}
                    >
                      <option value="N">없음</option>
                      <option value="Y">있음</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>운영시간</label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={handleInputChange}
                      placeholder="예: 09:00-18:00"
                    />
                  </div>

                  <div className="form-group">
                    <label>점심시간</label>
                    <input
                      type="text"
                      name="lunchTime"
                      value={formData.lunchTime}
                      onChange={handleInputChange}
                      placeholder="예: 12:00-13:00"
                    />
                  </div>

                  <div className="form-group">
                    <label>경도</label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="예: 126.9780"
                    />
                  </div>

                  <div className="form-group">
                    <label>위도</label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="예: 37.5665"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>상세정보</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>간편지도 URL</label>
                    <input
                      type="text"
                      name="simpleMap"
                      value={formData.simpleMap}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>메인 이미지 URL</label>
                    <input
                      type="text"
                      name="mainImage"
                      value={formData.mainImage}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>웹사이트 URL</label>
                    <input
                      type="text"
                      name="websiteURL"
                      value={formData.websiteURL}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>인근 지역구</label>
                    <input
                      type="text"
                      name="nearbyDistricts"
                      value={formData.nearbyDistricts}
                      onChange={handleInputChange}
                      placeholder="예: 강남구, 서초구"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    {isEditMode ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 상세 모달 */}
        {isDetailModalOpen && selectedHospital && (
          <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
            <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>병원 상세 정보</h3>
                <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>×</button>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h4>기본 정보</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">병원 ID:</span>
                      <span className="detail-value">{selectedHospital.hospitalId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">병원명:</span>
                      <span className="detail-value">{selectedHospital.hospitalName}</span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">주소:</span>
                      <span className="detail-value">{selectedHospital.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">병원 등급:</span>
                      <span className="detail-value">{selectedHospital.hospitalGrade || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">병원 유형:</span>
                      <span className="detail-value">{selectedHospital.hospitalType || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">전화번호:</span>
                      <span className="detail-value">{selectedHospital.phone || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">응급실 전화:</span>
                      <span className="detail-value">{selectedHospital.erPhone || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">응급실:</span>
                      <span className="detail-value">{selectedHospital.emergencyYn === 'Y' ? '있음' : '없음'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">운영시간:</span>
                      <span className="detail-value">{selectedHospital.operatingHours || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">점심시간:</span>
                      <span className="detail-value">{selectedHospital.lunchTime || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>진료과 목록</h4>
                  <div className="departments-list">
                    {departments.length > 0 ? (
                      departments.map((dept, index) => (
                        <span key={index} className="department-tag">{dept}</span>
                      ))
                    ) : (
                      <p className="no-data">등록된 진료과가 없습니다.</p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>추가 정보</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">경도:</span>
                      <span className="detail-value">{selectedHospital.longitude || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">위도:</span>
                      <span className="detail-value">{selectedHospital.latitude || '-'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">웹사이트:</span>
                      <span className="detail-value">
                        {selectedHospital.websiteURL ? (
                          <a href={selectedHospital.websiteURL} target="_blank" rel="noopener noreferrer">
                            {selectedHospital.websiteURL}
                          </a>
                        ) : '-'}
                      </span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">상세정보:</span>
                      <span className="detail-value">{selectedHospital.details || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="edit-btn" onClick={handleEditFromDetail}>
                    수정
                  </button>
                  <button className="delete-btn" onClick={handleDeleteFromDetail}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default HospitalManagement;
