import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewMemberPage = () => {
  const navigate = useNavigate();
  
  // 초기 회원 상태
  const [member, setMember] = useState({
    name: '',
    generation: '',
    gender: '남성',
    phone: ''
  });
  
  // 입력 필드 유효성 검사 상태
  const [errors, setErrors] = useState({});
  
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  
  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 필드 변경 시 해당 필드의 오류 메시지 삭제
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors = {};
    
    if (!member.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    
    if (!member.generation) {
      newErrors.generation = '세대를 입력해주세요.';
    } else if (isNaN(member.generation) || member.generation <= 0) {
      newErrors.generation = '유효한 세대 번호를 입력해주세요.';
    }
    
    if (!member.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(member.phone)) {
      newErrors.phone = '유효한 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
    }
    
    // 오류가 있을 경우 제출 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 폼 제출 (실제 구현에서는 API 호출)
    try {
      setLoading(true);
      
      // 실제 구현에서는 아래 주석을 해제하고 API 호출 코드 작성
      // const response = await fetch('/api/members', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(member),
      // });
      
      // if (!response.ok) {
      //   throw new Error('회원 추가 실패');
      // }
      
      // 성공 시 처리
      alert('새 회원이 성공적으로 추가되었습니다.');
      navigate('/admin/members'); // 회원 관리 페이지로 이동
    } catch (error) {
      console.error('Error adding member:', error);
      alert('회원 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">새 회원 추가</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={member.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="회원 이름"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="generation" className="block text-sm font-medium text-gray-700 mb-2">세대 *</label>
              <input
                type="number"
                id="generation"
                name="generation"
                value={member.generation}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.generation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="세대 번호"
                min="1"
              />
              {errors.generation && <p className="mt-1 text-sm text-red-500">{errors.generation}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">성별 *</label>
              <select
                id="gender"
                name="gender"
                value={member.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={member.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="010-1234-5678"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate('/admin/members')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? '처리 중...' : '회원 추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMemberPage;