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
  const [continueClicked, setContinueClicked] = useState(false); // New state
  const [hideLogin, setHideLogin] = useState(false); // New state for hiding the form
  const [hideGoogleOr, setHideGoogleOr] = useState(false); // New state for hiding Google and "or" text

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setContinueClicked(true); // Trigger animation when user clicks "Continue with email"
    setTimeout(() => setHideLogin(true), 500); // Hide login form after animation duration
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/check-email`, { email });
      setEmailExists(response.data.exists);

      if (response.data.exists) {
        // Update the URL to /sign-up
        window.history.pushState({}, '', '/sign-up');
      } else {
        // Update the URL to /login
        window.history.pushState({}, '', '/login');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/sign-up`, { name, email, password });
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
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });
      if (response.status === 200) {
        window.location.href = '/profile'; // Redirect to /profile
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleGoogleClick = () => {
    setHideGoogleOr(true); // Trigger hide animation for Google and "or" text
    setTimeout(() => {
      setContinueClicked(true); // Trigger slide-up animation for password input
    }, 500); // Ensure this runs after Google and "or" text animation
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
    }, 2000); // Rotate every 2 seconds

    return () => clearInterval(interval); // Clean up on component unmount
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

        {/* Wrap the Login component in its own div and apply the fade-out and move-up animation */}
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
            />
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
              placeholder="create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
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
            />
            <input
              type="password"
              id="password"
              placeholder="enter your password"
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
              placeholder="enter your email"
              className="login-input"
              value={email}
              onChange={handleEmailChange}
            />
            <button className="email-login-button" onClick={handleEmailSubmit}>
              continue with email
            </button>
          </div>
        )}
      </div>
      <div className="login-image">
        <img src={randomImageUrl}/>
      </div>
    </div>
  );
};

export default LoginPage;
