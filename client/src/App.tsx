import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useIssueStore } from './store/issueStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IssuesPage from './pages/IssuesPage';
import IssueDetailsPage from './pages/IssueDetailsPage';
import ReportIssuePage from './pages/ReportIssuePage';
import DashboardPage from './pages/DashboardPage';
import DepartmentDashboardPage from './pages/DepartmentDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatAssistant from './components/chat/ChatAssistant';

function App() {
  const { fetchIssues } = useIssueStore();
  const location = useLocation();
  
  // Fetch issues on initial load
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/issues/:id" element={<IssueDetailsPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/report" element={<ReportIssuePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/department-dashboard" element={<DepartmentDashboardPage />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      
      <ChatAssistant />
    </>
  );
}

export default App;