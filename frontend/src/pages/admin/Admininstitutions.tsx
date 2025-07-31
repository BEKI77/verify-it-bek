import React, { useState } from 'react';
import { Search, Filter, Plus, Building, Mail, Phone, Calendar, CheckCircle, Clock, Ban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Layout/Sidebar';
import Modal from '../../components/UI/Modal';
import Alert from '../../components/UI/Alert';

interface Institution {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  faydaId: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  certificatesIssued: number;
  studentsCount: number;
  logo?: string;
}

const AdminInstitutions: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [newInstitution, setNewInstitution] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: ''
  });

  // Mock institutions data
  const allInstitutions: Institution[] = [
    {
      id: '1',
      name: 'Delhi Public School',
      email: 'admin@dps.edu',
      phone: '+91 98765 43210',
      address: '123 Education Street, New Delhi, India',
      faydaId: 'FYD-INS-001',
      registrationDate: '2023-12-01',
      status: 'active',
      certificatesIssued: 1234,
      studentsCount: 856,
      logo: 'https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: '2',
      name: 'St. Mary\'s School',
      email: 'contact@stmarys.edu',
      phone: '+91 98765 43211',
      address: '456 Learning Avenue, Mumbai, India',
      faydaId: 'FYD-INS-002',
      registrationDate: '2024-01-15',
      status: 'active',
      certificatesIssued: 892,
      studentsCount: 634
    },
    {
      id: '3',
      name: 'Green Valley School',
      email: 'info@greenvalley.edu',
      phone: '+91 98765 43212',
      address: '789 Knowledge Road, Bangalore, India',
      faydaId: 'FYD-INS-003',
      registrationDate: '2024-03-01',
      status: 'pending',
      certificatesIssued: 0,
      studentsCount: 0
    },
    {
      id: '4',
      name: 'Central High School',
      email: 'admin@centralhs.edu',
      phone: '+91 98765 43213',
      address: '321 Academic Lane, Chennai, India',
      faydaId: 'FYD-INS-004',
      registrationDate: '2024-02-10',
      status: 'active',
      certificatesIssued: 567,
      studentsCount: 423
    },
    {
      id: '5',
      name: 'Sunrise Academy',
      email: 'contact@sunrise.edu',
      phone: '+91 98765 43214',
      address: '654 Education Park, Pune, India',
      faydaId: 'FYD-INS-005',
      registrationDate: '2024-01-20',
      status: 'suspended',
      certificatesIssued: 234,
      studentsCount: 189
    }
  ];

  const filteredInstitutions = allInstitutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.faydaId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inst.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(`Institution ${newInstitution.name} registered successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setShowAddModal(false);
    setNewInstitution({
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: ''
    });
  };

  const handleInstitutionAction = (action: string, institutionId: string) => {
    setAlertMessage(`Institution ${action} successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusColor = (status: Institution['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: Institution['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'suspended':
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <Building className="h-4 w-4 text-gray-600" />;
    }
  };

  const stats = [
    {
      label: 'Total Institutions',
      value: allInstitutions.length,
      icon: Building,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active',
      value: allInstitutions.filter(i => i.status === 'active').length,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Pending Approval',
      value: allInstitutions.filter(i => i.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      label: 'Total Certificates',
      value: allInstitutions.reduce((sum, i) => sum + i.certificatesIssued, 0).toLocaleString(),
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
              type="success"
              message={alertMessage}
              onClose={() => setShowAlert(false)}
              className="mb-6"
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Institution Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage educational institutions and their registrations</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Institution</span>
              </button>
            </div>
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
                    placeholder="Search by name, email, or Fayda ID..."
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <div key={institution.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {institution.logo ? (
                      <img src={institution.logo} alt={institution.name} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{institution.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{institution.faydaId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(institution.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(institution.status)}`}>
                      {institution.status.charAt(0).toUpperCase() + institution.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-2" />
                    {institution.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2" />
                    {institution.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Registered: {new Date(institution.registrationDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{institution.certificatesIssued}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Certificates</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{institution.studentsCount}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {institution.status === 'pending' && (
                    <button
                      onClick={() => handleInstitutionAction('approved', institution.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {institution.status === 'active' && (
                    <button
                      onClick={() => handleInstitutionAction('suspended', institution.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Suspend
                    </button>
                  )}
                  {institution.status === 'suspended' && (
                    <button
                      onClick={() => handleInstitutionAction('reactivated', institution.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Reactivate
                    </button>
                  )}
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No institutions found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by adding your first institution.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Institution Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Institution"
        size="lg"
      >
        <form onSubmit={handleAddInstitution} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Institution Name *
            </label>
            <input
              type="text"
              value={newInstitution.name}
              onChange={(e) => setNewInstitution({...newInstitution, name: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter institution name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={newInstitution.email}
                onChange={(e) => setNewInstitution({...newInstitution, email: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@institution.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={newInstitution.phone}
                onChange={(e) => setNewInstitution({...newInstitution, phone: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <textarea
              value={newInstitution.address}
              onChange={(e) => setNewInstitution({...newInstitution, address: e.target.value})}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={newInstitution.contactPerson}
              onChange={(e) => setNewInstitution({...newInstitution, contactPerson: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Primary contact person name"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Register Institution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminInstitutions;