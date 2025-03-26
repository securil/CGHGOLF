import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수 없는 상태입니다.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;