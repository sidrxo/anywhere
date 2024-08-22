import React from 'react';
import GoogleSignInButton from './GoogleSignInButton'; // Adjust the import path as necessary
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/auth/google`;
    };

    return (
        <div>
            <h1>Login</h1>
            <GoogleSignInButton onClick={handleGoogleLogin} />
        </div>
    );
};

export default Login;
