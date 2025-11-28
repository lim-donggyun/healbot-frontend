import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  getAllDiseases,
  getFeaturedDiseases,
  addFeaturedDisease,
  removeFeaturedDisease,
  updateFeaturedDiseasesOrder,
  getDiseaseByName
} from '../../../utils/diseasesApi';
import './HospitalManagement.css';
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

  const itemsPerPage = 10;

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
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];

    const updatedList = newList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    try {
      await updateFeaturedDiseasesOrder(updatedList);
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

    const updatedList = newList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    try {
      await updateFeaturedDiseasesOrder(updatedList);
      setFeaturedDiseases(updatedList);
    } catch (error) {
      console.error('순서 변경 실패:', error);
      alert('순서 변경에 실패했습니다.');
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
          {/* 유행하는 질병 관리 섹션 */}
          <div className="featured-diseases-section" style={{ marginBottom: '30px' }}>
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
                      <th style={{ width: '80px' }}>순서</th>
                      <th>질병명</th>
                      <th style={{ width: '200px' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuredDiseases.map((disease, index) => (
                      <tr key={disease.featuredDiseasesNo}>
                        <td style={{ textAlign: 'center' }}>{index + 1}</td>
                        <td>{disease.diseaseName}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-btn admin-btn-sm"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            style={{ marginRight: '5px', padding: '4px 8px', fontSize: '12px' }}
                          >
                            ↑
                          </button>
                          <button
                            className="admin-btn admin-btn-sm"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === featuredDiseases.length - 1}
                            style={{ marginRight: '10px', padding: '4px 8px', fontSize: '12px' }}
                          >
                            ↓
                          </button>
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
                      <button
                        className="find-department-btn"
                        onClick={() => {
                          alert('수정 기능은 추후 구현 예정입니다.');
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="find-department-btn delete-btn"
                        onClick={() => {
                          if (window.confirm(`${selectedDisease.질환명}을(를) 삭제하시겠습니까?`)) {
                            alert('삭제 기능은 추후 구현 예정입니다.');
                          }
                        }}
                      >
                        삭제
                      </button>
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
      </section>
    </main>
  );
};

export default FeaturedDiseases;
