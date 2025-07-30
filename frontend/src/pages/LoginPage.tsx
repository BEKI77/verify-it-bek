import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Building, Search } from 'lucide-react';
import Alert from '../components/UI/Alert';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'institution' | 'verifier'>('student');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const { login } = useAuth();
  const [faydaUrl, setFaydaUrl] = useState<string>('');


  async function generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(new Uint8Array(digest));
  }

  function base64UrlEncode(buffer : any) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }


  function generateCodeVerifier(length = 43) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let verifier = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      verifier += charset[values[i] % charset.length];
    }
    return verifier;
  }

  const code_Verifier = generateCodeVerifier();

  useEffect(() => {
    async function prepareUrl() {
      sessionStorage.setItem('pkce_code_verifier', code_Verifier);

      const code_challenge  = await generateCodeChallenge(code_Verifier);

      console.log(`code_varifier:  ${code_Verifier}`);
      console.log(`code_challenge: ${code_challenge}`);

      

      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_CLIENT_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        scope: 'openid profile email',
        state: 'ptOO76SD',
        code_challenge: code_challenge,
        code_challenge_method: 'S256',
        acr_values: 'mosip:idp:acr:generated-code',
        claims_locales: 'en am',
        claims: JSON.stringify({
          userinfo: {
            name: { essential: true },
            phone: { essential: true },
            email: { essential: true },
            picture: { essential: true },
            gender: { essential: true },
            birthdate: { essential: true },
            address: { essential: true }
          },
          id_token: {}
        })
      });
      
      setFaydaUrl(`${import.meta.env.VITE_AUTHORIZATION_ENDPOINT}?${params.toString()}`);
    }
    prepareUrl();
  }, []);


  const roleOptions = [
    {
      value: 'student' as const,
      label: 'Student',
      icon: User,
      description: 'Access and share your certificates',
      demoEmail: 'student@example.com'
    },
    {
      value: 'institution' as const,
      label: 'Institution',
      icon: Building,
      description: 'Issue and manage certificates',
      demoEmail: 'institution@example.com'
    },
    {
      value: 'verifier' as const,
      label: 'Verifier',
      icon: Search,
      description: 'Verify certificate authenticity',
      demoEmail: 'verifier@example.com'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    // Mock login validation
    const validEmails = {
      student: 'student@example.com',
      institution: 'institution@example.com',
      verifier: 'verifier@example.com'
    };

    if (email === validEmails[selectedRole]) {
      login(email, selectedRole);
      
      // Redirect based on role
      const dashboardRoutes = {
        student: '/student-dashboard',
        institution: '/institution-dashboard',
        verifier: '/verifier-dashboard'
      };
      
      navigate(dashboardRoutes[selectedRole]);
    } else {
      setShowError(true);
    }
  };

  const handleDemoLogin = (role: typeof selectedRole) => {
    const demoEmails = {
      student: 'student@example.com',
      institution: 'institution@example.com',
      verifier: 'verifier@example.com'
    };
    
    setSelectedRole(role);
    setEmail(demoEmails[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Login to EduVerify
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Secure certificate verification powered by Fayda ID
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {showError && (
            <Alert
              type="error"
              message="Invalid credentials. Please use the demo accounts provided."
              onClose={() => setShowError(false)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedRole(option.value)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedRole === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${
                          selectedRole === option.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            selectedRole === option.value 
                              ? 'text-blue-900 dark:text-blue-200' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {option.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="my-6 text-center text-gray-500 dark:text-gray-400 font-medium">or</p>
          <a
            href={faydaUrl}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <img
              src="https://fayda.id/assets/fayda-logo.svg"
              alt="Fayda E-Signet"
              className="h-5 w-5 mr-2"
              style={{ background: 'white', borderRadius: '50%' }}
            />
            Login with Fayda E-Signet
          </a>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Demo Accounts
            </p>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDemoLogin(option.value)}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{option.label}:</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">{option.demoEmail}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Institution Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New institution?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Contact us for registration
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;