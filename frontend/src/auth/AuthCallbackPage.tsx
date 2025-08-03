import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthCallbackPage: React.FC = () => {
  const { handleAuthCallback } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'institution' | 'verifier'>('student');
  const hasFetched = useRef(false);
  const [statusMessage, setStatusMessage] = useState('Processing authentication...');
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (hasFetched.current) return; // Prevent double execution
    hasFetched.current = true;

    const fetchTokenAndUserInfo = async (code: string) => {
      try {
        setStatusMessage('Validating authorization code...');

        setStatusMessage('Exchanging authorization code for tokens...'); 

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/token`,
          { code }
        );

        const { access_token } = response.data;

        setStatusMessage('Fetching user information...');

        const userInfo = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/userinfo/`, {
          access_token: access_token
        });

        console.log("Decoded user info:", userInfo.data);

        const res = await handleAuthCallback(userInfo.data);

        if(!res){
          return null;
        }
      
        setSelectedRole(res);
        
        const dashboardRoutes = {
          student: "/student-dashboard",
          institution: "/institution-dashboard",
          verifier: "/verifier-dashboard",
        };
      
        navigate(dashboardRoutes[selectedRole]);

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
    }
  }, [location.search]);

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