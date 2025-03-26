import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 인증이 필요한 라우트를 위한 컴포넌트
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때 로딩 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 경우 원래 컴포넌트 표시
  return children;
};

// 관리자만 접근 가능한 라우트를 위한 컴포넌트
export const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때 로딩 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 관리자가 아닌 경우 접근 거부 페이지로 리디렉션
  if (!isAdmin()) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  // 관리자인 경우 원래 컴포넌트 표시
  return children;
};