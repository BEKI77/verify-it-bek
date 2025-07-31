import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, 
  FileText, 
  Upload, 
  Search, 
  Settings, 
  BarChart3,
  Users,
  Shield,
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { showSidebar } = useTheme();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  if (!user) return null;

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Overview', path: `/${user.role}-dashboard` }
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { icon: FileText, label: 'My Certificates', path: '/student-dashboard/certificates' },
          { icon: Settings, label: 'Profile Settings', path: '/student-dashboard/settings' }
        ];
      case 'institution':
        return [
          ...baseItems,
          { icon: Upload, label: 'Upload Certificate', path: '/institution-dashboard/upload' },
          { icon: FileText, label: 'All Certificates', path: '/institution-dashboard/certificates' },
          { icon: Users, label: 'Students', path: '/institution-dashboard/students' },
          { icon: BarChart3, label: 'Analytics', path: '/institution-dashboard/analytics' }
        ];
      case 'verifier':
        return [
          ...baseItems,
          { icon: Search, label: 'Verify Certificate', path: '/verifier-dashboard/verify' },
          { icon: FileText, label: 'Verification History', path: '/verifier-dashboard/history' },
          { icon: Shield, label: 'Reports', path: '/verifier-dashboard/reports' }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded-md md:hidden"
        onClick={toggleMobileSidebar}
      >
        {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      {(showSidebar || isMobileSidebarOpen) && (
        <aside
          className={`fixed top-16 left-0 z-40 w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex-shrink-0 transition-transform ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-6">
            {/* User role indicator */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {user.role} Dashboard
                </span>
              </div>
            </div>

            {/* Navigation menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;