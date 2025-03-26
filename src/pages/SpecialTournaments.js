import React from 'react';

// 청구회장배(5월, 5, 17, 29...)와 총동창회장배(10월, 10, 22, 34...) 모임 ID 목록 생성
// 가정: 3,4,5,6,8,9,10,11월 순서로 모임이 진행되고, 5월이 청구회장배, 10월이 총동창회장배
// 현실적인 데이터로 대체 필요
const identifySpecialTournaments = (scores) => {
  // 청구회장배는 5로 나눈 나머지가 5인 meeting_id로 가정 (5, 17, 29...)
  const chungguCupScores = scores.filter(score => score.meeting_id % 12 === 5);
  
  // 총동창회장배는 12로 나눈 나머지가 10인 meeting_id로 가정 (10, 22, 34...)
  const alumniCupScores = scores.filter(score => score.meeting_id % 12 === 10);
  
  return {
    chungguCupScores,
    alumniCupScores
  };
};

const SpecialTournaments = ({ scores }) => {
  const { chungguCupScores, alumniCupScores } = identifySpecialTournaments(scores);
  
  // 특별 대회 기록이 없는 경우
  if (chungguCupScores.length === 0 && alumniCupScores.length === 0) {
    return null; // 컴포넌트를 렌더링하지 않음
  }
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-500 to-yellow-600">
        <h3 className="text-xl font-semibold text-white">특별 대회 성적</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 청구회장배 성적 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              청구회장배
            </h4>
            {chungguCupScores.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">회차</th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">스코어</th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {chungguCupScores.map((score, index) => (
                    <tr key={index} className="border-t border-green-200">
                      <td className="py-2">{score.meeting_id}회</td>
                      <td className="py-2 font-medium">{score.score}</td>
                      <td className="py-2 text-sm text-gray-600">
                        {score.score < 85 ? '🏆 우수' : score.score < 90 ? '👍 양호' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-2">청구회장배 참가 기록이 없습니다.</p>
            )}
          </div>
          
          {/* 총동창회장배 성적 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              총동창회장배
            </h4>
            {alumniCupScores.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">회차</th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">스코어</th>
                    <th className="text-left text-xs font-medium text-gray-600 uppercase pb-2">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {alumniCupScores.map((score, index) => (
                    <tr key={index} className="border-t border-blue-200">
                      <td className="py-2">{score.meeting_id}회</td>
                      <td className="py-2 font-medium">{score.score}</td>
                      <td className="py-2 text-sm text-gray-600">
                        {score.score < 85 ? '🏆 우수' : score.score < 90 ? '👍 양호' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-2">총동창회장배 참가 기록이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialTournaments;