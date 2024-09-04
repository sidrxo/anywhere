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
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [randomImageUrl, setRandomImageUrl] = useState('');

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7001/auth/sign-up', { name, email, password });
      if (response.status === 201) {
        window.location.href = '/profile'; // Redirect to /profile
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7001/auth/login', { email, password });
      if (response.status === 200) {
        window.location.href = '/profile'; // Redirect to /profile
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get('http://localhost:5050/random-image');
        setRandomImageUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching random image:', error);
      }
    };

    fetchRandomImage();

    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
        setIsSliding(false);
      }, 500); // Duration of the slide transition
    }, 2000); // Rotate every 3 seconds

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
          <div className="signup-form">
            <h4>Sign Up</h4>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="email-login-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        ) : emailExists === true ? (
          <div className="login-form">
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
            />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-password"
            />
            <button className="email-login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        ) : (
          <div className="login-form">
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
      <div className="login-image">
        <img src={randomImageUrl} alt="Random" />
      </div>
    </div>
  );
};

export default LoginPage;
