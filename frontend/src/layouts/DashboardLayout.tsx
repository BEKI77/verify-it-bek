import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { showSidebar } = useTheme();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar />
      <main className="">
        <div
          className={`pt-16 min-h-screen transition-all ${
            showSidebar ? 'ml-64' : 'ml-0'
          }`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;