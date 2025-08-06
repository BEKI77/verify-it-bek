import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, FileText } from 'lucide-react';
import axios from 'axios';

interface Certificate {
  certificateId: string;
  fullName: string;
  program: string;
  fieldOfStudy: string;
  institutionId: number;
  institutionName: string;
  institutionsEmail: string;
  issuedAt: string;
  expiresAt: string | null;
  status: string;
  fileUrl: string | null;
  verified: boolean;
  hash: string;
  createdAt: string;
}

const InstitutionCertificates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewButton , setViewButton ] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'revoked'>('all');
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth_token');

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/institutions/certificates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllCertificates(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch certificates');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = allCertificates.filter(cert => {
    const matchesSearch =
      cert.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.fieldOfStudy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleView = async(certificate: Certificate) => {
    setViewButton(true);
    const verifyLink = `${import.meta.env.VITE_BACKEND_URL}/verify?certificateId=${certificate.certificateId}`;

      // Make a GET request to the verify link using axios
    const response = await axios.get(verifyLink);
    const pdfUrl = response.data.data.pdfUrl;
    window.open(pdfUrl || '#', '_blank');
    setViewButton(false)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'revoked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Certificates</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track all issued certificates</p>
          </div>

          {/* Loading/Error */}
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading certificates...</p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          ) : (
            <>
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
                        placeholder="Search by name, program, or field of study..."
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
                      <option value="valid">Valid</option>
                      <option value="revoked">Revoked</option>
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
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Program
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Field of Study
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Issued At
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
                        <tr key={certificate.certificateId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {certificate.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {certificate.program}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {certificate.fieldOfStudy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(certificate.issuedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(certificate.status)}`}>
                              {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleView(certificate)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              disabled={viewButton}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
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
                      {searchQuery || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No certificates available.'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionCertificates;