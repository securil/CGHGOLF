import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [generationFilter, setGenerationFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(15);
  
  // 사용 가능한 세대 목록
  const [generations, setGenerations] = useState([]);
  
  // 편집 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 데이터 로딩
        const response = await fetch('/data/members.json');
        const data = await response.json();
        
        setMembers(data);
        setFilteredMembers(data);
        
        // 고유한 세대 목록 추출
        const uniqueGenerations = [...new Set(data.map(member => member.generation))].sort((a, b) => a - b);
        setGenerations(uniqueGenerations);
        
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // 필터링 및 정렬 적용
  useEffect(() => {
    // 필터링 및 검색 적용
    let result = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGeneration = generationFilter === 'all' || member.generation.toString() === generationFilter;
      const matchesGender = genderFilter === 'all' || member.gender === genderFilter;
      
      return matchesSearch && matchesGeneration && matchesGender;
    });
    
    // 정렬 적용
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ko');
          break;
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'generation':
          comparison = a.generation - b.generation;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredMembers(result);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [members, searchTerm, generationFilter, genderFilter, sortBy, sortDirection]);
  
  // 페이지네이션 계산
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  
  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // 정렬 변경 함수
  const handleSortChange = (column) => {
    if (sortBy === column) {
      // 같은 컬럼 클릭 시 정렬 방향 전환
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 컬럼 클릭 시 해당 컬럼으로 정렬 및 오름차순 설정
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // 멤버 삭제 핸들러 (실제 구현 시에는 API 호출)
  const handleDeleteMember = (id) => {
    if (window.confirm(`회원 ID ${id}를 정말 삭제하시겠습니까?`)) {
      // 실제 구현에서는 API 호출 후 성공 시 아래 코드 실행
      const updatedMembers = members.filter(member => member.id !== id);
      setMembers(updatedMembers);
      setFilteredMembers(updatedMembers);
      alert('회원이 삭제되었습니다.');
    }
  };
  
  // 편집 모드 전환
  const handleEditMember = (member) => {
    setEditingMember({ ...member });
    setEditMode(true);
  };
  
  // 편집 내용 저장
  const handleSaveMember = () => {
    // 실제 구현에서는 API 호출 후 성공 시 아래 코드 실행
    const updatedMembers = members.map(member => 
      member.id === editingMember.id ? editingMember : member
    );
    setMembers(updatedMembers);
    setFilteredMembers(updatedMembers);
    setEditMode(false);
    setEditingMember(null);
    alert('회원 정보가 수정되었습니다.');
  };
  
  // 편집 취소
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingMember(null);
  };
  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">회원 관리</h1>
        <Link 
          to="/admin/members/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + 새 회원 추가
        </Link>
      </div>
      
      {/* 필터 및 검색 섹션 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 검색창 */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">이름 검색</label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="회원 이름 입력..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* 세대 필터 */}
          <div>
            <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-2">세대</label>
            <select
              id="generation"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={generationFilter}
              onChange={(e) => setGenerationFilter(e.target.value)}
            >
              <option value="all">전체 세대</option>
              {generations.map(gen => (
                <option key={gen} value={gen}>{gen}세대</option>
              ))}
            </select>
          </div>
          
          {/* 성별 필터 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">성별</label>
            <select
              id="gender"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </div>
          
          {/* 정렬 옵션 */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">정렬 기준</label>
            <select
              id="sort"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [newSortBy, newSortDirection] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortDirection(newSortDirection);
              }}
            >
              <option value="name-asc">이름 오름차순</option>
              <option value="name-desc">이름 내림차순</option>
              <option value="id-asc">회원번호 오름차순</option>
              <option value="id-desc">회원번호 내림차순</option>
              <option value="generation-asc">세대 오름차순</option>
              <option value="generation-desc">세대 내림차순</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-600">
          총 {filteredMembers.length}명의 회원이 검색되었습니다.
        </div>
      </div>
      
      {/* 편집 모달 */}
      {editMode && editingMember && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">회원 정보 수정</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회원 ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={editingMember.id}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingMember.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">세대</label>
                <input
                  type="number"
                  name="generation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingMember.generation}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                <select
                  name="gender"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingMember.gender}
                  onChange={handleInputChange}
                >
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingMember.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleSaveMember}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 회원 목록 테이블 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('id')}>
                  회원번호 {sortBy === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('name')}>
                  이름 {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('generation')}>
                  세대 {sortBy === 'generation' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">성별</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">연락처</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentMembers.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{member.id}</td>
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.generation}세대</td>
                  <td className="py-3 px-4">{member.gender}</td>
                  <td className="py-3 px-4">{member.phone}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="py-4 px-6 flex justify-center">
            <nav className="flex items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagement;