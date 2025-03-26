import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">청구회 골프 모임</h2>
            <p className="text-gray-400 mt-1">우정과 실력 향상을 위한 모임</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {currentYear} 청구회 골프 모임. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;