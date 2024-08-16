// src/pages/LoginPage.js
import React from 'react';
import { GoogleLogin } from 'react-google-login';

const LoginPage = () => {
  const handleSuccess = (response) => {
    // Handle login success
    console.log(response);
  };

  const handleFailure = (error) => {
    // Handle login failure
    console.error('Login Error:', error);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <GoogleLogin
        clientId="kjbm9dama0k1diofo2mjiefpsimthjtn"
        buttonText="Login with Google"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default LoginPage;
