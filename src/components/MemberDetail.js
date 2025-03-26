import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MemberDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [scores, setScores] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 모든 회원 데이터 로딩
        const membersResponse = await fetch('/data/members.json');
        const membersData = await membersResponse.json();
        
        // 모든 스코어 데이터 로딩
        const scoresResponse = await fetch('/data/scores.json');
        const scoresData = await scoresResponse.json();
        
        // 현재 회원 찾기
        const currentMember = membersData.find(m => m.id === parseInt(id));
        if (!currentMember) {
          setError('해당 회원을 찾을 수 없습니다.');
          setLoading(false);
          return;
        }
        
        // 현재 회원의 스코어 필터링
        const memberScores = scoresData.filter(s => s.member_id === parseInt(id));
        
        setMember(currentMember);
        setScores(memberScores);
        setAllMembers(membersData);
        setAllScores(scoresData);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [id]);
  
  // 회원의 모임 참석 횟수 계산
  const getAttendanceCount = () => {
    return scores.length;
  };
  
  // 평균 스코어 계산
  const getAverageScore = () => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((total, score) => total + score.score, 0);
    return Math.round((sum / scores.length) * 10) / 10;
  };
  
  // 최고 스코어
  const getBestScore = () => {
    if (scores.length === 0) return { score: 0, meeting_id: 0 };
    return scores.reduce((best, current) => 
      current.score < best.score ? current : best, scores[0]);
  };
  
  // 최저 스코어
  const getWorstScore = () => {
    if (scores.length === 0) return { score: 0, meeting_id: 0 };
    return scores.reduce((worst, current) => 
      current.score > worst.score ? current : worst, scores[0]);
  };
  
  // 같은 세대 회원 중 랭킹 계산
  const getGenerationRanking = () => {
    if (!member || allMembers.length === 0 || allScores.length === 0) return { rank: 0, total: 0 };
    
    // 같은 세대 회원 필터링
    const sameGeneration = allMembers.filter(m => m.generation === member.generation);
    
    // 각 회원의 평균 스코어 계산
    const averageScores = sameGeneration.map(m => {
      const memberScores = allScores.filter(s => s.member_id === m.id);
      if (memberScores.length === 0) return { id: m.id, average: Infinity };
      
      const sum = memberScores.reduce((total, score) => total + score.score, 0);
      return {
        id: m.id,
        average: sum / memberScores.length
      };
    })
    .filter(m => m.average !== Infinity)
    .sort((a, b) => a.average - b.average);
    
    // 현재 회원의 랭킹 찾기
    const rank = averageScores.findIndex(m => m.id === parseInt(id)) + 1;
    
    return {
      rank,
      total: averageScores.length
    };
  };
  
  // 스코어 추이 차트 데이터
  const getScoreTrendData = () => {
    return scores
      .sort((a, b) => a.meeting_id - b.meeting_id)
      .map(score => ({
        meeting: `모임 ${score.meeting_id}`,
        score: score.score
      }));
  };
  
  // 전체 평균과 회원 평균 비교 데이터
  const getComparisonData = () => {
    if (allScores.length === 0) return [];
    
    // 모임별 전체 평균 계산
    const meetingAverages = {};
    allScores.forEach(score => {
      if (!meetingAverages[score.meeting_id]) {
        meetingAverages[score.meeting_id] = {
          sum: 0,
          count: 0
        };
      }
      meetingAverages[score.meeting_id].sum += score.score;
      meetingAverages[score.meeting_id].count += 1;
    });
    
    // 회원이 참가한 모임만 필터링하여 비교 데이터 생성
    return scores
      .sort((a, b) => a.meeting_id - b.meeting_id)
      .map(score => {
        const meetingAvg = meetingAverages[score.meeting_id];
        const overallAverage = meetingAvg ? meetingAvg.sum / meetingAvg.count : 0;
        
        return {
          meeting: `모임 ${score.meeting_id}`,
          회원점수: score.score,
          전체평균: Math.round(overallAverage * 10) / 10
        };
      });
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!member) return <div className="text-center p-4">회원 정보를 찾을 수 없습니다.</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/members" className="text-blue-600 hover:text-blue-800">
          &larr; 회원 목록으로 돌아가기
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">{member.name} 회원 프로필</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-600">회원 정보</h2>
            <p className="mt-2"><span className="font-medium">이름:</span> {member.name}</p>
            <p className="mt-1"><span className="font-medium">세대:</span> {member.generation}세대</p>
            <p className="mt-1"><span className="font-medium">성별:</span> {member.gender}</p>
            <p className="mt-1"><span className="font-medium">연락처:</span> {member.phone}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-600">참여 통계</h2>
            <p className="mt-2"><span className="font-medium">총 참여 횟수:</span> {getAttendanceCount()}회</p>
            <p className="mt-1"><span className="font-medium">참여율:</span> {Math.round((getAttendanceCount() / 410) * 100)}%</p>
            <p className="mt-1"><span className="font-medium">세대 내 랭킹:</span> {getGenerationRanking().rank}/{getGenerationRanking().total}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-600">성적 통계</h2>
            <p className="mt-2"><span className="font-medium">평균 스코어:</span> {getAverageScore()}</p>
            <p className="mt-1"><span className="font-medium">최고 기록:</span> {getBestScore().score} (모임 {getBestScore().meeting_id})</p>
            <p className="mt-1"><span className="font-medium">최저 기록:</span> {getWorstScore().score} (모임 {getWorstScore().meeting_id})</p>
          </div>
        </div>
      </div>
      
      {/* 스코어 추이 차트 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">스코어 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getScoreTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="meeting" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" name="스코어" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* 전체 평균과 비교 차트 */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">전체 평균과 비교</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getComparisonData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="meeting" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="회원점수" stroke="#8884d8" />
            <Line type="monotone" dataKey="전체평균" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* 개별 스코어 기록 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">전체 스코어 기록</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left">모임 번호</th>
                <th className="py-3 px-4 border-b text-left">스코어</th>
                <th className="py-3 px-4 border-b text-left">전체 평균과 차이</th>
              </tr>
            </thead>
            <tbody>
              {getComparisonData().map((data, index) => {
                const difference = data.회원점수 - data.전체평균;
                
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{data.meeting}</td>
                    <td className="py-2 px-4 border-b">{data.회원점수}</td>
                    <td className={`py-2 px-4 border-b ${difference < 0 ? 'text-green-600' : difference > 0 ? 'text-red-600' : ''}`}>
                      {difference < 0 ? '-' : '+'}{Math.abs(difference).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;