import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Redirect to Google OAuth login route
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
