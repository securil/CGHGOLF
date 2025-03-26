import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 데이터 임포트
import membersData from '../data/members.json';
import scoresData from '../data/scores.json';

const MemberDetailPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [memberScores, setMemberScores] = useState([]);
  const [stats, setStats] = useState({
    totalParticipation: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    recentTrend: 'stable' // 'improving', 'declining', 'stable'
  });

  useEffect(() => {
    // 회원 정보 찾기
    const foundMember = membersData.find(m => m.id === parseInt(id));
    
    if (foundMember) {
      setMember(foundMember);
      
      // 회원의 스코어 데이터 찾기
      const scores = scoresData.filter(score => score.member_id === parseInt(id));
      
      // 스코어를 모임 ID(meeting_id)로 정렬
      const sortedScores = scores.sort((a, b) => a.meeting_id - b.meeting_id);
      setMemberScores(sortedScores);
      
      // 통계 계산
      if (scores.length > 0) {
        const totalScores = scores.reduce((sum, score) => sum + score.score, 0);
        const average = Math.round((totalScores / scores.length) * 10) / 10;
        
        const scoreValues = scores.map(s => s.score);
        const best = Math.min(...scoreValues);
        const worst = Math.max(...scoreValues);
        
        // 최근 추세 계산 (최근 3회 vs 이전 3회)
        let trend = 'stable';
        if (scores.length >= 6) {
          const recentThree = scores.slice(-3);
          const previousThree = scores.slice(-6, -3);
          
          const recentAvg = recentThree.reduce((sum, s) => sum + s.score, 0) / 3;
          const previousAvg = previousThree.reduce((sum, s) => sum + s.score, 0) / 3;
          
          if (recentAvg < previousAvg - 1) trend = 'improving';
          else if (recentAvg > previousAvg + 1) trend = 'declining';
        }
        
        setStats({
          totalParticipation: scores.length,
          averageScore: average,
          bestScore: best,
          worstScore: worst,
          recentTrend: trend
        });
      }
    }
  }, [id]);

  // 차트 데이터 포맷 변환
  const chartData = memberScores.map(score => ({
    meeting: `모임 ${score.meeting_id}`,
    score: score.score
  }));

  // 최근 10개의 데이터만 표시
  const recentChartData = chartData.slice(-10);

  if (!member) {
    return <div className="flex justify-center items-center h-screen">회원을 찾을 수 없습니다...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/members" className="text-blue-600 hover:text-blue-800">
          &larr; 회원 목록으로 돌아가기
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 회원 기본 정보 섹션 */}
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-3xl font-bold">{member.name}</h1>
          <div className="flex flex-wrap mt-2">
            <div className="mr-6">
              <span className="font-semibold">기수:</span> {member.generation}기
            </div>
            <div className="mr-6">
              <span className="font-semibold">성별:</span> {member.gender}
            </div>
            <div>
              <span className="font-semibold">연락처:</span> {member.phone}
            </div>
          </div>
        </div>
        
        {/* 통계 정보 섹션 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-4">골프 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-600">참여 횟수</div>
              <div className="text-2xl font-bold">{stats.totalParticipation}회</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-600">평균 스코어</div>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-600">최고 스코어</div>
              <div className="text-2xl font-bold">{stats.bestScore}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-600">최저 스코어</div>
              <div className="text-2xl font-bold">{stats.worstScore}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-gray-600">최근 추세:</div>
            <div className={`font-bold ${
              stats.recentTrend === 'improving' ? 'text-green-600' : 
              stats.recentTrend === 'declining' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {stats.recentTrend === 'improving' ? '상승세' : 
               stats.recentTrend === 'declining' ? '하락세' : '안정적'}
            </div>
          </div>
        </div>
        
        {/* 스코어 추이 차트 섹션 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-4">스코어 추이</h2>
          {memberScores.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={recentChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="meeting" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    activeDot={{ r: 8 }} 
                    name="스코어"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-sm text-gray-500 text-center mt-2">
                * 낮은 스코어가 더 좋은 성적을 의미합니다
              </div>
            </div>
          ) : (
            <div className="text-gray-500 p-4 bg-gray-100 rounded">
              스코어 데이터가 없습니다.
            </div>
          )}
        </div>
        
        {/* 상세 성적 목록 섹션 */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">상세 성적</h2>
          {memberScores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">모임 번호</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">스코어</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 대비</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberScores.map((score, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{score.meeting_id}회</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{score.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          score.score < stats.averageScore 
                            ? 'bg-green-100 text-green-800' 
                            : score.score > stats.averageScore 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {score.score < stats.averageScore ? '-' : score.score > stats.averageScore ? '+' : ''}
                          {Math.abs(Math.round((score.score - stats.averageScore) * 10) / 10)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 p-4 bg-gray-100 rounded">
              참가 기록이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;