import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CertificateCard from '../../components/UI/CertificateCard';
import Alert from '../../components/UI/Alert';
import { Certificate } from '../../types';
import { useInstitution } from '../../context/InstitutionContext';
import axios from 'axios';

const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const { institution, setInstitution } = useInstitution();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if(!BACKEND_URL){
    console
    throw new Error('There is no backend url');
  }


  useEffect(() => {

    const fetchInstitutionData = async () => {
      if (user?.id) {
        try {
          const token = localStorage.getItem('auth_token');

          const response = await axios.get(`${BACKEND_URL}/institutions`,{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });   
          setInstitution(response.data);
          console.log(response);
        } catch (error) {
            console.error('Error fetching institution data:', error);
            setAlertMessage('Failed to fetch institution data.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
      }
    };

    fetchInstitutionData();
  }, [user?.id, setInstitution]);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Institution Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage certificates and student records for {user?.name}
            </p>
          </div>

          {/* Institution Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col items-start space-x-4 space-y-2">
              <div className= "flex space-x-4 ">
                <img src={"https://imgs.search.brave.com/NjDUv5dCmKzKvCWf5M2jsHlS4sNZjyUoh3reNGDtjlA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdGV1cnMtcHJl/bWl1bS9pbnNwaXJh/dGlvbi1jb25jZXB0/aW9uLWxvZ28tdW5p/dmVyc2l0eS1jb2xs/ZWdlLWdyYWR1YXRl/LWNhbXB1cy1lbWJs/ZW1lLWNvbmNlcHRp/b24tbW9kZWxlLXBv/dXItZWNvbGVfNDg2/MTc2LTEzODAuanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MA"} 
                  alt={institution?.website} 
                  className="h-16 w-16 rounded-full object-cover" />
                <div className="h-16 w-auto px-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-xl">
                    {institution?.name}
                  </span>
                </div>

              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email: {user?.email}</p>
                <p className="text-gray-600 dark:text-gray-400">Contact: {institution?.phone}</p>
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