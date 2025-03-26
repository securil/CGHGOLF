import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalMeetings: 0,
    totalScores: 0,
    recentMembers: [],
    recentMeetings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 회원 데이터 로딩
        const membersResponse = await fetch('/data/members.json');
        const membersData = await membersResponse.json();
        
        // 스코어 데이터 로딩
        const scoresResponse = await fetch('/data/scores.json');
        const scoresData = await scoresResponse.json();
        
        // 모임 정보 계산 (현재는 스코어 데이터에서 유니크한 모임 ID 추출)
        const meetingIds = [...new Set(scoresData.map(score => score.meeting_id))];
        
        // 통계 업데이트
        setStats({
          totalMembers: membersData.length,
          totalMeetings: meetingIds.length,
          totalScores: scoresData.length,
          // 최근 가입한 회원 5명 (ID가 큰 순서로 가정)
          recentMembers: membersData
            .sort((a, b) => b.id - a.id)
            .slice(0, 5),
          // 최근 모임 5개 (모임 ID가 큰 순서로 가정)
          recentMeetings: meetingIds
            .sort((a, b) => b - a)
            .slice(0, 5)
            .map(id => ({ id, date: `2023-${(id % 12) + 1}-${(id % 28) + 1}` })) // 임시 날짜 생성
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">
          환영합니다, {currentUser.name}님! 여기서 청구회 골프 웹사이트의 모든 데이터를 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">회원</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalMembers}명</p>
          <Link to="/admin/members" className="text-blue-500 hover:underline mt-4 inline-block">
            회원 관리 &rarr;
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">모임</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalMeetings}회</p>
          <Link to="/admin/meetings" className="text-blue-500 hover:underline mt-4 inline-block">
            모임 관리 &rarr;
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">스코어</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalScores}개</p>
          <Link to="/admin/scores" className="text-blue-500 hover:underline mt-4 inline-block">
            스코어 관리 &rarr;
          </Link>
        </div>
      </div>

      {/* 관리 메뉴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">관리 메뉴</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/admin/members" className="flex items-center p-2 rounded hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
                회원 관리
              </Link>
            </li>
            <li>
              <Link to="/admin/meetings" className="flex items-center p-2 rounded hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                모임 관리
              </Link>
            </li>
            <li>
              <Link to="/admin/scores" className="flex items-center p-2 rounded hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                스코어 관리
              </Link>
            </li>
            <li>
              <Link to="/admin/gallery" className="flex items-center p-2 rounded hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                갤러리 관리
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">최근 활동</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">최근 등록된 회원</h3>
            <ul className="space-y-1">
              {stats.recentMembers.map(member => (
                <li key={member.id} className="text-sm">
                  <Link to={`/members/${member.id}`} className="text-blue-500 hover:underline">
                    {member.name} ({member.generation}세대)
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">최근 모임</h3>
            <ul className="space-y-1">
              {stats.recentMeetings.map(meeting => (
                <li key={meeting.id} className="text-sm">
                  <span>{meeting.date}</span> - 모임 #{meeting.id}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 빠른 작업 버튼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">빠른 작업</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/admin/members/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            회원 추가
          </Link>
          
          <Link 
            to="/admin/meetings/new" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            모임 추가
          </Link>
          
          <Link 
            to="/admin/scores/new" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            스코어 등록
          </Link>
          
          <Link 
            to="/admin/export" 
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            데이터 내보내기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;