import React, { useState } from 'react';
import { Download, Calendar, BarChart3, PieChart, TrendingUp, FileText, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Alert from '../../components/UI/Alert';

const VerifierReports: React.FC = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const handleDownloadReport = (reportType: string) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Mock data for reports
  const verificationStats = {
    week: { total: 45, verified: 42, rejected: 3, successRate: 93.3 },
    month: { total: 189, verified: 186, rejected: 3, successRate: 98.4 },
    quarter: { total: 567, verified: 558, rejected: 9, successRate: 98.4 },
    year: { total: 2234, verified: 2198, rejected: 36, successRate: 98.4 }
  };

  const currentStats = verificationStats[selectedPeriod];

  const institutionBreakdown = [
    { name: 'Delhi Public School', verifications: 45, percentage: 24 },
    { name: 'St. Mary\'s School', verifications: 38, percentage: 20 },
    { name: 'Central High School', verifications: 32, percentage: 17 },
    { name: 'Green Valley School', verifications: 28, percentage: 15 },
    { name: 'Sunrise Academy', verifications: 25, percentage: 13 },
    { name: 'Others', verifications: 21, percentage: 11 }
  ];

  const certificateTypes = [
    { type: 'Class 12 Marksheet', count: 56, percentage: 30 },
    { type: 'Class 10 Marksheet', count: 48, percentage: 25 },
    { type: 'Character Certificate', count: 35, percentage: 19 },
    { type: 'Transfer Certificate', count: 28, percentage: 15 },
    { type: 'Sports Certificate', count: 15, percentage: 8 },
    { type: 'Others', count: 7, percentage: 3 }
  ];

  const monthlyTrends = [
    { month: 'Jan', verifications: 156, successRate: 97.4 },
    { month: 'Feb', verifications: 178, successRate: 98.1 },
    { month: 'Mar', verifications: 189, successRate: 98.4 },
    { month: 'Apr', verifications: 203, successRate: 97.8 },
    { month: 'May', verifications: 234, successRate: 98.7 },
    { month: 'Jun', verifications: 189, successRate: 98.4 }
  ];

  const reportTypes = [
    {
      title: 'Verification Summary Report',
      description: 'Complete overview of all verification activities',
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Institution Performance Report',
      description: 'Breakdown by educational institutions',
      icon: Users,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Certificate Type Analysis',
      description: 'Analysis by certificate categories',
      icon: PieChart,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Trend Analysis Report',
      description: 'Historical trends and patterns',
      icon: TrendingUp,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  const stats = [
    {
      label: 'Total Verifications',
      value: currentStats.total,
      icon: CheckCircle,
      color: 'text-blue-600 dark:text-blue-400',
      change: '+12%'
    },
    {
      label: 'Success Rate',
      value: `${currentStats.successRate}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      change: '+2.1%'
    },
    {
      label: 'Verified',
      value: currentStats.verified,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      change: '+15%'
    },
    {
      label: 'Rejected',
      value: currentStats.rejected,
      icon: FileText,
      color: 'text-red-600 dark:text-red-400',
      change: '-8%'
    }
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="This is a demo feature. In a real application, this would generate and download the selected report."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Verification Reports
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate detailed reports and analytics for your verification activities
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Report Generation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Generate Reports</h2>
              <div className="space-y-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div key={report.title} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${report.color}`} />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadReport(report.title)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Monthly Trends</h2>
              <div className="space-y-4">
                {monthlyTrends.map((data) => (
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
                              style={{ width: `${(data.verifications / 250) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                            {data.verifications}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {data.successRate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Institution Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Institutions</h2>
              <div className="space-y-4">
                {institutionBreakdown.map((institution, index) => (
                  <div key={institution.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{institution.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{institution.verifications}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {institution.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Types */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Certificate Types</h2>
              <div className="space-y-4">
                {certificateTypes.map((type, index) => (
                  <div key={type.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 45 + 180}, 70%, 50%)` }}
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

          {/* Export Options */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Custom Report Builder</h3>
                <p className="text-sm opacity-90">
                  Need a specific report? Use our custom report builder to create detailed analytics.
                </p>
              </div>
              <button
                onClick={() => handleDownloadReport('Custom Report')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Build Custom Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierReports;