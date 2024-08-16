// Login.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const handleSuccess = (response) => {
        // Handle successful login, e.g., redirect or fetch user info
        console.log('Login Successful:', response);
        window.location.href = '/auth/google'; // Redirect to your backend for further handling
    };

    const handleFailure = (error) => {
        console.error('Login failed:', error);
    };

    return (
        <div className="login-container">
            <h2>Login with Google</h2>
            <GoogleLogin
                onSuccess={handleSuccess}
                onFailure={handleFailure}
            />
        </div>
    );
};

export default Login;
