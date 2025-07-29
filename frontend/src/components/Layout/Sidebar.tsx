import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  FileText, 
  Upload, 
  Search, 
  Settings, 
  BarChart3,
  Users,
  Shield
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

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

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full">
      <div className="p-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;