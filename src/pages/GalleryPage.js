import React, { useState } from 'react';

const GalleryPage = () => {
  // 필터 상태
  const [filter, setFilter] = useState('all');

  // 갤러리 데이터 (실제로는 API나 데이터 파일에서 가져올 수 있음)
  const galleryItems = [
    { 
      id: 1, 
      title: '2025년 3월 정기 모임', 
      date: '2025-03-25', 
      category: 'regular',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '이천 뉴스프링빌CC에서 진행된 3월 정기 모임' 
    },
    { 
      id: 2, 
      title: '2025년 청구회장배', 
      date: '2025-05-27', 
      category: 'special',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '제35회 청구회장배 골프 대회' 
    },
    { 
      id: 3, 
      title: '2024년 총동창회장배', 
      date: '2024-10-22', 
      category: 'special',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '제34회 총동창회장배 골프 대회' 
    },
    { 
      id: 4, 
      title: '2024년 11월 정기 모임', 
      date: '2024-11-26', 
      category: 'regular',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '이천 뉴스프링빌CC에서 진행된 11월 정기 모임' 
    },
    { 
      id: 5, 
      title: '2024년 9월 정기 모임', 
      date: '2024-09-24', 
      category: 'regular',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '이천 뉴스프링빌CC에서 진행된 9월 정기 모임' 
    },
    { 
      id: 6, 
      title: '2024년 8월 정기 모임', 
      date: '2024-08-27', 
      category: 'regular',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '이천 뉴스프링빌CC에서 진행된 8월 정기 모임' 
    },
    { 
      id: 7, 
      title: '2024년 6월 정기 모임', 
      date: '2024-06-25', 
      category: 'regular',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '이천 뉴스프링빌CC에서 진행된 6월 정기 모임' 
    },
    { 
      id: 8, 
      title: '2024년 청구회장배', 
      date: '2024-05-28', 
      category: 'special',
      imageUrl: '/api/placeholder/400/300', // 실제 이미지로 대체 필요
      description: '제34회 청구회장배 골프 대회' 
    },
  ];

  // 필터링된 갤러리 아이템
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">청구회 갤러리</h1>
      
      {/* 필터 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'all' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'regular' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('regular')}
          >
            정기 모임
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'special' 
                ? 'bg-blue-700 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('special')}
          >
            특별 대회
          </button>
        </div>
      </div>
      
      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.date}</p>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
            <div className="px-4 pb-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                더 보기 &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 갤러리가 비어있을 경우 */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">해당 카테고리의 갤러리 항목이 없습니다.</p>
        </div>
      )}
      
      {/* 페이지네이션 (실제 페이지네이션 구현 필요) */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <a
            href="#"
            className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            이전
          </a>
          <a
            href="#"
            className="px-3 py-2 border-t border-b border-gray-300 bg-blue-700 text-white"
          >
            1
          </a>
          <a
            href="#"
            className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            2
          </a>
          <a
            href="#"
            className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            3
          </a>
          <a
            href="#"
            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            다음
          </a>
        </nav>
      </div>
    </div>
  );
};

export default GalleryPage;