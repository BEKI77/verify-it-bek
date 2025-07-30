import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Alert from '../../components/UI/Alert';

interface VerificationRecord {
  id: string;
  verificationCode: string;
  studentName: string;
  institutionName: string;
  certificateType: string;
  verifiedDate: string;
  status: 'verified' | 'rejected' | 'pending';
  verifiedBy: string;
  ipAddress: string;
  notes?: string;
}

const VerifierHistory: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'rejected' | 'pending'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showAlert, setShowAlert] = useState(false);

  // Mock verification history data
  const allRecords: VerificationRecord[] = [
    {
      id: '1',
      verificationCode: 'EDU-VER-2024-1234',
      studentName: 'John Doe',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 12 Marksheet',
      verifiedDate: '2024-03-20T10:30:00Z',
      status: 'verified',
      verifiedBy: user?.name || 'Unknown',
      ipAddress: '192.168.1.100',
      notes: 'Certificate verified successfully'
    },
    {
      id: '2',
      verificationCode: 'EDU-VER-2024-5678',
      studentName: 'Jane Smith',
      institutionName: 'St. Mary\'s School',
      certificateType: 'Character Certificate',
      verifiedDate: '2024-03-19T14:15:00Z',
      status: 'verified',
      verifiedBy: user?.name || 'Unknown',
      ipAddress: '192.168.1.101',
      notes: 'Valid character certificate'
    },
    {
      id: '3',
      verificationCode: 'EDU-VER-2024-9999',
      studentName: 'Unknown',
      institutionName: 'Unknown',
      certificateType: 'Unknown',
      verifiedDate: '2024-03-18T09:45:00Z',
      status: 'rejected',
      verifiedBy: user?.name || 'Unknown',
      ipAddress: '192.168.1.102',
      notes: 'Invalid verification code'
    },
    {
      id: '4',
      verificationCode: 'EDU-VER-2024-3456',
      studentName: 'Mike Johnson',
      institutionName: 'Central High School',
      certificateType: 'Transfer Certificate',
      verifiedDate: '2024-03-17T16:20:00Z',
      status: 'verified',
      verifiedBy: user?.name || 'Unknown',
      ipAddress: '192.168.1.103',
      notes: 'Transfer certificate verified'
    },
    {
      id: '5',
      verificationCode: 'EDU-VER-2024-7890',
      studentName: 'Sarah Wilson',
      institutionName: 'Green Valley School',
      certificateType: 'Sports Certificate',
      verifiedDate: '2024-03-16T11:10:00Z',
      status: 'verified',
      verifiedBy: user?.name || 'Unknown',
      ipAddress: '192.168.1.104',
      notes: 'Sports achievement certificate'
    }
  ];

  const filteredRecords = allRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.verificationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const recordDate = new Date(record.verifiedDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filterDate) {
        case 'today':
          matchesDate = recordDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = recordDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = recordDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleViewDetails = (record: VerificationRecord) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusIcon = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const stats = [
    {
      label: 'Total Verifications',
      value: allRecords.length,
      icon: CheckCircle,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Successful',
      value: allRecords.filter(r => r.status === 'verified').length,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Failed',
      value: allRecords.filter(r => r.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Success Rate',
      value: `${Math.round((allRecords.filter(r => r.status === 'verified').length / allRecords.length) * 100)}%`,
      icon: AlertCircle,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="This is a demo feature. In a real application, this would show detailed verification information or export data."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Verification History
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track all your certificate verification activities
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Export History</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by student name, verification code, or institution..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Verification Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student & Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.certificateType}
                          </div>
                          <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            {record.verificationCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {record.institutionName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(record.verifiedDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(record.verifiedDate).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No verification records found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || filterStatus !== 'all' || filterDate !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Your verification history will appear here once you start verifying certificates.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierHistory;