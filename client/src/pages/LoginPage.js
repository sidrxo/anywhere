import React, { useState } from 'react';
import axios from 'axios';
import './page-styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(null); // `null` means no check done yet

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7001/auth/check-email', { email });
      setEmailExists(response.data.exists);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h3>welcome to chroma.</h3>
        <p className="or-text">the image library for product designers</p>
        <Login />
        {!emailExists && emailExists !== null ? (
          // Sign-up form if email is not registered
          <div className="login-form">
            <h4>Sign Up</h4>
            <label htmlFor="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="Enter your first name" />
            <label htmlFor="last-name">Last Name</label>
            <input type="text" id="last-name" placeholder="Enter your last name" />
            <label className="email-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
            />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" />
            <button className="email-login-button">Sign Up</button>
          </div>
        ) : emailExists === true ? (
          // Login form if email is registered
          <div className="login-form">
            <h4>Login</h4>
            <label className="email-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
            />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
            <button className="email-login-button">Login</button>
          </div>
        ) : (
          // Email input form
          <div className="login-form">
            <label className="email-label" htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={handleEmailChange}
            />
            <button className="email-login-button" onClick={handleEmailSubmit}>
              Continue with email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
