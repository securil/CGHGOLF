import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MemberDetailPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [memberScores, setMemberScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 데이터 로딩
        const membersResponse = await fetch('/data/members.json');
        const membersData = await membersResponse.json();
        
        // 스코어 데이터 로딩
        const scoresResponse = await fetch('/data/scores.json');
        const scoresData = await scoresResponse.json();
        
        // 현재 회원 찾기
        const currentMember = membersData.find(m => m.id === parseInt(id));
        
        if (!currentMember) {
          setError('회원을 찾을 수 없습니다.');
          setLoading(false);
          return;
        }
        
        // 회원의 스코어 데이터 필터링
        const memberScoreData = scoresData.filter(score => score.member_id === parseInt(id));
        
        // 회원 및 스코어 데이터 설정
        setMember(currentMember);
        setMemberScores(memberScoreData);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [id]);
  
  // 평균 스코어 계산
  const calculateAverageScore = () => {
    if (memberScores.length === 0) return 0;
    
    const totalScore = memberScores.reduce((sum, score) => sum + score.score, 0);
    return Math.round((totalScore / memberScores.length) * 10) / 10;
  };
  
  // 최고 스코어
  const getBestScore = () => {
    if (memberScores.length === 0) return 0;
    return Math.min(...memberScores.map(score => score.score));
  };
  
  // 차트 데이터 준비
  const prepareChartData = () => {
    return memberScores
      .sort((a, b) => a.meeting_id - b.meeting_id)
      .map(score => ({
        meeting: `모임 ${score.meeting_id}`,
        score: score.score
      }));
  };
  
  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/members" className="text-blue-600 hover:underline">
          &larr; 회원 목록으로 돌아가기
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 회원 기본 정보 */}
        <div className="px-6 py-4 border-b">
          <h1 className="text-3xl font-bold text-gray-800">{member.name}</h1>
          <div className="mt-2 text-gray-600">
            <p><span className="font-semibold">세대:</span> {member.generation}세대</p>
            <p><span className="font-semibold">성별:</span> {member.gender}</p>
            <p><span className="font-semibold">연락처:</span> {member.phone}</p>
          </div>
        </div>
        
        {/* 성적 요약 */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">성적 요약</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">참여 횟수</p>
              <p className="text-2xl font-bold">{memberScores.length}회</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">평균 스코어</p>
              <p className="text-2xl font-bold">{calculateAverageScore()}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">최고 스코어</p>
              <p className="text-2xl font-bold">{getBestScore()}</p>
            </div>
          </div>
        </div>
        
        {/* 스코어 차트 */}
        {memberScores.length > 0 && (
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">스코어 추이</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="meeting" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" name="스코어" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* 상세 성적 테이블 */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">상세 성적</h2>
          {memberScores.length === 0 ? (
            <p className="text-gray-500">기록된 성적이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">모임 번호</th>
                    <th className="py-2 px-4 text-left">스코어</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {memberScores
                    .sort((a, b) => b.meeting_id - a.meeting_id) // 최신 모임 순으로 정렬
                    .map((score) => (
                      <tr key={score.meeting_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">{score.meeting_id}회</td>
                        <td className="py-2 px-4">{score.score}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;