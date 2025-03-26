import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// 레이아웃 및 공통 컴포넌트
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// 페이지 컴포넌트
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SchedulePage from './pages/SchedulePage';
import GalleryPage from './pages/GalleryPage';
import MembersPage from './pages/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// 인증 관련 페이지
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// 관리자 페이지들
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberManagement from './pages/admin/MemberManagement';
import ScoreManagement from './pages/admin/ScoreManagement';
import MeetingManagement from './pages/admin/MeetingManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              {/* 공개 페이지 (로그인 불필요) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* 로그인 필요한 페이지 */}
              <Route 
                path="/members" 
                element={
                  <ProtectedRoute>
                    <MembersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members/:id" 
                element={
                  <ProtectedRoute>
                    <MemberDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute>
                    <ResultsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/schedule" 
                element={
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gallery" 
                element={
                  <ProtectedRoute>
                    <GalleryPage />
                  </ProtectedRoute>
                } 
              />

              {/* 관리자 전용 페이지 */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/members" 
                element={
                  <AdminRoute>
                    <MemberManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/scores" 
                element={
                  <AdminRoute>
                    <ScoreManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/meetings" 
                element={
                  <AdminRoute>
                    <MeetingManagement />
                  </AdminRoute>
                } 
              />

              {/* 404 페이지 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;