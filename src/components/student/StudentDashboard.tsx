import React, { useState } from 'react';
import { Download, Share2, QrCode, FileText, Award, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Layout/Sidebar';
import CertificateCard from '../UI/CertificateCard';
import QRCodeViewer from '../UI/QRCodeViewer';
import Modal from '..//UI/Modal';
import Alert from '../UI/Alert';
import { Certificate } from '../../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showAlert, setShowAlert] = useState(false);

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
      pdfUrl: '#',
      notes: 'Final examination results'
    },
    {
      id: '2',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Character Certificate',
      issueDate: '2024-03-20',
      verificationCode: 'EDU-VER-2024-5678',
      status: 'verified',
      pdfUrl: '#',
      notes: 'Good moral character certificate'
    },
    {
      id: '3',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Transfer Certificate',
      issueDate: '2024-03-25',
      verificationCode: 'EDU-VER-2024-9012',
      status: 'pending',
      pdfUrl: '#',
      notes: 'Transfer certificate - pending verification'
    }
  ];

  const handleDownload = (certificate: Certificate) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleShare = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowQRModal(true);
  };

  const handleView = (certificate: Certificate) => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const stats = [
    {
      label: 'Total Certificates',
      value: certificates.length,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Verified',
      value: certificates.filter(c => c.status === 'verified').length,
      icon: Award,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Pending',
      value: certificates.filter(c => c.status === 'pending').length,
      icon: Calendar,
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          {showAlert && (
            <Alert
              type="info"
              message="This is a demo feature. In a real application, this would download/open the certificate."
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and share your verified certificates</p>
          </div>

          {/* Profile Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center space-x-4">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
              ) : (
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-xl">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Fayda ID: {user?.faydaId}</p>
                <p className="text-gray-600 dark:text-gray-400">School: {user?.schoolName}</p>
              </div>
            </div>
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

          {/* Certificates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={() => handleView(certificate)}
                  onDownload={() => handleDownload(certificate)}
                  onShare={() => handleShare(certificate)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Share Certificate"
        size="md"
      >
        {selectedCertificate && (
          <div className="text-center">
            <QRCodeViewer 
              value={`https://eduverify.app/verify/${selectedCertificate.verificationCode}`}
              className="mb-6"
            />
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Verification Link:</p>
              <p className="text-sm font-mono bg-white dark:bg-gray-600 p-2 rounded border break-all">
                https://eduverify.app/verify/{selectedCertificate.verificationCode}
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Copy Link
              </button>
              <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                Download QR
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;