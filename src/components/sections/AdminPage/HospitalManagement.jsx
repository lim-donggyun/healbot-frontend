import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  getAllHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalDepartments,
} from "../../../utils/hospitalApi";
import OperatingHoursModal from "./OperatingHoursModal";
import DepartmentsModal from "./DepartmentsModal";
import "./HospitalManagement.css";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [emergencyFilter, setEmergencyFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOperatingHoursModalOpen, setIsOperatingHoursModalOpen] = useState(false);
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isKakaoMapReady, setIsKakaoMapReady] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId: "",
    hospitalName: "",
    address: "",
    detailAddress: "",
    hospitalGrade: "",
    hospitalType: "",
    details: "",
    operatingHours: "",
    lunchTime: "",
    emergencyYn: "N",
    phone: "",
    erPhone: "",
    longitude: "",
    latitude: "",
    simpleMap: "",
    departments: "",
  });

  const itemsPerPage = 5;

  useEffect(() => {
    fetchHospitals();

    // 드래그 방지
    document.body.style.setProperty('user-select', 'none', 'important');
    document.body.style.setProperty('-webkit-user-select', 'none', 'important');

    // Load Daum Postcode script
    const postcodeScriptId = "daum-postcode-script";
    if (!document.getElementById(postcodeScriptId)) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.id = postcodeScriptId;
      document.head.appendChild(script);
    }

    // Load Kakao Maps script for geocoding
    const kakaoMapsScriptId = "kakao-maps-script";
    if (!document.getElementById(kakaoMapsScriptId)) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_JS_KEY
      }&libraries=services&autoload=false`;
      script.id = kakaoMapsScriptId;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsKakaoMapReady(true);
          console.log("Kakao Maps API is ready.");
        });
      };
    } else {
      // If script is already there, check if it's ready
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsKakaoMapReady(true);
          console.log("Kakao Maps API was already loaded and is ready.");
        });
      }
    }
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const data = await getAllHospitals();
      setHospitals(data);
      setFilteredHospitals(data);
    } catch (error) {
      console.error("병원 목록 로딩 실패:", error);
      alert("병원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 주소에서 구 추출 함수
  const extractDistrict = (address) => {
    if (!address) return null;
    const match = address.match(/서울특별시\s*(\S+구)/);
    return match ? match[1] : null;
  };

  // 병원 등급을 표시용 텍스트로 변환하는 함수
  const formatHospitalGrade = (grade) => {
    const gradeMap = {
      1: "1차병원",
      2: "2차병원",
      3: "3차병원",
    };
    return gradeMap[grade] || grade || "-";
  };

  const applyFilters = (keyword, type, emergency, district) => {
    let filtered = hospitals;

    // 키워드 필터링
    if (keyword.trim() !== "") {
      filtered = filtered.filter(
        (hospital) =>
          hospital.hospitalName?.toLowerCase().includes(keyword.toLowerCase()) ||
          hospital.hospitalId?.toLowerCase().includes(keyword.toLowerCase()) ||
          hospital.address?.toLowerCase().includes(keyword.toLowerCase()) ||
          hospital.phone?.includes(keyword)
      );
    }

    // 유형 필터링
    if (type !== "ALL") {
      filtered = filtered.filter((hospital) => hospital.hospitalType === type);
    }

    // 응급실 필터링
    if (emergency !== "ALL") {
      filtered = filtered.filter((hospital) => hospital.emergencyYn === emergency);
    }

    // 지역구 필터링
    if (district !== "ALL") {
      filtered = filtered.filter((hospital) => {
        const hospitalDistrict = extractDistrict(hospital.address);
        return hospitalDistrict === district;
      });
    }

    setFilteredHospitals(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    applyFilters(keyword, typeFilter, emergencyFilter, districtFilter);
  };

  const handleTypeFilter = (e) => {
    const type = e.target.value;
    setTypeFilter(type);
    applyFilters(searchKeyword, type, emergencyFilter, districtFilter);
  };

  const handleEmergencyFilter = (e) => {
    const emergency = e.target.value;
    setEmergencyFilter(emergency);
    applyFilters(searchKeyword, typeFilter, emergency, districtFilter);
  };

  const handleDistrictFilter = (e) => {
    const district = e.target.value;
    setDistrictFilter(district);
    applyFilters(searchKeyword, typeFilter, emergencyFilter, district);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOperatingHoursChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: value,
    }));
  };

  const handleDepartmentsChange = (value) => {
    console.log("=== 진료과 선택 ===");
    console.log("선택된 진료과:", value);
    setFormData((prev) => ({
      ...prev,
      departments: value,
    }));
  };

  const handleAddressSearch = () => {
    if (!window.daum) {
      alert("주소 검색 서비스(Daum)가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
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

        if (!isKakaoMapReady) {
          alert("지도 서비스(Kakao)가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
          setFormData((prev) => ({ ...prev, address: fullAddress }));
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(data.address, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const newCoords = {
              lat: parseFloat(result[0].y).toFixed(6),
              lng: parseFloat(result[0].x).toFixed(6),
            };
            console.log("Geocoding successful. Coordinates:", newCoords);
            setFormData((prev) => ({
              ...prev,
              address: fullAddress,
              latitude: newCoords.lat,
              longitude: newCoords.lng,
            }));
          } else {
            alert("주소로 좌표를 찾지 못했습니다. 주소만 저장됩니다.");
            setFormData((prev) => ({ ...prev, address: fullAddress }));
          }
        });
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 주소와 상세 주소를 합쳐서 전송
      const combinedAddress = formData.detailAddress
        ? `${formData.address} ${formData.detailAddress}`.trim()
        : formData.address;

      // detailAddress를 제외하고 나머지 데이터 준비
      const { detailAddress, ...restData } = formData;
      const dataToSend = {
        ...restData,
        address: combinedAddress,
      };

      console.log("=== 병원 저장 데이터 ===");
      console.log("isEditMode:", isEditMode);
      console.log("formData.departments:", formData.departments);
      console.log("dataToSend:", dataToSend);
      console.log("dataToSend.departments:", dataToSend.departments);

      if (isEditMode) {
        await updateHospital(selectedHospital.hospitalId, dataToSend);
        alert("병원 정보가 수정되었습니다.");
      } else {
        await createHospital(dataToSend);
        alert("병원이 추가되었습니다.");
      }

      setIsModalOpen(false);
      resetForm();
      fetchHospitals();
    } catch (error) {
      console.error("병원 저장 실패:", error);
      alert(isEditMode ? "병원 수정에 실패했습니다." : "병원 추가에 실패했습니다.");
    }
  };

  const handleDetail = async (hospital) => {
    setSelectedHospital(hospital);
    setIsDetailModalOpen(true);

    // 진료과 목록 조회
    try {
      console.log("진료과 조회 중... Hospital ID:", hospital.hospitalId);
      const depts = await getHospitalDepartments(hospital.hospitalId);
      console.log("진료과 응답:", depts);
      console.log("진료과 개수:", depts ? depts.length : 0);
      setDepartments(depts || []);
    } catch (error) {
      console.error("진료과 목록 조회 실패:", error);
      setDepartments([]);
    }
  };

  // 상세 모달이 열릴 때 카카오맵 렌더링
  useEffect(() => {
    if (isDetailModalOpen && selectedHospital && selectedHospital.latitude && selectedHospital.longitude) {
      setTimeout(() => {
        const container = document.getElementById("admin-detail-kakao-map");
        if (!container || !window.kakao || !window.kakao.maps) return;

        const options = {
          center: new window.kakao.maps.LatLng(
            parseFloat(selectedHospital.latitude),
            parseFloat(selectedHospital.longitude)
          ),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          parseFloat(selectedHospital.latitude),
          parseFloat(selectedHospital.longitude)
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      }, 100);
    }
  }, [isDetailModalOpen, selectedHospital]);

  const handleEditFromDetail = () => {
    setFormData({
      hospitalId: selectedHospital.hospitalId || "",
      hospitalName: selectedHospital.hospitalName || "",
      address: selectedHospital.address || "",
      detailAddress: "", // 상세 주소는 수정 시 새로 입력
      hospitalGrade: selectedHospital.hospitalGrade || "",
      hospitalType: selectedHospital.hospitalType || "",
      details: selectedHospital.details || "",
      operatingHours: selectedHospital.operatingHours || "",
      lunchTime: selectedHospital.lunchTime || "",
      emergencyYn: selectedHospital.emergencyYn || "N",
      phone: selectedHospital.phone || "",
      erPhone: selectedHospital.erPhone || "",
      longitude: selectedHospital.longitude || "",
      latitude: selectedHospital.latitude || "",
      simpleMap: selectedHospital.simpleMap || "",
      departments: departments.join(", ") || "",
    });
    setIsEditMode(true);
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteFromDetail = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteHospital(selectedHospital.hospitalId);
      alert("병원이 삭제되었습니다.");
      setIsDetailModalOpen(false);
      fetchHospitals();
    } catch (error) {
      console.error("병원 삭제 실패:", error);
      alert("병원 삭제에 실패했습니다.");
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      hospitalId: "",
      hospitalName: "",
      address: "",
      detailAddress: "", // Reset detailAddress
      hospitalGrade: "",
      hospitalType: "",
      details: "",
      operatingHours: "",
      lunchTime: "",
      emergencyYn: "N",
      phone: "",
      erPhone: "",
      longitude: "",
      latitude: "",
      simpleMap: "",
      departments: "",
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
  const hospitalTypes = ["ALL", ...new Set(hospitals.map((h) => h.hospitalType).filter(Boolean))];

  // 서울 구 리스트 추출
  const seoulDistricts = [
    "ALL",
    ...new Set(
      hospitals
        .map((h) => extractDistrict(h.address))
        .filter(Boolean)
        .sort()
    ),
  ];

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
      <main className="admin-page hospital-management-page">
        <div className="loading-container" style={{ gridColumn: '1 / -1' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">데이터를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page hospital-management-page">
      <Sidebar />
      <section className="admin-main">
        <div className="hospital-management">
          <div className="hospital-header">
            <h2>
              검색된 병원 <span className="hospital-count">{filteredHospitals.length}</span>개
            </h2>
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
              <select className="filter-select" value={typeFilter} onChange={handleTypeFilter}>
                <option value="ALL">전체 유형</option>
                {hospitalTypes
                  .filter((type) => type !== "ALL")
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>

              <select className="filter-select" value={emergencyFilter} onChange={handleEmergencyFilter}>
                <option value="ALL">전체 응급실</option>
                <option value="Y">응급실 있음</option>
                <option value="N">응급실 없음</option>
              </select>

              <select className="filter-select" value={districtFilter} onChange={handleDistrictFilter}>
                <option value="ALL">전체 지역</option>
                {seoulDistricts
                  .filter((district) => district !== "ALL")
                  .map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
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
                </tr>
              </thead>
              <tbody>
                {currentHospitals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      등록된 병원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  currentHospitals.map((hospital) => (
                    <tr key={hospital.hospitalId} onClick={() => handleDetail(hospital)} style={{ cursor: "pointer" }}>
                      <td>{hospital.hospitalId}</td>
                      <td>{hospital.hospitalName}</td>
                      <td>{hospital.address}</td>
                      <td>{formatHospitalGrade(hospital.hospitalGrade)}</td>
                      <td>{hospital.hospitalType}</td>
                      <td>{hospital.emergencyYn === "Y" ? "있음" : "없음"}</td>
                      <td>{hospital.phone}</td>
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
                  onClick={() => paginate(number)}
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
                onClick={() => paginate(totalPages)}
                className={`page-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
                title="마지막 페이지">
                끝 페이지
              </button>
            </div>
          )}
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{isEditMode ? "병원 정보 수정" : "병원 추가"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="hospital-form">
                <div className="form-two-column">
                  <div className="form-column">
                    {/* 왼쪽 열 (Left Column) - 7개 */}
                    <div className="form-row">
                      <label>병원 ID</label>
                      <input
                        type="text"
                        name="hospitalId"
                        value={formData.hospitalId}
                        onChange={handleInputChange}
                        required
                        disabled={isEditMode}
                      />
                    </div>
                    <div className="form-row">
                      <label>병원명</label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>주소</label>
                      <div className="address-input-group">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          readOnly
                          placeholder="주소"
                          onClick={handleAddressSearch}
                          style={{
                            cursor: 'pointer',
                            backgroundColor: '#f9fafb',
                            color: '#6b7280'
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label>상세 주소</label>
                      <input
                        type="text"
                        name="detailAddress"
                        value={formData.detailAddress || ""}
                        onChange={handleInputChange}
                        placeholder="상세 주소 입력"
                      />
                    </div>
                    <div className="form-row">
                      <label>경도 / 위도</label>
                      <div style={{ display: 'flex', gap: '8px', width: '200px' }}>
                        <input
                          type="text"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="126.9780"
                          disabled
                          style={{ width: '96px', padding: '8px 10px', fontSize: '13px' }}
                        />
                        <input
                          type="text"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="37.5665"
                          disabled
                          style={{ width: '96px', padding: '8px 10px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <label>간이 약도</label>
                      <input
                        type="text"
                        name="simpleMap"
                        value={formData.simpleMap}
                        onChange={handleInputChange}
                        placeholder="강남역 2번출구 앞"
                      />
                    </div>
                    <div className="form-row">
                      <label>병원 유형</label>
                      <select name="hospitalType" value={formData.hospitalType} onChange={handleInputChange}>
                        <option value="">선택하세요</option>
                        <option value="한의원">한의원</option>
                        <option value="의원">의원</option>
                        <option value="치과의원">치과의원</option>
                        <option value="한방병원">한방병원</option>
                        <option value="요양병원">요양병원</option>
                        <option value="병원">병원</option>
                        <option value="치과병원">치과병원</option>
                        <option value="종합병원">종합병원</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-column">
                    {/* 오른쪽 열 (Right Column) - 7개 */}
                    <div className="form-row">
                      <label>병원 등급</label>
                      <select name="hospitalGrade" value={formData.hospitalGrade} onChange={handleInputChange}>
                        <option value="">선택하세요</option>
                        <option value="1">1차병원</option>
                        <option value="2">2차병원</option>
                        <option value="3">3차병원</option>
                      </select>
                    </div>
                    <div className="form-row" onClick={() => setIsDepartmentsModalOpen(true)} style={{ cursor: 'pointer' }}>
                      <label>진료과</label>
                      <input
                        type="text"
                        name="departments"
                        value={formData.departments}
                        readOnly
                        placeholder="클릭하여 진료과 선택"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: '#f9fafb',
                          color: '#6b7280'
                        }}
                      />
                    </div>
                    <div className="form-row" onClick={() => setIsOperatingHoursModalOpen(true)} style={{ cursor: 'pointer' }}>
                      <label>운영시간</label>
                      <input
                        type="text"
                        name="operatingHours"
                        value={formData.operatingHours}
                        readOnly
                        placeholder="클릭하여 운영시간 설정"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="form-row">
                      <label>점심시간</label>
                      <input
                        type="text"
                        name="lunchTime"
                        value={formData.lunchTime}
                        onChange={handleInputChange}
                        placeholder="12:00~13:00"
                      />
                    </div>
                    <div className="form-row">
                      <label>전화번호</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
                          let formatted = "";

                          if (value.length <= 2) {
                            formatted = value;
                          } else if (value.length <= 6) {
                            formatted = `${value.slice(0, 2)}-${value.slice(2)}`;
                          } else if (value.length <= 10) {
                            formatted = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6, 10)}`;
                          } else if (value.length === 11) {
                            formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
                          }

                          setFormData((prev) => ({ ...prev, phone: formatted }));
                        }}
                        placeholder="02-1234-5678"
                        maxLength="13"
                      />
                    </div>
                    <div className="form-row">
                      <label>응급실 전화번호</label>
                      <input
                        type="text"
                        name="erPhone"
                        value={formData.erPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출
                          let formatted = "";

                          if (value.length <= 2) {
                            formatted = value;
                          } else if (value.length <= 6) {
                            formatted = `${value.slice(0, 2)}-${value.slice(2)}`;
                          } else if (value.length <= 10) {
                            formatted = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6, 10)}`;
                          } else if (value.length === 11) {
                            formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
                          }

                          setFormData((prev) => ({ ...prev, erPhone: formatted }));
                        }}
                        placeholder="02-1234-5679"
                        maxLength="13"
                      />
                    </div>
                    <div className="form-row">
                      <label>응급실 여부</label>
                      <select name="emergencyYn" value={formData.emergencyYn} onChange={handleInputChange}>
                        <option value="N">없음</option>
                        <option value="Y">있음</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-full-width-row">
                  <div className="form-row">
                    <label>상세정보</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      style={{ height: "100px", resize: "none" }}
                      placeholder="병원에 대한 상세 설명을 입력하세요"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    취소
                  </button>
                  <button type="submit" className="submit-btn">
                    {isEditMode ? "수정" : "추가"}
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
                <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="detail-content detail-content-two-column">
                {/* 왼쪽 열 */}
                <div className="detail-left-column">
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
                      <div className="detail-item">
                        <span className="detail-label">병원 등급:</span>
                        <span className="detail-value">{formatHospitalGrade(selectedHospital.hospitalGrade)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">병원 유형:</span>
                        <span className="detail-value">{selectedHospital.hospitalType || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">전화번호:</span>
                        <span className="detail-value">{selectedHospital.phone || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">응급실 전화:</span>
                        <span className="detail-value">{selectedHospital.erPhone || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">응급실:</span>
                        <span className="detail-value">{selectedHospital.emergencyYn === "Y" ? "있음" : "없음"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">운영시간:</span>
                        <span className="detail-value">
                          {selectedHospital.operatingHours
                            ? selectedHospital.operatingHours
                                .split("|")
                                .map((time, idx) => <div key={idx}>{time.trim()}</div>)
                            : "-"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">점심시간:</span>
                        <span className="detail-value">{selectedHospital.lunchTime || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">경도:</span>
                        <span className="detail-value">{selectedHospital.longitude || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">위도:</span>
                        <span className="detail-value">{selectedHospital.latitude || "-"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">간단 지도:</span>
                        <span className="detail-value">{selectedHospital.simpleMap || "-"}</span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">상세정보:</span>
                        <span className="detail-value">{selectedHospital.details || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 열 */}
                <div className="detail-right-column">
                  <div className="detail-section">
                    <h4>진료과 목록</h4>
                    <div className="departments-list">
                      {departments.length > 0 ? (
                        departments.map((dept, index) => (
                          <span key={index} className="department-tag">
                            {dept}
                          </span>
                        ))
                      ) : (
                        <p className="no-data">등록된 진료과가 없습니다.</p>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>병원 위치</h4>
                    <div className="detail-info">
                      {selectedHospital.latitude && selectedHospital.longitude ? (
                        <div className="hospital-map-box">
                          <div
                            id="admin-detail-kakao-map"
                            style={{
                              width: "100%",
                              height: "250px",
                              borderRadius: "8px",
                              border: "2px solid #dee2e6",
                              marginBottom: "12px",
                            }}></div>
                          <div className="detail-item-single">
                            <span className="detail-label">주소:</span>
                            <span className="detail-value">{selectedHospital.address || "-"}</span>
                          </div>
                          <button
                            className="kakao-map-navigate-btn"
                            onClick={() => {
                              const lat = selectedHospital.latitude;
                              const lng = selectedHospital.longitude;
                              const name = selectedHospital.hospitalName;
                              window.open(
                                `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`,
                                "_blank"
                              );
                            }}>
                            <svg
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="currentColor"
                              style={{ marginRight: "6px" }}>
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            카카오맵에서 보기
                          </button>
                        </div>
                      ) : (
                        <div className="detail-item-single">
                          <span className="detail-label">주소:</span>
                          <span className="detail-value">{selectedHospital.address || "-"}</span>
                        </div>
                      )}
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
            </div>
          </div>
        )}
        {isOperatingHoursModalOpen && (
          <OperatingHoursModal
            isOpen={isOperatingHoursModalOpen}
            onClose={() => setIsOperatingHoursModalOpen(false)}
            value={formData.operatingHours}
            onChange={handleOperatingHoursChange}
          />
        )}
        {isDepartmentsModalOpen && (
          <DepartmentsModal
            isOpen={isDepartmentsModalOpen}
            onClose={() => setIsDepartmentsModalOpen(false)}
            value={formData.departments}
            onChange={handleDepartmentsChange}
          />
        )}
      </section>
    </main>
  );
};

export default HospitalManagement;
