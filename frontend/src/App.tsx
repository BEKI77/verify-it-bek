import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './auth/AuthCallbackPage';
import StudentDashboard from './pages/student/StudentDashboard';
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import VerifierDashboard from './pages/verifier/VerifierDashboard';
import NotFoundPage from './pages/NotFoundPage';

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
        <Navbar />
        <div className="pt-16">
          <Routes>
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
            {/* Protected Routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/institution-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/verifier-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['verifier']}>
                  <VerifierDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
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