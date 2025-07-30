import React, { useState } from 'react';
import { Search, FileText, Download, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';

const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock verification history
  const verificationHistory = [
    {
      id: '1',
      verificationCode: 'EDU-VER-2024-1234',
      studentName: 'John Doe',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 12 Marksheet',
      verifiedDate: '2024-03-20',
      status: 'verified' as const,
      verifiedBy: user?.name || 'Unknown'
    },
    {
      id: '2',
      verificationCode: 'EDU-VER-2024-5678',
      studentName: 'Jane Smith',
      institutionName: 'St. Mary\'s School',
      certificateType: 'Character Certificate',
      verifiedDate: '2024-03-19',
      status: 'verified' as const,
      verifiedBy: user?.name || 'Unknown'
    },
    {
      id: '3',
      verificationCode: 'EDU-VER-2024-9999',
      studentName: 'Unknown',
      institutionName: 'Unknown',
      certificateType: 'Unknown',
      verifiedDate: '2024-03-18',
      status: 'rejected' as const,
      verifiedBy: user?.name || 'Unknown'
    }
  ];

  // Mock certificate data for demonstration
  const mockCertificate: Certificate = {
    id: '1',
    studentName: 'John Doe',
    studentId: 'STU001',
    institutionName: 'Delhi Public School',
    certificateType: 'Class 12 Marksheet',
    issueDate: '2024-03-15',
    verificationCode: 'EDU-VER-2024-1234',
    status: 'verified',
    notes: 'Final examination results - All subjects passed with distinction'
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (searchQuery === 'EDU-VER-2024-1234') {
        setVerificationResult(mockCertificate);
      } else {
        setVerificationResult({
          ...mockCertificate,
          id: 'not-found',
          studentName: 'Not Found',
          institutionName: 'Certificate not found or invalid',
          certificateType: 'Unknown',
          status: 'rejected',
          notes: 'Certificate verification failed. Please check the verification code.'
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
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
      label: 'Total Verifications',
      value: '156',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Verified Today',
      value: '12',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'This Month',
      value: '89',
      icon: Calendar,
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
              message="This is a demo feature. In a real application, this would download a verification report."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verifier Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Verify certificate authenticity and generate reports
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Verify Certificate
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code or QR Code
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter verification code (try: EDU-VER-2024-1234)"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Search className="h-5 w-5" />
                    <span>{isSearching ? 'Verifying...' : 'Verify'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verification Result
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResult.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verificationResult.status)}`}>
                    {verificationResult.status === 'verified' ? 'Verified' : 
                     verificationResult.status === 'pending' ? 'Pending' : 'Invalid'}
                  </span>
                </div>
              </div>

              {verificationResult.status === 'verified' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Student Name
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {verificationResult.studentName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Institution
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {verificationResult.institutionName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Certificate Type
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {verificationResult.certificateType}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Issue Date
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(verificationResult.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Verification Code
                      </label>
                      <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                        {verificationResult.verificationCode}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                        Notes
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {verificationResult.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Certificate Not Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The verification code you entered is invalid or the certificate does not exist in our system.
                  </p>
                </div>
              )}

              {verificationResult.status === 'verified' && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Verification Report</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Verification History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Verifications
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Verification Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Certificate Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {verificationHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {record.verificationCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {record.certificateType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(record.verifiedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status === 'verified' ? 'Verified' : 'Invalid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;