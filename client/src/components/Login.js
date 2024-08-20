import React from 'react';
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL; // Your API base URL
axios.defaults.withCredentials = true; // Ensure cookies are included in requests


const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:7000/auth/google';
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
