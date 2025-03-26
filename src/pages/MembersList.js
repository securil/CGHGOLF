import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState([]);
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
  const [membersPerPage] = useState(20);
  
  // 사용 가능한 세대 목록
  const [generations, setGenerations] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 데이터 로딩 - public 폴더 내에 있다고 가정
        // 상대 경로가 아닌 절대 경로로 사용 (/로 시작)
        const membersResponse = await fetch(`${process.env.PUBLIC_URL}/data/members.json`);
        if (!membersResponse.ok) {
          throw new Error(`HTTP error! status: ${membersResponse.status}`);
        }
        const membersData = await membersResponse.json();
        
        // 스코어 데이터 로딩
        const scoresResponse = await fetch(`${process.env.PUBLIC_URL}/data/scores.json`);
        if (!scoresResponse.ok) {
          throw new Error(`HTTP error! status: ${scoresResponse.status}`);
        }
        const scoresData = await scoresResponse.json();
        
        setMembers(membersData);
        setScores(scoresData);
        setFilteredMembers(membersData);
        
        // 고유한 세대 목록 추출
        const uniqueGenerations = [...new Set(membersData.map(member => member.generation))].sort((a, b) => a - b);
        setGenerations(uniqueGenerations);
        
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다: ' + err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // 회원별 평균 스코어 계산
  const calculateAverageScores = () => {
    const averageScores = {};
    const attendanceCounts = {};
    
    scores.forEach(score => {
      const memberId = score.member_id;
      
      if (!averageScores[memberId]) {
        averageScores[memberId] = 0;
        attendanceCounts[memberId] = 0;
      }
      
      averageScores[memberId] += score.score;
      attendanceCounts[memberId]++;
    });
    
    // 평균 계산
    Object.keys(averageScores).forEach(memberId => {
      averageScores[memberId] = Math.round((averageScores[memberId] / attendanceCounts[memberId]) * 10) / 10;
    });
    
    return { averageScores, attendanceCounts };
  };
  
  // 필터링 및 정렬 적용
  useEffect(() => {
    // 계산된 평균 스코어 및 참석 횟수
    const { averageScores, attendanceCounts } = calculateAverageScores();
    
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
        case 'generation':
          comparison = a.generation - b.generation;
          break;
        case 'attendance':
          comparison = (attendanceCounts[b.id] || 0) - (attendanceCounts[a.id] || 0);
          break;
        case 'average':
          const aAvg = averageScores[a.id] || 0;
          const bAvg = averageScores[b.id] || 0;
          comparison = aAvg - bAvg; // 낮은 점수가 더 좋음
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredMembers(result);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [members, scores, searchTerm, generationFilter, genderFilter, sortBy, sortDirection]);
  
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
  
  // 더미 데이터 (데이터 로딩 실패 시 대비)
  const dummyMembers = [
    { id: 1, name: "이연섭", generation: 11, gender: "남성", phone: "010-4479-4720" },
    { id: 2, name: "허수창", generation: 14, gender: "남성", phone: "010-5261-7396" },
    { id: 3, name: "이남구", generation: 15, gender: "남성", phone: "010-4226-6282" }
  ];
  
  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) {
    console.error("데이터 로딩 실패:", error);
    // 에러 발생 시 더미 데이터로 대체
    if (members.length === 0) {
      setMembers(dummyMembers);
      setFilteredMembers(dummyMembers);
    }
    return (
      <div className="text-red-500 text-center p-4 mb-4">
        {error}
        <p className="mt-2">더미 데이터로 표시합니다.</p>
      </div>
    );
  }
  
  // 데이터가 아직 없는 경우 더미 데이터로 대체
  if (members.length === 0) {
    return <div className="text-center p-4">회원 데이터가 없습니다.</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">청구회 회원 목록</h1>
      
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
              <option value="generation-asc">세대 오름차순</option>
              <option value="generation-desc">세대 내림차순</option>
              <option value="attendance-desc">참여 횟수 높은순</option>
              <option value="attendance-asc">참여 횟수 낮은순</option>
              <option value="average-asc">평균 스코어 좋은순</option>
              <option value="average-desc">평균 스코어 나쁜순</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-600">
          총 {filteredMembers.length}명의 회원이 검색되었습니다.
        </div>
      </div>
      
      {/* 회원 목록 테이블 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('name')}>
                  이름 {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('generation')}>
                  세대 {sortBy === 'generation' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">성별</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('attendance')}>
                  참여 횟수 {sortBy === 'attendance' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700 cursor-pointer" onClick={() => handleSortChange('average')}>
                  평균 스코어 {sortBy === 'average' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">연락처</th>
                <th className="py-3 px-4 text-center font-medium text-gray-700">상세 정보</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentMembers.map(member => {
                const { averageScores, attendanceCounts } = calculateAverageScores();
                const attendanceCount = attendanceCounts[member.id] || 0;
                const averageScore = averageScores[member.id] || 0;
                
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.generation}세대</td>
                    <td className="py-3 px-4">{member.gender}</td>
                    <td className="py-3 px-4">{attendanceCount}회</td>
                    <td className="py-3 px-4">{averageScore > 0 ? averageScore : '-'}</td>
                    <td className="py-3 px-4">{member.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <Link 
                        to={`/members/${member.id}`} 
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                );
              })}
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

export default MembersList;