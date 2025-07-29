import React, { useEffect,  useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SignJWT, importJWK, decodeJwt } from 'jose';
import { Buffer } from 'buffer';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  const location = useLocation();
  useEffect(() => {
    const fetchToken = async (code :string) => {
      try {

        const clientId = import.meta.env.VITE_CLIENT_ID ;

        if(!clientId){
            console.log("No client id")
            return null;
        }

        const signedJwt = await generateSignedJwt(clientId);
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
        console.log(`Code_verifier: ${codeVerifier}`);

        if(!codeVerifier){
          return null;
        }

        const response = await axios.post(
          '/api/v1/esignet/oauth/v2/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: import.meta.env.VITE_REDIRECT_URL,
            client_id: clientId,
            client_assertion_type: import.meta.env.VITE_CLIENT_ASSERTION_TYPE,
            client_assertion: signedJwt,
            code_verifier: codeVerifier
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = response.data;
        console.log("Access token:", access_token);

        const userInfoResponse = await axios.get('/api/v1/esignet/oidc/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        console.log("User info response:", userInfoResponse.data);
        const decodedUserInfo = await decodeUserInfoResponse(userInfoResponse.data);
        console.log("Decoded user info:", decodedUserInfo);

        // Store the decoded user info in state
        setUserInfo(decodedUserInfo);
        if(decodedUserInfo){
            navigate('/student-dashboard');
        }

      } catch (error) {
        console.error('Error fetching token or user info:', error);
      }
    };

    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      fetchToken(code);
    }

  }, [location.search]);

  return <div>Processing authentication...</div>;
};

const generateSignedJwt = async (clientId : string) => {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 2 * 60 * 60; // 2 hours from now

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: import.meta.env.VITE_TOKEN_ENDPOINT,
    iat: now,
    exp: exp,
  };

  const decodeKey = Buffer.from(import.meta.env.VITE_PRIVATE_KEY, 'base64').toString('utf-8');
  const jwk = JSON.parse(decodeKey);
  const privateKey = await importJWK(jwk, 'RS256');

  // const privateKey = await jose.importJWK(jwkObject, import.meta.env.VITE_ALGORITHM);

  // const jwt = await new jose.SignJWT(payload)
  //   .setProtectedHeader(header)
  //   .sign(privateKey);

  const jwt = await new SignJWT({
    iss: clientId,
    sub: clientId,
    aud: import.meta.env.VITE_TOKEN_ENDPOINT,
    iat: now,
    exp: exp
  })
  .setProtectedHeader({ alg: 'RS256', kid: jwk.kid })
  .sign(privateKey);

  console.log(jwt);
  console.log(jwk);
  return jwt;
};

const decodeUserInfoResponse = async (userinfoJwtToken: string) => {
  try {
    return decodeJwt(userinfoJwtToken);
  } catch (error) {
    console.error('Error decoding JWT user info:', error);
    return null;
  }
};

export default AuthCallbackPage;