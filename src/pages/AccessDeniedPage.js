import React from 'react';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            접근 권한이 없습니다
          </h2>
          <p className="mt-2 text-gray-600">
            이 페이지에 접근하기 위한 권한이 없습니다. 관리자 계정으로 로그인해 주세요.
          </p>
        </div>
        
        <div className="mt-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mr-2"
          >
            홈으로 이동
          </Link>
          <Link
            to="/login"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded ml-2"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;