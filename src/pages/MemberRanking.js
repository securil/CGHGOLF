import React, { useState, useEffect } from 'react';

const MemberRanking = ({ memberId, generation }) => {
  const [rankings, setRankings] = useState({
    overall: { rank: 0, total: 0 },
    generation: { rank: 0, total: 0 },
    recent: { rank: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateRankings = async () => {
      try {
        // 회원 데이터 불러오기
        const membersResponse = await fetch('/data/members.json');
        const membersData = await membersResponse.json();
        
        // 스코어 데이터 불러오기
        const scoresResponse = await fetch('/data/scores.json');
        const scoresData = await scoresResponse.json();
        
        // 평균 스코어 계산 함수
        const calculateAverageScore = (memberScores) => {
          if (memberScores.length === 0) return Infinity; // 스코어가 없으면 순위에서 제외
          return memberScores.reduce((sum, score) => sum + score.score, 0) / memberScores.length;
        };
        
        // 최근 스코어 계산 함수 (최근 5회)
        const calculateRecentScore = (memberScores) => {
          if (memberScores.length === 0) return Infinity;
          // meeting_id 기준으로 정렬하여 최근 5개 가져오기
          const sortedScores = [...memberScores].sort((a, b) => b.meeting_id - a.meeting_id).slice(0, 5);
          return calculateAverageScore(sortedScores);
        };
        
        // 각 회원별 평균 스코어 계산
        const memberAverages = [];
        const generationAverages = [];
        const recentAverages = [];
        
        membersData.forEach(member => {
          const memberScores = scoresData.filter(score => score.member_id === member.id);
          
          if (memberScores.length > 0) {
            const average = calculateAverageScore(memberScores);
            const recentAverage = calculateRecentScore(memberScores);
            
            memberAverages.push({ id: member.id, average, name: member.name });
            recentAverages.push({ id: member.id, average: recentAverage, name: member.name });
            
            if (member.generation === generation) {
              generationAverages.push({ id: member.id, average, name: member.name });
            }
          }
        });
        
        // 평균 스코어 기준으로 정렬 (낮은 순)
        memberAverages.sort((a, b) => a.average - b.average);
        generationAverages.sort((a, b) => a.average - b.average);
        recentAverages.sort((a, b) => a.average - b.average);
        
        // 현재 회원의 순위 찾기
        const overallRank = memberAverages.findIndex(item => item.id === parseInt(memberId)) + 1;
        const generationRank = generationAverages.findIndex(item => item.id === parseInt(memberId)) + 1;
        const recentRank = recentAverages.findIndex(item => item.id === parseInt(memberId)) + 1;
        
        setRankings({
          overall: { 
            rank: overallRank, 
            total: memberAverages.length,
            percentile: Math.round((memberAverages.length - overallRank + 1) / memberAverages.length * 100)
          },
          generation: { 
            rank: generationRank, 
            total: generationAverages.length,
            percentile: generationRank > 0 ? Math.round((generationAverages.length - generationRank + 1) / generationAverages.length * 100) : 0
          },
          recent: { 
            rank: recentRank, 
            total: recentAverages.length,
            percentile: recentRank > 0 ? Math.round((recentAverages.length - recentRank + 1) / recentAverages.length * 100) : 0
          }
        });
        
        setLoading(false);
      } catch (err) {
        setError('랭킹 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        console.error('Error calculating rankings:', err);
      }
    };
    
    calculateRankings();
  }, [memberId, generation]);
  
  if (loading) return <div className="text-center p-4">랭킹 정보 로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-500 to-indigo-600">
        <h3 className="text-xl font-semibold text-white">회원 랭킹 정보</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 전체 순위 */}
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <h4 className="text-lg font-medium text-indigo-800 mb-1">전체 순위</h4>
            {rankings.overall.rank > 0 ? (
              <>
                <div className="text-3xl font-bold text-indigo-700 my-2">
                  {rankings.overall.rank} <span className="text-sm font-normal text-indigo-600">/ {rankings.overall.total}</span>
                </div>
                <div className="text-sm text-indigo-600">
                  상위 {rankings.overall.percentile}%
                </div>
              </>
            ) : (
              <div className="text-gray-500 mt-2">순위 정보 없음</div>
            )}
          </div>
          
          {/* 세대별 순위 */}
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="text-lg font-medium text-purple-800 mb-1">{generation}세대 순위</h4>
            {rankings.generation.rank > 0 ? (
              <>
                <div className="text-3xl font-bold text-purple-700 my-2">
                  {rankings.generation.rank} <span className="text-sm font-normal text-purple-600">/ {rankings.generation.total}</span>
                </div>
                <div className="text-sm text-purple-600">
                  상위 {rankings.generation.percentile}%
                </div>
              </>
            ) : (
              <div className="text-gray-500 mt-2">순위 정보 없음</div>
            )}
          </div>
          
          {/* 최근 성적 순위 */}
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="text-lg font-medium text-blue-800 mb-1">최근 성적 순위</h4>
            {rankings.recent.rank > 0 ? (
              <>
                <div className="text-3xl font-bold text-blue-700 my-2">
                  {rankings.recent.rank} <span className="text-sm font-normal text-blue-600">/ {rankings.recent.total}</span>
                </div>
                <div className="text-sm text-blue-600">
                  상위 {rankings.recent.percentile}%
                </div>
              </>
            ) : (
              <div className="text-gray-500 mt-2">순위 정보 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRanking;