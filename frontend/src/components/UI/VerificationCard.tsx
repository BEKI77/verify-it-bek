import React from 'react';
import { 
  Shield, 
  User, 
  GraduationCap, 
  Building, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Hash, 
  Download,
  Clock
} from 'lucide-react';

interface VerificationDetailsProps {
  certificateId: string;
  fullName: string;
  program: string;
  fieldOfStudy: string;
  institutionId: number;
  institutionsEmail: string;
  issuedAt: string;
  institutionName: string;
  verified: boolean;
  hash: string;
  createdAt: string;
  fileUrl?: string;
  expiresAt?: string;
}

const VerificationDetailsCard: React.FC<VerificationDetailsProps> = ({
  certificateId,
  fullName,
  program,
  fieldOfStudy,
  institutionId,
  institutionsEmail,
  issuedAt,
  institutionName,
  verified,
  hash,
  createdAt,
  fileUrl,
  expiresAt,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateHash = (hashString: string) => {
    return `${hashString.substring(0, 8)}...${hashString.substring(hashString.length - 8)}`;
  };

  const detailItems = [
    {
      icon: Shield,
      label: 'Certificate ID',
      value: certificateId,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: User,
      label: 'Full Name',
      value: fullName,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: GraduationCap,
      label: 'Program',
      value: program,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: GraduationCap,
      label: 'Field of Study',
      value: fieldOfStudy,
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: Building,
      label: 'Institution Name',
      value: institutionName,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Shield,
      label: 'Institution ID',
      value: institutionId,
      color: 'text-gray-600 dark:text-gray-400'
    },
    {
      icon: Mail,
      label: 'Institution Email',
      value: institutionsEmail,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      label: 'Issued Date',
      value: formatDate(issuedAt),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Calendar,
      label: 'Created Date',
      value: formatDate(createdAt),
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  if (expiresAt) {
    detailItems.push({
      icon: Clock,
      label: 'Expires Date',
      value: formatDate(expiresAt),
      color: 'text-yellow-600 dark:text-yellow-400'
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Certificate Verification Details</span>
          </h2>
          <div className="flex items-center space-x-2">
            {verified ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              verified 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {verified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className={`h-5 w-5 ${item.color} mt-0.5`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hash Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Hash className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Certificate Hash
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Certificate PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetailsCard;