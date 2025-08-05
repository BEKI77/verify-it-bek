import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthCallbackPage: React.FC = () => {
  const { handleAuthCallback } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const hasFetched = useRef(false);
  const [statusMessage, setStatusMessage] = useState('Processing authentication...');
  const navigate = useNavigate();
  const location = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;

    const fetchTokenAndUserInfo = async (code: string) => {
      try {
        setStatusMessage('Validating authorization code...');

        setStatusMessage('Exchanging authorization code for tokens...'); 

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/token`,
          { code }
        );

        const { access_token } = response.data;

        setAccessToken(access_token);
        setShowRoleSelection(true);

      } catch (error: any) {
          console.error('OIDC flow failed:', error.response?.data || error.message);
          toast.error('Login failed. Please try again.');
          setStatusMessage('Authentication failed. Redirecting to login...');
          navigate('/login');
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      fetchTokenAndUserInfo(code);
    }else{
       navigate('/login');
    }
  }, [location.search]);

  const handleRoleSelection = async(role: 'student' | 'verifier') => {
    try{
      if(!accessToken){
        toast.error('Access token is missing.  Please try again.');
        return;
      }

      setLoading(true);
      setStatusMessage('Submitting selected role ...');
      setStatusMessage('Fetching user information...');

      const userInfo = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/userinfo`, { 
          access_token: accessToken,
          role
      });

      const res = await handleAuthCallback(userInfo.data.data);

      if(!res){
        return null;
      }
    
      setShowRoleSelection(true);
      
      const dashboardRoutes = {
        "student": "/student-dashboard/",
        "institution": "/institution-dashboard/",
        "verifier": "/verifier-dashboard/",
      };
      
      navigate(dashboardRoutes[role]);
    } catch( error: any) {
        console.error(`Role submission or user info fetch failed: `, error);
        toast.error(`Failed to complete authentication. Please try again.`);
        navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  if (showRoleSelection) {
    return (
      <div className="text-center mt-12">
      <h2 className="mb-5 text-2xl font-semibold text-gray-800">Select Your Role</h2>
      <button
        onClick={() => handleRoleSelection('student')}
        className={`px-6 py-2 mx-2 rounded-md transition duration-200 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        disabled={loading}
      >
        Student
      </button>
      <button
        onClick={() => handleRoleSelection('verifier')}
        className={`px-6 py-2 mx-2 rounded-md transition duration-200 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        disabled={loading}
      >
        Verifier
      </button>
    </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div className="spinner" style={{ marginBottom: '20px' }}>
        <div className="double-bounce1" style={spinnerStyle}></div>
        <div className="double-bounce2" style={spinnerStyle}></div>
      </div>
      <p>{statusMessage}</p>
    </div>
  );
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#3498db',
  animation: 'bounce 2s infinite ease-in-out',
  display: 'inline-block',
  margin: '0 5px',
};

export default AuthCallbackPage;