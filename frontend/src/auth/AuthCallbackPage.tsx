import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SignJWT, importJWK, decodeJwt } from 'jose';
import { Buffer } from 'buffer';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthCallbackPage: React.FC = () => {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('Processing authentication...');
  const location = useLocation();

  useEffect(() => {
    const fetchTokenAndUserInfo = async (code: string) => {
      try {
        setStatusMessage('Validating authorization code...');
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const tokenEndpoint = import.meta.env.VITE_TOKEN_ENDPOINT;
        const redirectUri = import.meta.env.VITE_REDIRECT_URI;
        const clientAssertionType = import.meta.env.VITE_CLIENT_ASSERTION_TYPE;

        if (!clientId || !tokenEndpoint || !redirectUri || !clientAssertionType) {
          console.error("Missing required OIDC environment variables");
          setStatusMessage('Configuration error. Please contact support.');
          return;
        }

        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

        if (!codeVerifier) {
          console.error("Missing PKCE code_verifier in sessionStorage");
          setStatusMessage('Session error. Please try logging in again.');
          return;
        }

        setStatusMessage('Generating signed JWT...');
        const signedJwt = await generateSignedJwt(clientId, tokenEndpoint);

        setStatusMessage('Exchanging authorization code for tokens...');
        const response = await axios.post(
          '/api/v1/esignet/oauth/v2/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_assertion_type: clientAssertionType,
            client_secret: signedJwt,
            code_verifier: codeVerifier
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = response.data;

        setStatusMessage('Fetching user information...');
        const userInfoResponse = await axios.get(import.meta.env.VITE_USERINFO_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });

        const decoded = decodeJwt(userInfoResponse.data);

        console.log("Decoded user info:", decoded);

        setUserInfo(decoded);

        handleAuthCallback(decoded as any as User);

        toast.info("Login successful");
        setStatusMessage('Redirecting to dashboard...');
        navigate('/student-dashboard');
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

const generateSignedJwt = async (clientId: string, tokenEndpoint: string) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 15 * 60; // match Python's 15 min expiration

  const privateJwkStr = Buffer.from(import.meta.env.VITE_PRIVATE_KEY, 'base64').toString('utf-8');
  const jwkJson = JSON.parse(privateJwkStr);

  const privateKey = await importJWK(jwkJson, 'RS256');

  console.log(privateKey);

  const jwt = await new SignJWT({
    iss: clientId,
    sub: clientId,
    aud: tokenEndpoint,
    iat: now,
    exp: exp
  })
    .setProtectedHeader({
      alg: 'RS256',
      typ: 'JWT',
      ...(jwkJson.kid && { kid: jwkJson.kid })
    })
    .sign(privateKey);

  return jwt;
};

export default AuthCallbackPage;