import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">청구회 골프 모임</h3>
            <p className="text-sm text-gray-400">
              이천 뉴스프링빌CC | 매월 4째주 화요일
            </p>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>© {currentYear} 청구회. All rights reserved.</p>
            <p>제작: 청구회 IT 위원회</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;