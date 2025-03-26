import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

// 데이터 임포트
import membersData from '../data/members.json';
import scoresData from '../data/scores.json';

const ResultsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingResults, setMeetingResults] = useState([]);
  const [generationComparison, setGenerationComparison] = useState([]);
  const [yearlyAverages, setYearlyAverages] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  
  useEffect(() => {
    // 1. 모든 모임 목록 가져오기
    getAllMeetings();
    
    // 2. 기수별 성적 비교 데이터 계산
    calculateGenerationComparison();
    
    // 3. 연도별(추정) 평균 스코어 계산
    calculateYearlyAverages();
    
    // 4. 상위 성적 회원 계산
    calculateTopPerformers();
  }, []);
  
  // 모임이 선택되었을 때 해당 모임의 결과 로드
  useEffect(() => {
    if (selectedMeeting) {
      loadMeetingResults(selectedMeeting);
    }
  }, [selectedMeeting]);
  
  // 1. 모든 모임 목록 가져오기
  const getAllMeetings = () => {
    // 모든 고유한 모임 ID 추출
    const meetingIds = [...new Set(scoresData.map(score => score.meeting_id))];
    
    // 각 모임에 대한 기본 정보 수집
    const meetingsData = meetingIds.map(id => {
      const meetingScores = scoresData.filter(score => score.meeting_id === id);
      const participantCount = meetingScores.length;
      const averageScore = Math.round(
        meetingScores.reduce((sum, score) => sum + score.score, 0) / participantCount * 10
      ) / 10;
      
      return {
        id,
        name: `모임 ${id}회`,
        participantCount,
        averageScore
      };
    });
    
    // 모임 ID 기준으로 정렬 (최신순)
    const sortedMeetings = meetingsData.sort((a, b) => b.id - a.id);
    setMeetings(sortedMeetings);
    
    // 가장 최근 모임을 기본 선택
    if (sortedMeetings.length > 0) {
      setSelectedMeeting(sortedMeetings[0].id);
    }
  };
  
  // 특정 모임의 결과 로드
  const loadMeetingResults = (meetingId) => {
    const meetingScores = scoresData
      .filter(score => score.meeting_id === meetingId)
      .map(score => {
        const member = membersData.find(m => m.id === score.member_id);
        return {
          memberId: score.member_id,
          name: member ? member.name : '알 수 없음',
          generation: member ? member.generation : 0,
          gender: member ? member.gender : '-',
          score: score.score
        };
      })
      .sort((a, b) => a.score - b.score); // 낮은 스코어가 좋은 성적
    
    setMeetingResults(meetingScores);
  };
  
  // 2. 기수별 성적 비교 데이터 계산
  const calculateGenerationComparison = () => {
    // 기수별 스코어 수집
    const generationScores = {};
    
    scoresData.forEach(score => {
      const member = membersData.find(m => m.id === score.member_id);
      if (!member) return;
      
      const { generation } = member;
      
      if (!generationScores[generation]) {
        generationScores[generation] = {
          generation,
          scores: [],
          memberCount: 0,
          participationCount: 0
        };
      }
      
      generationScores[generation].scores.push(score.score);
      generationScores[generation].participationCount++;
    });
    
    // 각 기수별 회원 수 계산
    membersData.forEach(member => {
      const { generation } = member;
      if (generationScores[generation]) {
        generationScores[generation].memberCount++;
      }
    });
    
    // 평균 계산
    Object.keys(generationScores).forEach(generation => {
      const { scores, memberCount, participationCount } = generationScores[generation];
      
      generationScores[generation].averageScore = 
        Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10;
        
      generationScores[generation].participationRate = 
        Math.round((participationCount / memberCount) * 10) / 10;
    });
    
    // 결과를 배열로 변환하고 기수 순으로 정렬
    const comparisonData = Object.values(generationScores)
      .filter(gen => gen.scores.length >= 10) // 최소 10개 이상의 스코어가 있는 기수만
      .sort((a, b) => a.generation - b.generation);
    
    setGenerationComparison(comparisonData);
  };
  
  // 3. 연도별(추정) 평균 스코어 계산
  const calculateYearlyAverages = () => {
    // 실제 데이터에 날짜가 없으므로, 모임 ID를 기준으로 년도를 추정
    // 예: 1~10회는 1년차, 11~20회는 2년차, ... 등으로 가정
    const yearGroupSize = 10; // 10회 단위로 1년으로 추정
    
    const yearlyScores = {};
    
    scoresData.forEach(score => {
      const year = Math.ceil(score.meeting_id / yearGroupSize);
      
      if (!yearlyScores[year]) {
        yearlyScores[year] = {
          year,
          yearLabel: `${year}년차`,
          scores: [],
          meetingIds: new Set()
        };
      }
      
      yearlyScores[year].scores.push(score.score);
      yearlyScores[year].meetingIds.add(score.meeting_id);
    });
    
    // 평균 계산
    Object.keys(yearlyScores).forEach(year => {
      const { scores, meetingIds } = yearlyScores[year];
      
      yearlyScores[year].averageScore = 
        Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10;
        
      yearlyScores[year].meetingCount = meetingIds.size;
      yearlyScores[year].participantCount = scores.length;
    });
    
    // 배열로 변환하고 년도 순으로 정렬
    const sortedYearlyData = Object.values(yearlyScores)
      .sort((a, b) => a.year - b.year);
    
    setYearlyAverages(sortedYearlyData);
  };
  
  // 4. 상위 성적 회원 계산 (각 기수별 최고 성적자)
  const calculateTopPerformers = () => {
    // 기수별 성적 모음
    const generationPerformers = {};
    
    // 각 회원별 평균 스코어 계산
    const memberAverages = {};
    const memberParticipation = {};
    
    scoresData.forEach(score => {
      const { member_id, score: scoreValue } = score;
      
      if (!memberAverages[member_id]) {
        memberAverages[member_id] = 0;
        memberParticipation[member_id] = 0;
      }
      
      memberAverages[member_id] += scoreValue;
      memberParticipation[member_id]++;
    });
    
    // 평균 계산
    Object.keys(memberAverages).forEach(memberId => {
      memberAverages[memberId] = 
        memberAverages[memberId] / memberParticipation[memberId];
    });
    
    // 각 기수별로 최고 성적자 찾기
    membersData.forEach(member => {
      const { id, generation, name, gender } = member;
      
      // 최소 5회 이상 참여한 회원만 고려
      if (memberParticipation[id] >= 5) {
        const averageScore = Math.round(memberAverages[id] * 10) / 10;
        
        if (!generationPerformers[generation] || 
            generationPerformers[generation].averageScore > averageScore) {
          generationPerformers[generation] = {
            generation,
            memberId: id,
            name,
            gender,
            averageScore,
            participationCount: memberParticipation[id]
          };
        }
      }
    });
    
    // 배열로 변환하고 기수 순으로 정렬
    const topPerformersArray = Object.values(generationPerformers)
      .sort((a, b) => a.generation - b.generation);
    
    setTopPerformers(topPerformersArray);
  };
  
  // 레이더 차트 데이터 변환
  const radarData = topPerformers.map(performer => ({
    subject: `${performer.generation}기`,
    A: performer.averageScore,
    fullMark: 120
  }));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">청구회 골프 성적 결과</h1>
      
      {/* 기수별 성적 비교 차트 */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">기수별 평균 성적 비교</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={generationComparison.map(gen => ({
                name: `${gen.generation}기`,
                평균스코어: gen.averageScore,
                참여횟수: gen.participationRate
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" domain={['dataMin - 5', 'dataMax + 5']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 5']} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="평균스코어" fill="#3B82F6" name="평균 스코어" />
              <Bar yAxisId="right" dataKey="참여횟수" fill="#F59E0B" name="1인당 참여 횟수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-500 text-center mt-2">
          * 최소 10회 이상 기록이 있는 기수만 표시됩니다
        </div>
      </div>
      
      {/* 연도별 평균 스코어 추이 & 기수별 최고 성적자 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 연도별 평균 스코어 추이 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">연도별 평균 스코어 추이</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyAverages.map(year => ({
                  name: year.yearLabel,
                  평균: year.averageScore,
                  참가: year.participantCount / year.meetingCount
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 5']} />
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
                  name="모임당 평균 참가자"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-500 text-center mt-2">
            * 모임 ID 10회 단위로 1년차로 추정하여 계산됨
          </div>
        </div>
        
        {/* 기수별 최고 성적자 레이더 차트 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">기수별 최고 성적자 비교</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[60, 110]} />
                <Radar 
                  name="평균 스코어" 
                  dataKey="A" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Tooltip formatter={(value) => [`${value}점`, '평균 스코어']} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 모임 선택 및 결과 표시 */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">모임별 상세 결과</h2>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md mr-4"
              value={selectedMeeting || ''}
              onChange={(e) => setSelectedMeeting(parseInt(e.target.value))}
            >
              <option value="">모임 선택</option>
              {meetings.map(meeting => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.name} - 참가자: {meeting.participantCount}명
                </option>
              ))}
            </select>
            
            {selectedMeeting && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowAllResults(!showAllResults)}
              >
                {showAllResults ? '상위 결과만 보기' : '전체 결과 보기'}
              </button>
            )}
          </div>
        </div>
        
        {selectedMeeting && meetingResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">스코어</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(showAllResults ? meetingResults : meetingResults.slice(0, 10)).map((result, index) => (
                  <tr key={index} className={index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        index === 0 ? 'bg-yellow-400 text-white' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        index === 2 ? 'bg-yellow-700 text-white' : ''
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{result.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.generation}기</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{result.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/members/${result.memberId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedMeeting ? (
          <div className="text-center py-8 text-gray-500">
            해당 모임의 결과 데이터가 없습니다.
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            모임을 선택하여 결과를 확인하세요.
          </div>
        )}
      </div>
      
      {/* 기수별 최고 성적자 목록 */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">기수별 최고 성적자 (최소 5회 참여)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 스코어</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">참여 횟수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPerformers.map((performer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{performer.generation}기</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{performer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{performer.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{performer.averageScore}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{performer.participationCount}회</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/members/${performer.memberId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;