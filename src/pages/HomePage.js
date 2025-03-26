import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// 데이터 임포트
import membersData from '../data/members.json';
import scoresData from '../data/scores.json';

const HomePage = () => {
  const [topMembers, setTopMembers] = useState([]);
  const [participationByGeneration, setParticipationByGeneration] = useState([]);
  const [averageScoresByMeeting, setAverageScoresByMeeting] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  
  useEffect(() => {
    // 1. 상위 성적 회원 계산
    calculateTopMembers();
    
    // 2. 기수별 참여 현황 계산
    calculateParticipationByGeneration();
    
    // 3. 모임별 평균 스코어 계산
    calculateAverageScoresByMeeting();
    
    // 4. 성별 분포 계산
    calculateGenderDistribution();
    
    // 5. 최근 모임 정보 계산
    calculateRecentMeetings();
  }, []);
  
  // 1. 상위 성적 회원 계산 함수
  const calculateTopMembers = () => {
    // 회원별 평균 스코어 계산
    const memberAverages = {};
    const participationCount = {};
    
    scoresData.forEach(score => {
      const { member_id, score: scoreValue } = score;
      
      if (!memberAverages[member_id]) {
        memberAverages[member_id] = 0;
        participationCount[member_id] = 0;
      }
      
      memberAverages[member_id] += scoreValue;
      participationCount[member_id]++;
    });
    
    // 평균 계산 및 정렬 가능한 배열로 변환
    const membersWithAverage = Object.keys(memberAverages)
      .filter(memberId => participationCount[memberId] >= 5) // 최소 5회 이상 참여한 회원만
      .map(memberId => {
        const member = membersData.find(m => m.id === parseInt(memberId));
        const average = memberAverages[memberId] / participationCount[memberId];
        
        return {
          id: parseInt(memberId),
          name: member ? member.name : '알 수 없음',
          generation: member ? member.generation : 0,
          averageScore: Math.round(average * 10) / 10,
          participation: participationCount[memberId]
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore); // 낮은 스코어가 좋은 성적
    
    setTopMembers(membersWithAverage.slice(0, 5)); // 상위 5명만 선택
  };
  
  // 2. 기수별 참여 현황 계산 함수
  const calculateParticipationByGeneration = () => {
    // 기수별 회원 수 및 참여 횟수 계산
    const generationStats = {};
    
    // 기수별 회원 수 계산
    membersData.forEach(member => {
      const { generation } = member;
      
      if (!generationStats[generation]) {
        generationStats[generation] = {
          generation,
          memberCount: 0,
          participationCount: 0,
          averageParticipation: 0
        };
      }
      
      generationStats[generation].memberCount++;
    });
    
    // 기수별 참여 횟수 계산
    scoresData.forEach(score => {
      const { member_id } = score;
      const member = membersData.find(m => m.id === member_id);
      
      if (member && generationStats[member.generation]) {
        generationStats[member.generation].participationCount++;
      }
    });
    
    // 평균 참여율 계산
    Object.keys(generationStats).forEach(generation => {
      const { memberCount, participationCount } = generationStats[generation];
      generationStats[generation].averageParticipation = memberCount > 0 
        ? Math.round((participationCount / memberCount) * 10) / 10
        : 0;
    });
    
    // 정렬된 배열로 변환 (최신 기수부터)
    const sortedGenerationStats = Object.values(generationStats)
      .sort((a, b) => b.generation - a.generation)
      .slice(0, 10); // 최신 10개 기수만
    
    setParticipationByGeneration(sortedGenerationStats);
  };
  
  // 3. 모임별 평균 스코어 계산 함수
  const calculateAverageScoresByMeeting = () => {
    // 모임별 스코어 모음
    const meetingScores = {};
    
    scoresData.forEach(score => {
      const { meeting_id, score: scoreValue } = score;
      
      if (!meetingScores[meeting_id]) {
        meetingScores[meeting_id] = {
          meeting_id,
          scores: [],
          averageScore: 0,
          participantCount: 0
        };
      }
      
      meetingScores[meeting_id].scores.push(scoreValue);
      meetingScores[meeting_id].participantCount++;
    });
    
    // 평균 계산
    Object.keys(meetingScores).forEach(meetingId => {
      const { scores } = meetingScores[meetingId];
      const sum = scores.reduce((acc, curr) => acc + curr, 0);
      meetingScores[meetingId].averageScore = Math.round((sum / scores.length) * 10) / 10;
    });
    
    // 정렬된 배열로 변환 (최근 15개 모임)
    const sortedMeetingStats = Object.values(meetingScores)
      .sort((a, b) => b.meeting_id - a.meeting_id)
      .slice(0, 15)
      .reverse();
    
    setAverageScoresByMeeting(sortedMeetingStats);
  };
  
  // 4. 성별 분포 계산 함수
  const calculateGenderDistribution = () => {
    const genderCount = {
      남성: 0,
      여성: 0
    };
    
    membersData.forEach(member => {
      if (member.gender === '남성') genderCount.남성++;
      else if (member.gender === '여성') genderCount.여성++;
    });
    
    const genderData = [
      { name: '남성', value: genderCount.남성 },
      { name: '여성', value: genderCount.여성 }
    ];
    
    setGenderDistribution(genderData);
  };
  
  // 5. 최근 모임 정보 계산 함수
  const calculateRecentMeetings = () => {
    // 모임 ID 중 가장 큰 값들을 최근 모임으로 추정
    const meetingIds = [...new Set(scoresData.map(score => score.meeting_id))];
    const sortedMeetingIds = meetingIds.sort((a, b) => b - a).slice(0, 3);
    
    // 각 모임별 참가자 및 우승자 정보 수집
    const meetings = sortedMeetingIds.map(meetingId => {
      const meetingScores = scoresData
        .filter(score => score.meeting_id === meetingId)
        .sort((a, b) => a.score - b.score);
      
      const winner = meetingScores.length > 0 ? {
        id: meetingScores[0].member_id,
        score: meetingScores[0].score
      } : null;
      
      const winnerInfo = winner ? 
        membersData.find(m => m.id === winner.id) : null;
      
      return {
        id: meetingId,
        date: `모임 ${meetingId}회`, // 실제 날짜 정보가 없으므로 회차로 대체
        participantCount: meetingScores.length,
        averageScore: Math.round(meetingScores.reduce((sum, s) => sum + s.score, 0) / meetingScores.length * 10) / 10,
        winner: winnerInfo ? {
          name: winnerInfo.name,
          generation: winnerInfo.generation,
          score: winner.score
        } : null
      };
    });
    
    setRecentMeetings(meetings);
  };
  
  // 파이 차트 색상
  const GENDER_COLORS = ['#3B82F6', '#EC4899'];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">청구회 골프 홈페이지</h1>
      
      {/* 최근 모임 정보 카드 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">최근 모임</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentMeetings.map(meeting => (
            <div key={meeting.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="text-xl font-bold">{meeting.date}</h3>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="font-semibold">참가자:</span> {meeting.participantCount}명
                </div>
                <div className="mb-2">
                  <span className="font-semibold">평균 스코어:</span> {meeting.averageScore}
                </div>
                {meeting.winner && (
                  <div className="mb-2">
                    <span className="font-semibold">우승자:</span> {meeting.winner.name} ({meeting.winner.generation}기) - {meeting.winner.score}점
                  </div>
                )}
                <Link 
                  to={`/results/${meeting.id}`} 
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  상세 결과 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 통계 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 상위 성적 회원 차트 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">상위 성적 회원 (최소 5회 참여)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topMembers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip 
                  formatter={(value, name, props) => [value, '평균 스코어']}
                  labelFormatter={(value) => `${value} (${topMembers.find(m => m.name === value)?.generation}기)`}
                />
                <Legend />
                <Bar dataKey="averageScore" fill="#3B82F6" name="평균 스코어" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 모임별 평균 스코어 추이 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">모임별 평균 스코어 추이</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={averageScoresByMeeting.map(meeting => ({
                  name: `${meeting.meeting_id}회`,
                  평균: meeting.averageScore,
                  참가: meeting.participantCount
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 10']} />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="평균" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                  name="평균 스코어"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="참가" 
                  stroke="#10B981" 
                  name="참가자 수"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 기수별 평균 참여 횟수 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">기수별 회원/참여 현황</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={participationByGeneration.map(gen => ({
                  name: `${gen.generation}기`,
                  회원수: gen.memberCount,
                  평균참여: gen.averageParticipation
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="회원수" fill="#3B82F6" name="회원 수" />
                <Bar yAxisId="right" dataKey="평균참여" fill="#EC4899" name="1인당 평균 참여 횟수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 성별 분포 파이 차트 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">회원 성별 분포</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}명`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 하단 버튼 영역 */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/schedule" 
          className="bg-blue-600 text-white text-center py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          모임 일정 보기
        </Link>
        <Link 
          to="/members" 
          className="bg-green-600 text-white text-center py-4 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          회원 목록 보기
        </Link>
        <Link 
          to="/results" 
          className="bg-purple-600 text-white text-center py-4 px-6 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
        >
          모든 결과 보기
        </Link>
      </div>
    </div>
  );
};

export default HomePage;