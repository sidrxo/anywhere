// Login.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleSuccess = (response) => {
        console.log('Login Successful:', response);
        // Redirect to your profile page
        navigate('/profile');
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
