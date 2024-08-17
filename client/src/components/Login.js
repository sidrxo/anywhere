// src/components/Login.js
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const onSuccess = (response) => {
    console.log(response);
    // You can send the response to your backend to validate and create a session
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
