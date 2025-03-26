import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClass = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive 
        ? 'bg-blue-700 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 타이틀 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">청구회</span>
              <span className="ml-2 text-sm text-gray-300">골프 모임</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink to="/" className={navLinkClass} end>홈</NavLink>
              <NavLink to="/about" className={navLinkClass}>소개</NavLink>
              <NavLink to="/schedule" className={navLinkClass}>일정</NavLink>
              <NavLink to="/gallery" className={navLinkClass}>갤러리</NavLink>
              <NavLink to="/members" className={navLinkClass}>회원</NavLink>
              <NavLink to="/results" className={navLinkClass}>경기결과</NavLink>
              <NavLink to="/statistics" className={navLinkClass}>통계</NavLink>
            </div>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-3 space-y-1">
            <NavLink to="/" className={navLinkClass} end
              onClick={() => setIsMenuOpen(false)}>홈</NavLink>
            <NavLink to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>소개</NavLink>
            <NavLink to="/schedule" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>일정</NavLink>
            <NavLink to="/gallery" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>갤러리</NavLink>
            <NavLink to="/members" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>회원</NavLink>
            <NavLink to="/results" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>경기결과</NavLink>
            <NavLink to="/statistics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>통계</NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;