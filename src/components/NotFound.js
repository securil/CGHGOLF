import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-9xl font-bold text-gray-300">404</div>
      <h1 className="text-4xl font-bold text-gray-800 mt-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-600 mt-4 max-w-lg">
        요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수 없습니다.
      </p>
      <Link 
        to="/"
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-300"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;