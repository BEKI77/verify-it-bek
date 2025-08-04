import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCertificates from './pages/student/StudentCertificate';
import StudentSettings from './pages/student/StudentSetting';
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import InstitutionUpload from './pages/institution/InstitutionUpload';
import InstitutionCertificates from './pages/institution/InstitutionCertificates';
import InstitutionAnalytics from './pages/institution/institutionAnalytics';
import VerifierDashboard from './pages/verifier/VerifierDashboard';
import VerifierVerify from './pages/verifier/VerifierVerify';
import VerifierHistory from './pages/verifier/VerifierHistory';
import VerifierReports from './pages/verifier/VerifierReports';
import NotFoundPage from './pages/NotFoundPage';
import AuthCallbackPage from './auth/AuthCallbackPage';
import DashboardLayout from './layouts/DashboardLayout';
import { InstitutionProvider } from './context/InstitutionContext';
import { VerificationProvider } from './context/VerificationContext';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={
                  user?.role === 'student' ? '/student-dashboard' :
                  user?.role === 'institution' ? '/institution-dashboard' :
                  user?.role === 'verifier' ? '/verifier-dashboard' : '/'
                } replace /> : 
                <LoginPage />
            } 
          />
          <Route path="/callback" element={<AuthCallbackPage />} />

          {/* Protected Routes with DashboardLayout */}
          <Route 
            path="/student-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="" element={<StudentDashboard />} />
                    <Route path="certificates" element={<StudentCertificates />} />
                    <Route path="settings" element={<StudentSettings />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/institution-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['institution']}>
                <InstitutionProvider>
                  <DashboardLayout>
                    <Routes>
                      <Route path="" element={<InstitutionDashboard />} />
                      <Route path="upload" element={<InstitutionUpload />} />
                      <Route path="certificates" element={<InstitutionCertificates />} />
                      <Route path="analytics" element={<InstitutionAnalytics />} />
                    </Routes>
                  </DashboardLayout>
                </InstitutionProvider>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/verifier-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['verifier']}>
                <VerificationProvider>
                <DashboardLayout>
                  <Routes>
                    <Route path="" element={<VerifierDashboard />} />
                    <Route path="verify" element={<VerifierVerify />} />
                    <Route path="history" element={<VerifierHistory />} />
                    <Route path="reports" element={<VerifierReports />} />
                  </Routes>
                </DashboardLayout>

                </VerificationProvider>
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;