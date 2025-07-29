import React from 'react';
import { Calendar, Download, Share2, Eye, MoreHorizontal } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateCardProps {
  certificate: Certificate;
  onView?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  showActions?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onDownload,
  onShare,
  showActions = true
}) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {certificate.certificateType}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Student: {certificate.studentName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Institution: {certificate.institutionName}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
          {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Verification Code</p>
        <p className="text-sm font-mono text-gray-900 dark:text-white">{certificate.verificationCode}</p>
      </div>

      {showActions && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {onView && (
              <button
                onClick={onView}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            )}
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;