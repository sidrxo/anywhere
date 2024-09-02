import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../components/Login';
import './page-styles/LoginPage.css';

const roles = [
  "product designers.",
  "graphic designers.",
  "UX/UI designers.",
  "web developers.",
  "art directors.",
  "visual artists."
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [emailExists, setEmailExists] = useState(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        setIsSliding(false);
      }, 500); // Duration of the slide transition
    }, 1300); // Rotate every 3 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <div className="login-page">
      <div className="login-container">
        <h3>welcome to chroma.</h3>
        <p className="or-text">
          <span className="fixed-text">the image library for&nbsp;</span>
          <span className={`role-text ${isSliding ? 'slide-off' : 'slide-on'}`}>
            {roles[currentRoleIndex]}
          </span>
        </p>
        <Login />
        {!emailExists && emailExists !== null ? (
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
