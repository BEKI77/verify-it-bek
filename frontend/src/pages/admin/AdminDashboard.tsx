import React, { useState } from 'react';
import { Users, Building, FileText, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  // Mock system statistics
  const systemStats = [
    {
      label: 'Total Users',
      value: '2,847',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active Institutions',
      value: '156',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Building,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Certificates Issued',
      value: '18,492',
      change: '+23%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'increase' as const,
      icon: Activity,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const recentActivity = [
    {
      type: 'user_created',
      message: 'New institution registered: St. Xavier School',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      type: 'certificate_issued',
      message: '45 certificates issued by Delhi Public School',
      time: '15 minutes ago',
      status: 'info'
    },
    {
      type: 'system_alert',
      message: 'High verification volume detected',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      type: 'user_suspended',
      message: 'User account suspended: suspicious activity',
      time: '2 hours ago',
      status: 'error'
    },
    {
      type: 'backup_completed',
      message: 'Daily system backup completed successfully',
      time: '3 hours ago',
      status: 'success'
    }
  ];

  const systemAlerts = [
    {
      type: 'warning',
      title: 'High Server Load',
      message: 'Server CPU usage is at 85%. Consider scaling resources.',
      time: '5 minutes ago'
    },
    {
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for Sunday 2:00 AM - 4:00 AM.',
      time: '1 hour ago'
    },
    {
      type: 'success',
      title: 'Security Update',
      message: 'Security patches applied successfully. All systems secure.',
      time: '2 hours ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
      case 'user_suspended':
        return Users;
      case 'certificate_issued':
        return FileText;
      case 'system_alert':
        return AlertTriangle;
      case 'backup_completed':
        return CheckCircle;
      default:
        return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="Welcome to the Admin Dashboard! This is a demo environment."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              System overview and administrative controls for EduVerify platform
            </p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {systemStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* System Alerts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Alerts</h2>
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs opacity-75">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${getActivityColor(activity.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Add User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create new account</p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <Building className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Add Institution</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Register new school</p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System analytics</p>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">System Health</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor status</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;