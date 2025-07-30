import React from 'react';
import { TrendingUp, Users, FileText, Calendar, Award, BarChart3, PieChart, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';

const InstitutionAnalytics: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Certificates Issued',
      value: '1,234',
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active Students',
      value: '856',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Verification Rate',
      value: '98.5%',
      change: '+2%',
      changeType: 'increase' as const,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Monthly Growth',
      value: '23%',
      change: '+5%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const monthlyData = [
    { month: 'Jan', certificates: 45, students: 12 },
    { month: 'Feb', certificates: 52, students: 18 },
    { month: 'Mar', certificates: 78, students: 25 },
    { month: 'Apr', certificates: 65, students: 20 },
    { month: 'May', certificates: 89, students: 30 },
    { month: 'Jun', certificates: 95, students: 35 }
  ];

  const certificateTypes = [
    { type: 'Class 12 Marksheet', count: 345, percentage: 28 },
    { type: 'Class 10 Marksheet', count: 298, percentage: 24 },
    { type: 'Character Certificate', count: 234, percentage: 19 },
    { type: 'Transfer Certificate', count: 178, percentage: 14 },
    { type: 'Sports Certificate', count: 123, percentage: 10 },
    { type: 'Others', count: 56, percentage: 5 }
  ];

  const recentActivity = [
    { action: 'Certificate issued', student: 'John Doe', type: 'Class 12 Marksheet', time: '2 hours ago' },
    { action: 'Certificate verified', student: 'Jane Smith', type: 'Character Certificate', time: '4 hours ago' },
    { action: 'New student enrolled', student: 'Mike Johnson', type: 'Class 11', time: '6 hours ago' },
    { action: 'Certificate issued', student: 'Sarah Wilson', type: 'Sports Certificate', time: '8 hours ago' },
    { action: 'Certificate verified', student: 'David Brown', type: 'Transfer Certificate', time: '1 day ago' }
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your institution's performance and certificate statistics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Trends</h2>
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {data.month}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(data.certificates / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                            {data.certificates} certs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Types Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certificate Types</h2>
                <PieChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {certificateTypes.map((type, index) => (
                  <div key={type.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                        }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{type.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{type.count}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {type.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.action}</span> for{' '}
                        <span className="font-medium">{activity.student}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.type}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Month</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Certificates Issued</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">95</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">New Students</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">35</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Verifications</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">98.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Certificate Insights</h3>
                <p className="text-sm opacity-90 mb-4">
                  Your institution has maintained a 98.5% verification success rate this month.
                </p>
                <button className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                  View Details
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Classes</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class 12-A</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">45 certificates</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class 10-B</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">38 certificates</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Class 11-A</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">32 certificates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAnalytics;