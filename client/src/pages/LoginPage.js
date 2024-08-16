// LoginPage.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../components/Login';

const LoginPage = () => {
    return (
        <GoogleOAuthProvider clientId='542621242409-kjbm9dama0k1diofo2mjiefpsimthjtn.apps.googleusercontent.com'>
            <Login />
        </GoogleOAuthProvider>
    );
};

export default LoginPage;
