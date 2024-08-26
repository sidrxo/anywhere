// src/pages/LoginPage.js
import React from 'react';
import Login from '../components/Login';
import './page-styles/LoginPage.css'; // Import your CSS file

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h3>welcome to chroma.</h3>
        <p className="or-text">the image library for product designers</p>
        <Login />
        <div className="login-form">
        <label className="email-label" htmlFor="email">Email</label>
          <input type="email" placeholder="enter your email" className="login-input" />
          <button className="email-login-button">Continue with email</button>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
