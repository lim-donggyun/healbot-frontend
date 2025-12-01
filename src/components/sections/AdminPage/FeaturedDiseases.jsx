import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DepartmentsModal from './DepartmentsModal';
import SymptomsModal from './SymptomsModal';
import {
  getAllDiseases,
  getFeaturedDiseases,
  addFeaturedDisease,
  removeFeaturedDisease,
  updateFeaturedDiseasesOrder,
  getDiseaseByName,
  addDisease,
  updateDisease,
  deleteDisease
} from '../../../utils/diseasesApi';
import { symptomsByBodyPart } from '../../../data/symptomsData';
import './FeaturedDiseases.css';

const FeaturedDiseases = () => {
  const [allDiseases, setAllDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [featuredDiseases, setFeaturedDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isSymptomsModalOpen, setIsSymptomsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newDisease, setNewDisease] = useState({
    질환명: '',
    진료과: '',
    설명: '',
    이미지: '',
    전체증상목록: '',
    환자수: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let featuredData = [];
      let popularData = null;

      try {
        featuredData = await getFeaturedDiseases();
      } catch (error) {
        console.error('유행 질병 목록 조회 실패:', error);
        featuredData = [];
      }

      try {
        const allDiseasesData = await getAllDiseases();
        if (allDiseasesData.success && allDiseasesData.data) {
          setAllDiseases(allDiseasesData.data);
          setFilteredDiseases(allDiseasesData.data);
        }
      } catch (error) {
        console.error('질병 정보 조회 실패:', error);
      }

      setFeaturedDiseases(featuredData);

    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === '') {
      setFilteredDiseases(allDiseases);
    } else {
      const filtered = allDiseases.filter((disease) =>
        disease.질환명?.toLowerCase().includes(keyword.toLowerCase()) ||
        disease.진료과?.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredDiseases(filtered);
    }
    setCurrentPage(1);
  };

  const handleDetail = async (disease) => {
    try {
      const detailData = await getDiseaseByName(disease.질환명);
      setSelectedDisease(detailData);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('질병 상세 정보 조회 실패:', error);
      alert('질병 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  // 유행하는 질병 관리
  const handleAddToFeatured = async (diseaseName) => {
    if (featuredDiseases.length >= 4) {
      alert('최대 4개까지만 선택할 수 있습니다.');
      return;
    }

    if (featuredDiseases.some(d => d.diseaseName === diseaseName)) {
      alert('이미 추가된 질병입니다.');
      return;
    }

    try {
      const result = await addFeaturedDisease(diseaseName);
      if (result.success) {
        await fetchData();
        alert('유행하는 질병에 추가되었습니다.');
      } else {
        alert(result.message || '추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('유행 질병 추가 실패:', error);
      alert('추가에 실패했습니다.');
    }
  };

  const handleRemoveFromFeatured = async (diseaseNo) => {
    if (!window.confirm('유행하는 질병에서 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await removeFeaturedDisease(diseaseNo);
      if (result.success) {
        await fetchData();
        alert('삭제되었습니다.');
      } else {
        alert(result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('유행 질병 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;

    const newList = [...featuredDiseases];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];

    // displayOrder 업데이트
    const updatedList = newList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    // API에는 필요한 필드만 전송
    const orderUpdateData = updatedList.map(item => ({
      featuredDiseasesNo: item.featuredDiseasesNo,
      displayOrder: item.displayOrder
    }));

    try {
      await updateFeaturedDiseasesOrder(orderUpdateData);
      setFeaturedDiseases(updatedList);
    } catch (error) {
      console.error('순서 변경 실패:', error);
      alert('순서 변경에 실패했습니다.');
    }
  };

  const handleMoveDown = async (index) => {
    if (index === featuredDiseases.length - 1) return;

    const newList = [...featuredDiseases];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];

    // displayOrder 업데이트
    const updatedList = newList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    // API에는 필요한 필드만 전송
    const orderUpdateData = updatedList.map(item => ({
      featuredDiseasesNo: item.featuredDiseasesNo,
      displayOrder: item.displayOrder
    }));

    try {
      await updateFeaturedDiseasesOrder(orderUpdateData);
      setFeaturedDiseases(updatedList);
    } catch (error) {
      console.error('순서 변경 실패:', error);
      alert('순서 변경에 실패했습니다.');
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newList = [...featuredDiseases];
    const draggedItem = newList[draggedIndex];

    // 드래그한 항목 제거
    newList.splice(draggedIndex, 1);
    // 드롭 위치에 삽입
    newList.splice(dropIndex, 0, draggedItem);

    // displayOrder 업데이트
    const updatedList = newList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    // API에는 필요한 필드만 전송
    const orderUpdateData = updatedList.map(item => ({
      featuredDiseasesNo: item.featuredDiseasesNo,
      displayOrder: item.displayOrder
    }));

    try {
      await updateFeaturedDiseasesOrder(orderUpdateData);
      setFeaturedDiseases(updatedList);
    } catch (error) {
      console.error('순서 변경 실패:', error);
      alert('순서 변경에 실패했습니다.');
    } finally {
      setDraggedIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // 질환 추가 모달 관련
  const handleAddDiseaseClick = () => {
    setNewDisease({
      질환명: '',
      진료과: '',
      설명: '',
      이미지: '',
      전체증상목록: '',
      환자수: ''
    });
    setImageFile(null);
    setImagePreview('');
    setIsAddModalOpen(true);
  };

  const handleAddDiseaseSubmit = async () => {
    if (!newDisease.질환명) {
      alert('질환명은 필수 입력 항목입니다.');
      return;
    }

    try {
      const result = await addDisease(
        newDisease.질환명,
        newDisease.설명 || '',
        imageFile
      );

      if (result.success) {
        alert(result.message || '질환이 추가되었습니다.');
        setIsAddModalOpen(false);
        await fetchData(); // 데이터 새로고침
      } else {
        alert(result.message || '질환 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('질환 추가 실패:', error);
      alert('질환 추가에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDisease(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDepartmentChange = (value) => {
    setNewDisease(prev => ({
      ...prev,
      진료과: value
    }));
  };

  const handleSymptomsChange = (value) => {
    setNewDisease(prev => ({
      ...prev,
      전체증상목록: value
    }));
  };

  // 질환 수정 모달 열기
  const handleEditModalOpen = (disease) => {
    setEditingDisease({
      diseaseNo: disease.diseaseNo || null,
      질환명: disease.질환명 || '',
      설명: disease.설명 || '',
      이미지: disease.이미지 || ''
    });
    setEditImagePreview(disease.이미지 || '');
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  // 질환 수정 제출
  const handleEditDiseaseSubmit = async () => {
    if (!editingDisease.질환명) {
      alert('질환명은 필수 입력 항목입니다.');
      return;
    }

    if (!editingDisease.diseaseNo) {
      alert('질환 번호가 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      const result = await updateDisease(
        editingDisease.diseaseNo,
        editingDisease.질환명,
        editingDisease.설명 || '',
        editImageFile
      );

      if (result.success) {
        alert(result.message || '질환이 수정되었습니다.');
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        await fetchData();
      } else {
        alert(result.message || '질환 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('질환 수정 실패:', error);
      alert('질환 수정에 실패했습니다.');
    }
  };

  // 질환 삭제
  const handleDeleteDisease = async (diseaseNo, diseaseName) => {
    if (!diseaseNo) {
      alert('질환 번호가 없습니다. 다시 시도해주세요.');
      return;
    }

    if (!window.confirm(`"${diseaseName}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const result = await deleteDisease(diseaseNo);

      if (result.success) {
        alert(result.message || '질환이 삭제되었습니다.');
        setIsDetailModalOpen(false);
        await fetchData();
      } else {
        alert(result.message || '질환 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('질환 삭제 실패:', error);
      alert('질환 삭제에 실패했습니다.');
    }
  };

  // 수정용 입력 변경 핸들러
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDisease(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정용 이미지 변경 핸들러
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 페이징 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDiseases = filteredDiseases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDiseases.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <main className="admin-page featured-diseases">
        <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">데이터를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page featured-diseases">
      <Sidebar />

      <section className="admin-main">
        <div className="hospital-management">
          {/* 유행하는 질병 관리 섹션 */}
          <div className="featured-diseases-section" style={{ marginBottom: '15px' }}>
            <div className="hospital-header">
              <h2>
                유행하는 질병 <span className="hospital-count">{featuredDiseases.length}/4</span>
              </h2>
            </div>

            {featuredDiseases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', background: '#f9f9f9', borderRadius: '8px' }}>
                선택된 질병이 없습니다. 아래 질병 목록에서 질병을 선택하여 추가해주세요.
              </div>
            ) : (
              <div className="hospital-table-container">
                <table className="hospital-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px', padding: '8px 4px' }}></th>
                      <th style={{ width: '40px', padding: '8px 2px', textAlign: 'center' }}>순서</th>
                      <th>질병명</th>
                      <th style={{ width: '120px' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuredDiseases.map((disease, index) => (
                      <tr
                        key={disease.featuredDiseasesNo}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                          opacity: draggedIndex === index ? 0.5 : 1,
                          backgroundColor: draggedIndex === index ? '#f0f0f0' : 'transparent'
                        }}
                      >
                        <td style={{ textAlign: 'center', cursor: 'move', fontSize: '16px', color: '#999', padding: '8px 4px' }}>
                          ⋮⋮
                        </td>
                        <td style={{ textAlign: 'center', padding: '8px 2px' }}>{index + 1}</td>
                        <td>{disease.diseaseName}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleRemoveFromFeatured(disease.featuredDiseasesNo)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="disease-info-section">
            <div className="hospital-header">
              <h2>
                질환 정보 <span className="hospital-count">{filteredDiseases.length}</span>개
              </h2>
              <button
                className="add-hospital-btn"
                onClick={handleAddDiseaseClick}
              >
                질환 추가
              </button>
            </div>

            <div className="hospital-search-filters">
              <input
                type="text"
                className="search-input"
                placeholder="질병명, 진료과로 검색..."
                value={searchKeyword}
                onChange={handleSearch}
              />
            </div>

            <div className="hospital-table-container">
              <table className="hospital-table">
                <thead>
                  <tr>
                    <th>질병명</th>
                    <th>진료과</th>
                    <th>환자수</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiseases.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="no-data">
                        등록된 질병이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    currentDiseases.map((disease, index) => (
                      <tr key={index} onClick={() => handleDetail(disease)} style={{ cursor: 'pointer' }}>
                        <td>{disease.질환명}</td>
                        <td>{disease.진료과}</td>
                        <td>{disease.환자수 ? disease.환자수.toLocaleString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이징 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(1)}
                className={`page-btn arrow-btn ${currentPage === 1 ? 'disabled' : ''}`}
                disabled={currentPage === 1}
                title="첫 페이지">
                처음 페이지
              </button>

              <button
                onClick={goToPrevGroup}
                className={`page-btn arrow-btn ${currentPageGroup === 1 ? 'disabled' : ''}`}
                disabled={currentPageGroup === 1}
                title="이전 5페이지">
                «
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`page-btn ${currentPage === number ? 'active' : ''}`}>
                  {number}
                </button>
              ))}

              <button
                onClick={goToNextGroup}
                className={`page-btn arrow-btn ${endPage >= totalPages ? 'disabled' : ''}`}
                disabled={endPage >= totalPages}
                title="다음 5페이지">
                »
              </button>

              <button
                onClick={() => paginate(totalPages)}
                className={`page-btn arrow-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                disabled={currentPage === totalPages}
                title="마지막 페이지">
                끝 페이지
              </button>
            </div>
          )}
        </div>

        {/* 질병 상세 모달 */}
        {isDetailModalOpen && selectedDisease && (
          <div className="detail-modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
            <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn-top" onClick={() => setIsDetailModalOpen(false)}>
                ✕
              </button>
              <div className="detail-modal-body">
                <div className="detail-content-grid">
                  {/* 왼쪽: 이미지 및 버튼 */}
                  <div className="detail-left">
                    {selectedDisease.이미지 && (
                      <div className="detail-image-container">
                        <img
                          src={selectedDisease.이미지}
                          alt={selectedDisease.질환명}
                          className="detail-image"
                        />
                      </div>
                    )}
                    <div className="detail-actions">
                      <button
                        className="find-department-btn"
                        onClick={() => {
                          const isFeatured = featuredDiseases.some(d => d.diseaseName === selectedDisease.질환명);
                          if (isFeatured) {
                            const featured = featuredDiseases.find(d => d.diseaseName === selectedDisease.질환명);
                            handleRemoveFromFeatured(featured.featuredDiseasesNo);
                          } else {
                            handleAddToFeatured(selectedDisease.질환명);
                          }
                          setIsDetailModalOpen(false);
                        }}
                      >
                        {featuredDiseases.some(d => d.diseaseName === selectedDisease.질환명)
                          ? '유행 질병에서 제거'
                          : '유행 질병에 추가'}
                      </button>
                      <div className="detail-actions-row">
                        <button
                          className="find-department-btn secondary"
                          onClick={() => {
                            handleEditModalOpen(selectedDisease);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="find-department-btn danger"
                          onClick={() => {
                            handleDeleteDisease(selectedDisease.diseaseNo, selectedDisease.질환명);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="detail-right">
                    <div className="detail-section">
                      <h3 className="detail-section-title">질환명</h3>
                      <p className="detail-text">
                        {selectedDisease.질환명 || "정보 없음"}
                      </p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">진료과</h3>
                      <p className="detail-text">{selectedDisease.진료과 || "정보 없음"}</p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">환자수</h3>
                      <p className="detail-text">
                        {selectedDisease.환자수 ? selectedDisease.환자수.toLocaleString() : "정보 없음"}
                      </p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">설명</h3>
                      <p className="detail-text">{selectedDisease.설명 || "정보 없음"}</p>
                    </div>

                    <div className="detail-section">
                      <h3 className="detail-section-title">증상</h3>
                      <div className="detail-symptoms-list">
                        {(typeof selectedDisease.전체증상목록 === "string"
                          ? selectedDisease.전체증상목록.split(",").map((s) => s.trim())
                          : []
                        ).map((symptom, idx) => (
                          <span key={idx} className="detail-symptom-badge">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 질환 추가 모달 */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>질환 추가</h3>
                <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
                  ✕
                </button>
              </div>
              <form className="hospital-form" onSubmit={(e) => { e.preventDefault(); handleAddDiseaseSubmit(); }}>
                <div className="form-two-column">
                  {/* 좌측: 질환명, 진료과, 설명 */}
                  <div className="form-column">
                    <div className="form-row">
                      <label>질환명 *</label>
                      <input
                        type="text"
                        name="질환명"
                        value={newDisease.질환명}
                        onChange={handleInputChange}
                        placeholder="질환명을 입력하세요"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>진료과 *</label>
                      <input
                        type="text"
                        name="진료과"
                        value={newDisease.진료과}
                        onClick={() => setIsDepartmentModalOpen(true)}
                        placeholder="진료과 선택"
                        readOnly
                        required
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-row">
                      <label>설명</label>
                      <textarea
                        name="설명"
                        value={newDisease.설명}
                        onChange={handleInputChange}
                        placeholder="질환 설명을 입력하세요"
                        style={{ minHeight: '200px' }}
                      />
                    </div>
                  </div>

                  {/* 우측: 증상 목록, 환자수, 이미지, 미리보기 */}
                  <div className="form-column">
                    <div className="form-row">
                      <label>증상 목록</label>
                      <input
                        type="text"
                        name="전체증상목록"
                        value={newDisease.전체증상목록}
                        onClick={() => setIsSymptomsModalOpen(true)}
                        placeholder="증상 선택"
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-row">
                      <label>환자수</label>
                      <input
                        type="number"
                        name="환자수"
                        value={newDisease.환자수}
                        onChange={handleInputChange}
                        placeholder="환자수를 입력하세요"
                        min="0"
                      />
                    </div>
                    <div className="form-row">
                      <label>이미지</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    {imagePreview && (
                      <div className="form-row">
                        <label>미리보기</label>
                        <img src={imagePreview} alt="미리보기" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 질환 수정 모달 */}
        {isEditModalOpen && (
          <div className="modal" onClick={() => setIsEditModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>질환 수정</h3>
                <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
                  ✕
                </button>
              </div>
              <form className="hospital-form" onSubmit={(e) => { e.preventDefault(); handleEditDiseaseSubmit(); }}>
                <div className="form-row">
                  <label>질환명 *</label>
                  <input
                    type="text"
                    name="질환명"
                    value={editingDisease?.질환명 || ''}
                    onChange={handleEditInputChange}
                    placeholder="질환명을 입력하세요"
                    required
                  />
                </div>
                <div className="form-row">
                  <label>설명</label>
                  <textarea
                    name="설명"
                    value={editingDisease?.설명 || ''}
                    onChange={handleEditInputChange}
                    placeholder="질환 설명을 입력하세요"
                    style={{ minHeight: '200px' }}
                  />
                </div>
                <div className="form-row">
                  <label>이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    * 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
                  </small>
                </div>
                {editImagePreview && (
                  <div className="form-row">
                    <label>미리보기</label>
                    <img src={editImagePreview} alt="미리보기" style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }} />
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    수정
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 진료과 선택 모달 */}
        <DepartmentsModal
          isOpen={isDepartmentModalOpen}
          onClose={() => setIsDepartmentModalOpen(false)}
          value={newDisease.진료과}
          onChange={handleDepartmentChange}
        />

        {/* 증상 선택 모달 */}
        <SymptomsModal
          isOpen={isSymptomsModalOpen}
          onClose={() => setIsSymptomsModalOpen(false)}
          value={newDisease.전체증상목록}
          onChange={handleSymptomsChange}
          symptomsByBodyPart={symptomsByBodyPart}
        />
      </section>
    </main>
  );
};

export default FeaturedDiseases;
