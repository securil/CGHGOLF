import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const Statistics = () => {
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);
  
  // 통계 데이터
  const [topAttendees, setTopAttendees] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [yearlyAverages, setYearlyAverages] = useState([]);
  const [genderComparison, setGenderComparison] = useState([]);
  const [generationAverages, setGenerationAverages] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 데이터 로딩
        const membersResponse = await fetch('/data/members.json');
        const membersData = await membersResponse.json();
        
        // 스코어 데이터 로딩
        const scoresResponse = await fetch('/data/scores.json');
        const scoresData = await scoresResponse.json();
        
        setMembers(membersData);
        setScores(scoresData);
        
        // 가용 연도 설정 (실제 데이터에서 추출하는 로직으로 대체 필요)
        // 현재는 2022-2025 연도로 설정
        setAvailableYears([2022, 2023, 2024, 2025]);
        
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // 선택된 연도가 변경될 때마다 통계 계산
  useEffect(() => {
    if (members.length > 0 && scores.length > 0) {
      calculateStatistics();
    }
  }, [members, scores, selectedYear]);
  
  // 통계 계산 함수
  const calculateStatistics = () => {
    // 선택된 연도에 맞는 스코어 필터링 (실제 구현 필요)
    const filteredScores = selectedYear === 'all' 
      ? scores 
      : scores.filter(score => {
          // 실제로는 meeting_id를 기반으로 연도 필터링 로직 구현 필요
          return true; // 임시 로직
        });
    
    // 1. 참석률 상위 10명 계산
    calculateTopAttendees(filteredScores);
    
    // 2. 평균 스코어 상위 10명 계산
    calculateTopScorers(filteredScores);
    
    // 3. 연도별 평균 스코어 계산
    calculateYearlyAverages();
    
    // 4. 성별 스코어 비교 계산
    calculateGenderComparison(filteredScores);
    
    // 5. 세대별 평균 스코어 계산
    calculateGenerationAverages(filteredScores);
  };
  
  // 참석률 상위 10명 계산
  const calculateTopAttendees = (filteredScores) => {
    // 회원별 참석 횟수 집계
    const attendanceCounts = {};
    members.forEach(member => {
      attendanceCounts[member.id] = 0;
    });
    
    filteredScores.forEach(score => {
      if (attendanceCounts[score.member_id] !== undefined) {
        attendanceCounts[score.member_id]++;
      }
    });
    
    // 참석 횟수로 정렬
    const sortedAttendees = Object.entries(attendanceCounts)
      .map(([memberId, count]) => {
        const member = members.find(m => m.id === parseInt(memberId));
        return {
          id: parseInt(memberId),
          name: member ? member.name : `회원 ${memberId}`,
          count,
          generation: member ? member.generation : 'N/A'
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    setTopAttendees(sortedAttendees);
  };
  
  // 평균 스코어 상위 10명 계산
  const calculateTopScorers = (filteredScores) => {
    // 회원별 평균 스코어 계산
    const scoreData = {};
    
    filteredScores.forEach(score => {
      if (!scoreData[score.member_id]) {
        scoreData[score.member_id] = {
          totalScore: 0,
          count: 0
        };
      }
      
      scoreData[score.member_id].totalScore += score.score;
      scoreData[score.member_id].count++;
    });
    
    // 평균 계산 및 정렬
    const averageScores = Object.entries(scoreData)
      .map(([memberId, data]) => {
        const member = members.find(m => m.id === parseInt(memberId));
        const average = Math.round((data.totalScore / data.count) * 10) / 10;
        
        return {
          id: parseInt(memberId),
          name: member ? member.name : `회원 ${memberId}`,
          average,
          count: data.count,
          gender: member ? member.gender : 'N/A',
          generation: member ? member.generation : 'N/A'
        };
      })
      .filter(item => item.count >= 3) // 최소 3회 이상 참여한 회원만
      .sort((a, b) => a.average - b.average) // 낮은 점수가 좋은 것이므로 오름차순
      .slice(0, 10);
    
    setTopScorers(averageScores);
  };
  
  // 연도별 평균 스코어 계산
  const calculateYearlyAverages = () => {
    // 실제로는 meeting_id를 연도로 매핑하는 로직 필요
    // 아래는 예시 데이터
    const yearlyData = [
      { year: 2022, average: 89.5 },
      { year: 2023, average: 88.2 },
      { year: 2024, average: 87.9 },
      { year: 2025, average: 87.3 }
    ];
    
    setYearlyAverages(yearlyData);
  };
  
  // 성별 스코어 비교 계산
  const calculateGenderComparison = (filteredScores) => {
    const genderData = {
      male: { totalScore: 0, count: 0 },
      female: { totalScore: 0, count: 0 }
    };
    
    filteredScores.forEach(score => {
      const member = members.find(m => m.id === score.member_id);
      if (member) {
        const gender = member.gender === '남성' ? 'male' : 'female';
        genderData[gender].totalScore += score.score;
        genderData[gender].count++;
      }
    });
    
    const maleAvg = genderData.male.count > 0 
      ? Math.round((genderData.male.totalScore / genderData.male.count) * 10) / 10 
      : 0;
      
    const femaleAvg = genderData.female.count > 0 
      ? Math.round((genderData.female.totalScore / genderData.female.count) * 10) / 10 
      : 0;
    
    setGenderComparison([
      { name: '남성', value: maleAvg, count: genderData.male.count },
      { name: '여성', value: femaleAvg, count: genderData.female.count }
    ]);
  };
  
  // 세대별 평균 스코어 계산
  const calculateGenerationAverages = (filteredScores) => {
    const genData = {};
    
    // 각 세대별 데이터 초기화
    members.forEach(member => {
      const gen = member.generation;
      if (!genData[gen]) {
        genData[gen] = { totalScore: 0, count: 0 };
      }
    });
    
    // 세대별 점수 합산
    filteredScores.forEach(score => {
      const member = members.find(m => m.id === score.member_id);
      if (member) {
        const gen = member.generation;
        genData[gen].totalScore += score.score;
        genData[gen].count++;
      }
    });
    
    // 평균 계산 및 데이터 변환
    const genAverages = Object.entries(genData)
      .map(([gen, data]) => {
        const average = data.count > 0 
          ? Math.round((data.totalScore / data.count) * 10) / 10 
          : 0;
          
        return {
          generation: parseInt(gen),
          average,
          count: data.count
        };
      })
      .filter(item => item.count > 0) // 데이터가 있는 세대만
      .sort((a, b) => a.generation - b.generation); // 세대 순으로 정렬
    
    setGenerationAverages(genAverages);
  };
  
  // 전체 평균 스코어 계산
  const getOverallAverage = () => {
    if (scores.length === 0) return 0;
    
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    return Math.round((totalScore / scores.length) * 10) / 10;
  };
  
  // 연도 선택 핸들러
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  
  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">청구회 골프 통계</h1>
      
      {/* 연도 필터 */}
      <div className="mb-8 flex justify-center">
        <div className="inline-block">
          <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-2">연도 선택</label>
          <select
            id="yearFilter"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="all">모든 연도</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}년</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 요약 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">총 회원 수</span>
              <div className="text-lg font-semibold">{members.length}명</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">누적 모임 횟수</span>
              <div className="text-lg font-semibold">410회</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">요약 통계</span>
              <div className="text-lg font-semibold">평균 스코어: {getOverallAverage()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 그래프 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 참석률 상위 10명 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">참석률 상위 10명</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topAttendees}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="참석 횟수" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 평균 스코어 상위 10명 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">평균 스코어 상위 10명</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topScorers}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" name="평균 스코어" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 연도별 평균 스코어 추이 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">연도별 평균 스코어 추이</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyAverages}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" name="평균 스코어" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 성별 평균 스코어 비교 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">성별 평균 스코어 비교</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genderComparison}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="평균 스코어" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 세대별 평균 스코어 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">세대별 평균 스코어</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={generationAverages}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="generation" label={{ value: '세대', position: 'insideBottomRight', offset: 0 }} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" name="평균 스코어" fill="#413ea0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 데이터 요약 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <h2 className="text-xl font-bold p-6 border-b">통계 데이터 요약</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">항목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">값</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">전체 평균 스코어</td>
                <td className="px-6 py-4 whitespace-nowrap">{getOverallAverage()}</td>
                <td className="px-6 py-4 whitespace-nowrap">모든 모임의 평균</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">최고 스코어</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {scores.length > 0 ? Math.min(...scores.map(s => s.score)) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">역대 최저 타수</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">전체 참여 기록</td>
                <td className="px-6 py-4 whitespace-nowrap">{scores.length}건</td>
                <td className="px-6 py-4 whitespace-nowrap">누적 참여 횟수</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">청구회 연혁</td>
                <td className="px-6 py-4 whitespace-nowrap">410회</td>
                <td className="px-6 py-4 whitespace-nowrap">2025년 3월 기준</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;