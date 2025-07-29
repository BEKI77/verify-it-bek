import React, { useState } from 'react';
import { Search, QrCode, CheckCircle, XCircle, AlertCircle, Download, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';

const VerifierVerify: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
    notes: 'Final examination results - Mathematics: A+, Physics: A, Chemistry: A+, English: A, Biology: B+'
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Add to search history
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      if (searchQuery === 'EDU-VER-2024-1234' || searchQuery.toLowerCase().includes('john')) {
        setVerificationResult(mockCertificate);
      } else {
        setVerificationResult({
          ...mockCertificate,
          id: 'not-found',
          studentName: 'Not Found',
          institutionName: 'Certificate not found or invalid',
          certificateType: 'Unknown',
          status: 'rejected',
          notes: 'Certificate verification failed. Please check the verification code and try again.'
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleQuickSearch = (code: string) => {
    setSearchQuery(code);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleDownloadReport = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusIcon = (status: Certificate['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-8 w-8 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const quickSearchCodes = [
    'EDU-VER-2024-1234',
    'EDU-VER-2024-5678',
    'EDU-VER-2024-9012'
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
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
              Verify Certificate
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a verification code or scan QR code to verify certificate authenticity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Verification Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Certificate Verification
                </h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Verification Code or Student Name
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter verification code or student name"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Search className="h-5 w-5" />
                        <span>{isSearching ? 'Verifying...' : 'Verify'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                      <span className="text-sm">OR</span>
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <QrCode className="h-6 w-6" />
                    <span>Scan QR Code</span>
                  </button>
                </form>

                {/* Quick Search Examples */}
                {quickSearchCodes.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Try these demo codes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickSearchCodes.map((code) => (
                        <button
                          key={code}
                          onClick={() => handleQuickSearch(code)}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`rounded-lg border-2 p-6 ${getStatusColor(verificationResult.status)}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Verification Result
                    </h2>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(verificationResult.status)}
                      <span className="text-lg font-semibold">
                        {verificationResult.status === 'verified' ? 'VERIFIED' : 
                         verificationResult.status === 'pending' ? 'PENDING' : 'INVALID'}
                      </span>
                    </div>
                  </div>

                  {verificationResult.status === 'verified' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Student Name
                            </label>
                            <p className="text-lg font-semibold">
                              {verificationResult.studentName}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Student ID
                            </label>
                            <p className="font-mono">
                              {verificationResult.studentId}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Institution
                            </label>
                            <p className="text-lg font-semibold">
                              {verificationResult.institutionName}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Certificate Type
                            </label>
                            <p className="text-lg font-semibold">
                              {verificationResult.certificateType}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Issue Date
                            </label>
                            <p>
                              {new Date(verificationResult.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Verification Code
                            </label>
                            <p className="font-mono text-sm">
                              {verificationResult.verificationCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {verificationResult.notes && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Additional Details
                          </label>
                          <p className="text-sm bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 p-3 rounded-md">
                            {verificationResult.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-4 pt-4 border-t border-current border-opacity-20">
                        <button
                          onClick={handleDownloadReport}
                          className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
                        >
                          <Download className="h-5 w-5" />
                          <span>Download Report</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                          <FileText className="h-5 w-5" />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <XCircle className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <h3 className="text-lg font-semibold mb-2">
                        Certificate Not Found
                      </h3>
                      <p>
                        The verification code you entered is invalid or the certificate does not exist in our system.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Searches</h3>
                  <div className="space-y-2">
                    {searchHistory.map((code, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(code)}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors font-mono"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Guide */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Verify</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <p>Enter the verification code found on the certificate</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <p>Or scan the QR code using your device camera</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <p>Get instant verification results with detailed information</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Contact our support team if you're having trouble verifying a certificate.
                </p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierVerify;