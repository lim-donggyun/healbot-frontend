import React from 'react';
import { extractDistrict } from '../../utils/mapUtils';

function HospitalSearchBar({
  searchKeyword,
  onSearchChange,
  onSearch,
  onClearSearch,
  selectedDepartments,
  isDepartmentDropdownOpen,
  onToggleDepartmentDropdown,
  departmentList,
  onToggleDepartment,
  onSelectAllDepartments,
  onApplyDepartmentFilter,
  showAutocomplete,
  autocompleteSuggestions,
  onSuggestionClick,
  searchInputRef,
  autocompleteRef,
  departmentDropdownRef
}) {
  return (
    <div className="sidebar-search-container" ref={departmentDropdownRef}>
      <div className="search-with-filter">
        <button
          className={`department-filter-btn ${selectedDepartments.length > 0 ? 'active' : ''}`}
          title="진료과 선택"
          onClick={onToggleDepartmentDropdown}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
          </svg>
          진료과
          {selectedDepartments.length > 0 && (
            <span className="selected-count">{selectedDepartments.length}</span>
          )}
        </button>
        <div className="sidebar-search-box-wrapper" ref={autocompleteRef}>
          <div className="sidebar-search-box">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="지역명, 병원명 검색"
              value={searchKeyword}
              onChange={onSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              onFocus={() => {
                if (searchKeyword.trim().length >= 2 && autocompleteSuggestions.length > 0) {
                  // Show autocomplete handled by parent
                }
              }}
            />
            {searchKeyword && (
              <button
                className="search-clear-btn"
                onClick={onClearSearch}
                title="검색어 지우기"
              >
                ×
              </button>
            )}
            <button className="sidebar-search-btn" onClick={onSearch}>
              검색
            </button>
          </div>

          {/* 자동완성 드롭다운 */}
          {showAutocomplete && autocompleteSuggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {autocompleteSuggestions.map((hospital) => {
                const district = extractDistrict(hospital.address);
                return (
                  <div
                    key={hospital.hospitalId}
                    className="autocomplete-item"
                    onClick={() => onSuggestionClick(hospital)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="hospital-name">{hospital.hospitalName}</span>
                    {district && (
                      <span className="hospital-district">{district}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 진료과 드롭다운 */}
      {isDepartmentDropdownOpen && (
        <div className="department-dropdown">
          <div className="department-dropdown-header">
            <h4>진료과 선택 <span className="max-count">(복수 선택 가능)</span></h4>
            <button
              className="dropdown-close-btn"
              onClick={onToggleDepartmentDropdown}
            >
              ×
            </button>
          </div>
          <div className="department-list">
            {departmentList.map((department) => (
              <label key={department} className={`department-item ${department === '전체' ? 'all-option' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(department)}
                  onChange={() => onToggleDepartment(department)}
                />
                <span className="checkbox-custom"></span>
                <span className="department-name">{department}</span>
              </label>
            ))}
          </div>
          <div className="department-dropdown-footer">
            <button
              className="clear-btn"
              onClick={onSelectAllDepartments}
            >
              전체 선택
            </button>
            <button
              className="apply-btn"
              onClick={onApplyDepartmentFilter}
            >
              선택 완료 ({selectedDepartments.includes('전체') ? '전체' : selectedDepartments.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalSearchBar;
