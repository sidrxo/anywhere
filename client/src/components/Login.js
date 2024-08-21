import React from 'react';
import axios from 'axios';


axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL; // Replace with your backend URL
axios.defaults.withCredentials = true; // Ensure cookies are included in requests


const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/auth/google`;
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};


export default Login;
