import React, { createContext, useState, useContext, useEffect } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  // 로컬 스토리지에서 사용자 정보 가져오기 (새로고침 시에도 로그인 유지)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('chunggu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // 인증 로딩 상태
  const [loading, setLoading] = useState(true);

  // 사용자 정보가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chunggu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('chunggu_user');
    }
    setLoading(false);
  }, [currentUser]);

  // 로그인 함수
  const login = async (username, password) => {
    try {
      // 실제 구현에서는 서버 API 호출
      // 지금은 임시로 하드코딩된 사용자 확인
      
      // 관리자 계정
      if (username === 'admin' && password === 'admin123') {
        setCurrentUser({
          id: 'admin',
          username: 'admin',
          role: 'admin',
          name: '관리자'
        });
        return { success: true, user: { role: 'admin' } };
      }
      
      // 일반 회원 계정 (예시: members.json의 데이터를 기반으로 검증)
      // 여기서는 회원 ID를 username으로, 전화번호 뒷자리를 비밀번호로 가정
      const response = await fetch('/data/members.json');
      const members = await response.json();
      
      const member = members.find(m => m.id.toString() === username);
      
      if (member) {
        // 전화번호 뒷자리 4자리를 비밀번호로 가정
        const phoneLastFour = member.phone.slice(-4);
        
        if (password === phoneLastFour) {
          setCurrentUser({
            id: member.id,
            username: member.id.toString(),
            role: 'member',
            name: member.name,
            generation: member.generation,
            gender: member.gender
          });
          return { success: true, user: { role: 'member' } };
        }
      }
      
      return { success: false, message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' };
    } catch (error) {
      console.error('로그인 오류:', error);
      return { success: false, message: '로그인 처리 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null);
  };

  // 사용자가 관리자인지 확인하는 헬퍼 함수
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // 사용자 인증 여부 확인하는 헬퍼 함수
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // 컨텍스트 값
  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};