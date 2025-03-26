import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그아웃 실행
    logout();
    
    // 홈페이지로 리디렉션
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그아웃 되었습니다
          </h2>
          <p className="mt-2 text-gray-600">
            로그아웃이 완료되었습니다. 잠시 후 홈페이지로 이동합니다.
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;