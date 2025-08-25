import React, { useState } from 'react';
import { FileText,  CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';

const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

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
      value: '4',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Verified Today',
      value: '2',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'This Month',
      value: '4',
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