import React, { useState } from 'react';
import { Download, Share2, Search, Filter, Calendar, Award, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import CertificateCard from '../../components/UI/CertificateCard';
import QRCodeViewer from '../../components/UI/QRCodeViewer';
import Modal from '../../components/UI/Modal';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';

const StudentCertificates: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
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
      pdfUrl: '#',
      notes: 'Final examination results - Mathematics: A+, Physics: A, Chemistry: A'
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
      notes: 'Good moral character certificate for college admission'
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
      notes: 'Transfer certificate - pending verification from registrar'
    },
    {
      id: '4',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Class 10 Marksheet',
      issueDate: '2022-05-10',
      verificationCode: 'EDU-VER-2022-3456',
      status: 'verified',
      pdfUrl: '#',
      notes: 'Secondary school completion certificate'
    },
    {
      id: '5',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Sports Certificate',
      issueDate: '2023-12-15',
      verificationCode: 'EDU-VER-2023-7890',
      status: 'verified',
      pdfUrl: '#',
      notes: 'Inter-school basketball championship - First place'
    },
    {
      id: '6',
      studentName: 'John Doe',
      studentId: 'STU001',
      institutionName: 'Delhi Public School',
      certificateType: 'Migration Certificate',
      issueDate: '2024-04-01',
      verificationCode: 'EDU-VER-2024-1111',
      status: 'rejected',
      pdfUrl: '#',
      notes: 'Migration certificate - rejected due to incomplete documentation'
    }
  ];

  const filteredCertificates = allCertificates.filter(cert => {
    const matchesSearch = cert.certificateType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const getStatusStats = () => {
    return {
      total: allCertificates.length,
      verified: allCertificates.filter(c => c.status === 'verified').length,
      pending: allCertificates.filter(c => c.status === 'pending').length,
      rejected: allCertificates.filter(c => c.status === 'rejected').length
    };
  };

  const stats = getStatusStats();

  return (
    <div className="flex  bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Certificates</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage all your academic certificates</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.verified}</p>
                </div>
                <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                </div>
                <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
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
            </div>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => handleView(certificate)}
                onDownload={() => handleDownload(certificate)}
                onShare={() => handleShare(certificate)}
              />
            ))}
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No certificates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Your certificates will appear here once they are issued by your institution.'
                }
              </p>
            </div>
          )}
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

export default StudentCertificates;