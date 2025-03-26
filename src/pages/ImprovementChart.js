import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const ImprovementChart = ({ scores }) => {
  // 스코어 데이터가 없는 경우
  if (scores.length < 5) {
    return null; // 최소 5개 이상의 스코어가 있을 때만 표시
  }
  
  // 이동 평균 계산 (3개 단위)
  const calculateMovingAverage = (data, period = 3) => {
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null); // 첫 몇 개는 이동 평균을 계산할 수 없음
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].score;
      }
      
      result.push({
        meeting: data[i].meeting_id,
        ma: Math.round((sum / period) * 10) / 10
      });
    }
    
    return result;
  };
  
  // 추세선 계산
  const calculateTrendLine = (data) => {
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    // X, Y 값 준비
    const x = indices;
    const y = data.map(item => item.score);
    
    // 평균 계산
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    // 기울기 계산
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += Math.pow(x[i] - meanX, 2);
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;
    
    // 추세선 데이터 포인트 생성
    const trendData = x.map(index => ({
      meeting: data[index].meeting_id,
      trend: Math.round((intercept + slope * index) * 10) / 10
    }));
    
    return {
      trendData,
      slope
    };
  };
  
  // 데이터 정렬 (meeting_id 기준 오름차순)
  const sortedScores = [...scores].sort((a, b) => a.meeting_id - b.meeting_id);
  
  // 차트 데이터 준비
  const chartData = sortedScores.map(score => ({
    meeting_id: score.meeting_id,
    meeting: `${score.meeting_id}회`,
    score: score.score
  }));
  
  // 이동 평균 계산
  const movingAverages = calculateMovingAverage(sortedScores);
  
  // 추세선 계산
  const { trendData, slope } = calculateTrendLine(sortedScores);
  
  // 최종 데이터 병합
  const finalData = chartData.map((item, index) => ({
    ...item,
    ma: movingAverages[index]?.ma || null,
    trend: trendData[index]?.trend || null
  }));
  
  // 향상도 텍스트 계산
  let improvementText = '';
  if (slope < -0.5) {
    improvementText = '빠르게 향상 중';
  } else if (slope < -0.1) {
    improvementText = '꾸준히 향상 중';
  } else if (slope < 0.1) {
    improvementText = '안정적인 성적 유지';
  } else if (slope < 0.5) {
    improvementText = '약간의 성적 하락';
  } else {
    improvementText = '성적 개선 필요';
  }
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-semibold text-gray-800">향상도 분석</h3>
        <p className="text-gray-600 mt-1">
          {improvementText}
          {slope < 0 ? (
            <span className="text-green-600 ml-2">
              (평균 {Math.abs(slope).toFixed(2)} 스코어/회 향상)
            </span>
          ) : (
            <span className="text-red-600 ml-2">
              (평균 {slope.toFixed(2)} 스코어/회 증가)
            </span>
          )}
        </p>
      </div>
      <div className="px-6 py-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={finalData}
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
              name="실제 스코어"
              stroke="#3B82F6" 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="ma" 
              name="이동 평균 (3회)"
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="trend" 
              name="추세선"
              stroke={slope < 0 ? "#10B981" : "#EF4444"} 
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <ReferenceLine y={90} stroke="#CBD5E1" strokeDasharray="3 3" label="90" />
            <ReferenceLine y={80} stroke="#CBD5E1" strokeDasharray="3 3" label="80" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImprovementChart;