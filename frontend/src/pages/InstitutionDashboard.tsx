import React, { useState } from 'react';
import { Upload, Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import FileUpload from '../components/UI/FileUpload';
import CertificateCard from '../components/UI/CertificateCard';
import Alert from '../components/UI/Alert';
import { Certificate } from '../types';

const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Mock certificates data
  const certificates: Certificate[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 12 Marksheet',
      issueDate: '2024-03-15',
      verificationCode: 'EDU-VER-2024-1234',
      status: 'verified',
      notes: 'Final examination results'
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
      notes: 'Good moral character'
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
    }
  ];

  const handleFileUpload = (file: File) => {
    setAlertMessage(`Certificate "${file.name}" uploaded successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleView = (certificate: Certificate) => {
    setAlertMessage('This is a demo feature. In a real application, this would open the certificate.');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const stats = [
    {
      label: 'Total Certificates',
      value: certificates.length,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      change: '+12%'
    },
    {
      label: 'Students Served',
      value: '1,234',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      change: '+8%'
    },
    {
      label: 'This Month',
      value: '45',
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      change: '+23%'
    },
    {
      label: 'Verification Rate',
      value: '98.5%',
      icon: TrendingUp,
      color: 'text-yellow-600 dark:text-yellow-400',
      change: '+2%'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="success"
              message={alertMessage}
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Institution Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage certificates and student records for {user?.name}
            </p>
          </div>

          {/* Institution Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center space-x-4">
              {user?.institutionLogo ? (
                <img src={user.institutionLogo} alt={user.name} className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-xl">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Fayda ID: {user?.faydaId}</p>
                <p className="text-gray-600 dark:text-gray-400">Contact: {user?.contactInfo}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Upload Certificate Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upload New Certificate</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certificate Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                    <option>Select certificate type</option>
                    <option>Class 10 Marksheet</option>
                    <option>Class 12 Marksheet</option>
                    <option>Character Certificate</option>
                    <option>Transfer Certificate</option>
                    <option>Migration Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes about the certificate"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate PDF
                </label>
                <FileUpload onFileSelect={handleFileUpload} />
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Upload Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Recent Certificates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={() => handleView(certificate)}
                  showActions={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;