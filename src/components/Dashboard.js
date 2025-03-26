import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 대시보드 컴포넌트
const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 차트 색상
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
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
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // 성별 분포 데이터 계산
  const getGenderDistribution = () => {
    if (!members.length) return [];
    
    const maleCount = members.filter(member => member.gender === '남성').length;
    const femaleCount = members.filter(member => member.gender === '여성').length;
    
    return [
      { name: '남성', value: maleCount },
      { name: '여성', value: femaleCount }
    ];
  };
  
  // 세대별 분포 데이터 계산
  const getGenerationDistribution = () => {
    if (!members.length) return [];
    
    const generationCounts = {};
    
    members.forEach(member => {
      const gen = member.generation;
      if (generationCounts[gen]) {
        generationCounts[gen] += 1;
      } else {
        generationCounts[gen] = 1;
      }
    });
    
    // 세대 정렬 및 상위 10개 세대만 표시
    return Object.entries(generationCounts)
      .map(([generation, count]) => ({ generation: Number(generation), count }))
      .sort((a, b) => a.generation - b.generation)
      .slice(0, 10);
  };
  
  // 참여율 상위 회원 계산
  const getTopAttendees = () => {
    if (!members.length || !scores.length) return [];
    
    const attendanceCount = {};
    
    scores.forEach(score => {
      if (attendanceCount[score.member_id]) {
        attendanceCount[score.member_id] += 1;
      } else {
        attendanceCount[score.member_id] = 1;
      }
    });
    
    // 참여 횟수 기준 상위 10명
    const topIds = Object.entries(attendanceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => Number(entry[0]));
    
    return topIds.map(id => {
      const member = members.find(m => m.id === id);
      return {
        id,
        name: member ? member.name : `회원 ${id}`,
        attendance: attendanceCount[id]
      };
    });
  };
  
  // 평균 스코어 상위 회원 계산 (10회 이상 참여한 회원 중)
  const getTopPerformers = () => {
    if (!members.length || !scores.length) return [];
    
    const memberScores = {};
    const attendanceCount = {};
    
    scores.forEach(score => {
      const memberId = score.member_id;
      
      if (!memberScores[memberId]) {
        memberScores[memberId] = [];
        attendanceCount[memberId] = 0;
      }
      
      memberScores[memberId].push(score.score);
      attendanceCount[memberId] += 1;
    });
    
    // 10회 이상 참여한 회원 중 평균 스코어 계산
    const averageScores = Object.entries(memberScores)
      .filter(([id, scores]) => attendanceCount[id] >= 10)
      .map(([id, scores]) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const member = members.find(m => m.id === Number(id));
        return {
          id: Number(id),
          name: member ? member.name : `회원 ${id}`,
          averageScore: Math.round(avg * 10) / 10,
          attendance: attendanceCount[id]
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 10);
    
    return averageScores;
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">청구회 골프 모임 대시보드</h1>
      
      {/* 요약 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">총 회원 수</h2>
          <p className="text-4xl font-bold text-green-600">{members.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">총 모임 횟수</h2>
          <p className="text-4xl font-bold text-blue-600">410회</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">모임 장소</h2>
          <p className="text-2xl font-medium">이천 뉴스프링빌CC</p>
        </div>
      </div>
      
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* 성별 분포 파이 차트 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">성별 분포</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getGenderDistribution()}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {getGenderDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* 세대별 분포 바 차트 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">세대별 회원 분포 (상위 10개 세대)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getGenerationDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="generation" label={{ value: '세대', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '회원 수', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" name="회원 수" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 랭킹 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 참여율 상위 회원 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">참여율 상위 회원</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left">순위</th>
                  <th className="py-3 px-4 border-b text-left">이름</th>
                  <th className="py-3 px-4 border-b text-left">참여 횟수</th>
                </tr>
              </thead>
              <tbody>
                {getTopAttendees().map((member, index) => (
                  <tr key={member.id}>
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{member.name}</td>
                    <td className="py-2 px-4 border-b">{member.attendance}회</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 평균 스코어 상위 회원 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">평균 스코어 상위 회원 (10회 이상 참여)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left">순위</th>
                  <th className="py-3 px-4 border-b text-left">이름</th>
                  <th className="py-3 px-4 border-b text-left">평균 스코어</th>
                  <th className="py-3 px-4 border-b text-left">참여 횟수</th>
                </tr>
              </thead>
              <tbody>
                {getTopPerformers().map((member, index) => (
                  <tr key={member.id}>
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{member.name}</td>
                    <td className="py-2 px-4 border-b">{member.averageScore}</td>
                    <td className="py-2 px-4 border-b">{member.attendance}회</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;