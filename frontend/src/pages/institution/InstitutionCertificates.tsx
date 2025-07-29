import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MoreHorizontal, Calendar, User, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';

const InstitutionCertificates: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAlert, setShowAlert] = useState(false);

  // Mock certificates data
  const allCertificates: Certificate[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 12 Marksheet',
      issueDate: '2024-03-15',
      verificationCode: 'EDU-VER-2024-1234',
      status: 'verified',
      notes: 'Final examination results - Mathematics: A+, Physics: A, Chemistry: A+'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentId: 'STU002',
      institutionName: 'Delhi Public School',
      certificateType: 'Character Certificate',
      issueDate: '2024-03-14',
      verificationCode: 'EDU-VER-2024-5678',
      status: 'verified',
      notes: 'Good moral character certificate'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      institutionName: 'Delhi Public School',
      certificateType: 'Transfer Certificate',
      issueDate: '2024-03-13',
      verificationCode: 'EDU-VER-2024-9012',
      status: 'pending',
      notes: 'Transfer request - awaiting verification'
    },
    {
      id: '4',
      studentName: 'Sarah Wilson',
      studentId: 'STU004',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 10 Marksheet',
      issueDate: '2024-03-12',
      verificationCode: 'EDU-VER-2024-3456',
      status: 'verified',
      notes: 'Secondary school examination results'
    },
    {
      id: '5',
      studentName: 'David Brown',
      studentId: 'STU005',
      institutionName: 'Delhi Public School',
      certificateType: 'Sports Certificate',
      issueDate: '2024-03-11',
      verificationCode: 'EDU-VER-2024-7890',
      status: 'verified',
      notes: 'Inter-school basketball championship - First place'
    }
  ];

  const certificateTypes = [...new Set(allCertificates.map(cert => cert.certificateType))];

  const filteredCertificates = allCertificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    const matchesType = filterType === 'all' || cert.certificateType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (certificate: Certificate) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDownload = (certificate: Certificate) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusColor = (status: Certificate['status']) => {
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
      label: 'Total Certificates',
      value: allCertificates.length,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Verified',
      value: allCertificates.filter(c => c.status === 'verified').length,
      icon: FileText,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Pending',
      value: allCertificates.filter(c => c.status === 'pending').length,
      icon: Calendar,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      label: 'This Month',
      value: '12',
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="This is a demo feature. In a real application, this would open/download the certificate."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Certificates</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track all issued certificates</p>
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
                    placeholder="Search by student name, ID, or verification code..."
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
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {certificateTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Certificate Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Verification Code
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
                  {filteredCertificates.map((certificate) => (
                    <tr key={certificate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {certificate.studentName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {certificate.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {certificate.certificateType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {certificate.verificationCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.status)}`}>
                          {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(certificate)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(certificate)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCertificates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No certificates found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start by uploading your first certificate.'
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

export default InstitutionCertificates;