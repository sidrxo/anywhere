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
  const [continueClicked, setContinueClicked] = useState(false);
  const [hideLogin, setHideLogin] = useState(false);
  const [hideGoogleOr, setHideGoogleOr] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setContinueClicked(true);
    setTimeout(() => setHideLogin(true), 500);
    try {
      const response = await axios.post('http://localhost:7001/auth/check-email', { email });
      setEmailExists(response.data.exists);

      if (response.data.exists) {
        window.history.pushState({}, '', '/sign-up');
      } else {
        window.history.pushState({}, '', '/login');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/sign-up`, { name, email, password });
      if (response.status === 201) {
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { email, password });
      if (response.status === 200) {
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleGoogleClick = () => {
    setHideGoogleOr(true);
    setTimeout(() => {
      setContinueClicked(true);
    }, 500);
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/random-image`);
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
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-page">
      <button className="back-button" onClick={() => window.history.back()}>
        &larr; 
      </button>
      <div className="login-container">
        <h3>welcome to <span className="gradient-text">chroma</span>.</h3>
        <p className="or-text">
          <span className="fixed-text">the image library for&nbsp;&nbsp;</span>
          <span className={`role-text ${isSliding ? 'slide-off' : 'slide-on'}`}>
            {roles[currentRoleIndex]}
          </span>
        </p>

        <div className={`login-form-container ${continueClicked ? 'move-up-and-fade-out' : ''} ${hideLogin ? 'hide' : ''}`}>
          <Login />
          <div className="or-divider">
            <span>or</span>
          </div>
        </div>

        {!emailExists && emailExists !== null ? (
          <div className={`signup-form ${continueClicked ? 'slide-up-password' : ''}`}>
            <input
              type="text"
              id="name"
              placeholder="enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
              required
            />
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button className="email-login-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        ) : emailExists === true ? (
          <div className={`login-form ${continueClicked ? 'slide-up-password' : ''}`}>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              className="login-input"
              required
            />
            <input
              type="password"
              id="password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-password"
              required
            />
            <button className="email-login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        ) : (
          <div className="login-form">
            <input
              type="email"
              placeholder="enter your email"
              className="login-input"
              value={email}
              onChange={handleEmailChange}
              required
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
