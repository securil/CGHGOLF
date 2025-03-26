import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">청구회 소개</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">우리의 역사</h2>
            <p className="text-gray-700 mb-4">
              청구회는 2010년에 창립되어 현재까지 활발한 활동을 이어오고 있는 골프 모임입니다.
              다양한 연령대와 기수의 회원들이 함께 모여 골프라는 공통의 취미를 즐기고, 친목을 다지는 모임입니다.
            </p>
            <p className="text-gray-700 mb-4">
              매월 정기적인 모임을 통해 실력 향상과 함께 회원 간의 우정을 돈독히 하고 있으며,
              연 2회 대회를 개최하여 축제의 장을 마련하고 있습니다.
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">모임 목적</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>골프를 통한 친목 도모 및 인적 네트워킹</li>
              <li>정기적인 운동을 통한 건강 증진</li>
              <li>골프 실력 향상 및 기술 공유</li>
              <li>건전한 스포츠 문화 형성</li>
              <li>각 기수 간의 교류 활성화</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">모임 일정</h2>
            <p className="text-gray-700 mb-4">
              청구회는 매월 셋째 주 화요일에 정기 모임을 진행합니다. 계절과 날씨에 따라 일정이 변경될 수 있으며,
              변경 시 회원들에게 사전에 공지됩니다.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">연간 주요 일정</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>월례회: 매월 셋째 주 화요일</li>
                <li>봄 정기 대회: 4월 중</li>
                <li>가을 정기 대회: 10월 중</li>
                <li>송년 모임: 12월 중</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">회원 구성</h2>
            <p className="text-gray-700 mb-4">
              청구회는 다양한 기수의 회원들로 구성되어 있으며, 현재 약 200여 명의 회원이 활동 중입니다.
              회원 가입은 기존 회원의 추천을 통해 가능하며, 골프에 관심 있는 분이라면 누구나 환영합니다.
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">회원 분포</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">57%</div>
                  <div className="text-gray-700">30대 이상</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">32%</div>
                  <div className="text-gray-700">40대 이상</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">11%</div>
                  <div className="text-gray-700">50대 이상</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">연락처</h2>
            <p className="text-gray-700 mb-4">
              청구회 가입 및 활동에 관한 문의는 아래 연락처로 문의해 주세요.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">chunggu.golf@example.com</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">010-1234-5678 (간사: 김대표)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;