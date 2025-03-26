import React, { useState } from 'react';

const SchedulePage = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  
  // 임시 일정 데이터
  const scheduleData = {
    '2025': [
      {
        id: 1,
        date: '2025-03-25',
        formattedDate: '2025년 3월 25일',
        title: '3월 정기 모임',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 24,
        status: 'upcoming',
        description: '2025년 첫 정기 모임입니다. 봄 시즌을 맞아 많은 참여 바랍니다. 점심과 저녁 식사가 제공됩니다.'
      },
      {
        id: 2,
        date: '2025-04-22',
        formattedDate: '2025년 4월 22일',
        title: '4월 정기 모임',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 28,
        status: 'upcoming',
        description: '4월 정기 모임입니다. 봄 골프의 즐거움을 함께 나눌 수 있는 좋은 기회입니다. 점심과 저녁 식사가 제공됩니다.'
      },
      {
        id: 3,
        date: '2025-05-27',
        formattedDate: '2025년 5월 27일',
        title: '5월 정기 모임 (청구회장배 대회)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 32,
        status: 'upcoming',
        description: '청구회장배 대회를 겸한 5월 정기 모임입니다. 우승자에게는 청구회장배가 수여됩니다. 점심과 저녁 식사 및 시상식이 제공됩니다.'
      },
      {
        id: 4,
        date: '2025-06-24',
        formattedDate: '2025년 6월 24일',
        title: '6월 정기 모임 (상반기 마지막)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 26,
        status: 'upcoming',
        description: '상반기 마지막 정기 모임입니다. 혹서기 전 마지막 모임에 많은 참여 바랍니다. 점심과 저녁 식사가 제공됩니다.'
      },
      {
        id: 5,
        date: '2025-08-26',
        formattedDate: '2025년 8월 26일',
        title: '8월 정기 모임 (하반기 첫 모임)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 0,
        status: 'upcoming',
        description: '혹서기 이후 첫 모임입니다. 하반기 첫 라운딩에 많은 참여 바랍니다. 점심과 저녁 식사가 제공됩니다.'
      },
      {
        id: 6,
        date: '2025-09-23',
        formattedDate: '2025년 9월 23일',
        title: '9월 정기 모임',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 0,
        status: 'upcoming',
        description: '9월 정기 모임입니다. 선선한 가을 날씨 속에서 즐거운 라운딩 하시길 바랍니다. 점심과 저녁 식사가 제공됩니다.'
      },
      {
        id: 7,
        date: '2025-10-28',
        formattedDate: '2025년 10월 28일',
        title: '10월 정기 모임 (총동창회장배 대회)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 0,
        status: 'upcoming',
        description: '총동창회장배 대회를 겸한 10월 정기 모임입니다. 모든 기수가 함께하는 의미 있는 대회입니다. 점심과 저녁 식사 및 시상식이 제공됩니다.'
      },
      {
        id: 8,
        date: '2025-11-25',
        formattedDate: '2025년 11월 25일',
        title: '11월 정기 모임 (연말 마지막)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 0,
        status: 'upcoming',
        description: '2025년 마지막 정기 모임입니다. 올 한해 수고하신 회원분들께 감사드립니다. 점심과 저녁 식사가 제공됩니다.'
      }
    ],
    '2024': [
      {
        id: 9,
        date: '2024-03-26',
        formattedDate: '2024년 3월 26일',
        title: '3월 정기 모임',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 24,
        status: 'completed',
        description: '2024년 첫 정기 모임이었습니다. 봄 시즌을 맞아 많은 회원분들이 참석해주셨습니다. 점심과 저녁 식사가 제공되었습니다.'
      },
      {
        id: 10,
        date: '2024-04-23',
        formattedDate: '2024년 4월 23일',
        title: '4월 정기 모임',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 28,
        status: 'completed',
        description: '4월 정기 모임이었습니다. 봄 골프의 즐거움을 함께 나누었습니다. 점심과 저녁 식사가 제공되었습니다.'
      },
      {
        id: 11,
        date: '2024-05-28',
        formattedDate: '2024년 5월 28일',
        title: '5월 정기 모임 (청구회장배 대회)',
        location: '뉴스프링빌CC (경기도 이천)',
        time: '오전 11:00',
        participants: 32,
        status: 'completed',
        description: '청구회장배 대회를 겸한 5월 정기 모임이었습니다. 많은 회원분들이 참여해 성황리에 진행되었습니다. 점심과 저녁 식사 및 시상식이 제공되었습니다.'
      }
    ]
  };
  
  const schedules = scheduleData[selectedYear] || [];
  
  // 상태별 라벨 및 스타일 정의
  const statusStyles = {
    completed: {
      badge: 'bg-gray-200 text-gray-700',
      text: '완료'
    },
    upcoming: {
      badge: 'bg-blue-100 text-blue-700',
      text: '예정'
    },
    canceled: {
      badge: 'bg-red-100 text-red-700',
      text: '취소'
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">모임 일정</h1>
      
      {/* 연도 선택 */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {Object.keys(scheduleData).map(year => (
            <button
              key={year}
              type="button"
              className={`px-6 py-2 text-sm font-medium ${
                selectedYear === year
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-200 ${
                year === Object.keys(scheduleData)[0] ? 'rounded-l-lg' : ''
              } ${
                year === Object.keys(scheduleData)[Object.keys(scheduleData).length - 1]
                  ? 'rounded-r-lg'
                  : ''
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}년
            </button>
          ))}
        </div>
      </div>
      
      {/* 일정 목록 */}
      <div className="space-y-6">
        {schedules.length > 0 ? (
          schedules.map(schedule => (
            <div key={schedule.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{schedule.title}</h2>
                    <p className="text-gray-600 mt-1">{schedule.formattedDate}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[schedule.status].badge}`}>
                      {statusStyles[schedule.status].text}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{schedule.location}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{schedule.time} 티오프</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">
                        {schedule.status === 'completed' 
                          ? `${schedule.participants}명 참가` 
                          : schedule.participants > 0 
                            ? `현재 ${schedule.participants}명 신청` 
                            : '신청자 모집 중'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {schedule.description && (
                  <div className="mt-4">
                    <p className="text-gray-700">{schedule.description}</p>
                  </div>
                )}
                
                {schedule.status === 'upcoming' && (
                  <div className="mt-6">
                    <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-2 md:text-lg md:px-5">
                      참가 신청
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            <p>해당 연도의 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;